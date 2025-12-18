import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { renderToBuffer } from "@react-pdf/renderer";
import { put } from "@vercel/blob";
import { resend } from "@/lib/resend";
import { ContractPDF } from "@/lib/contract-pdf";
import { ContractClientEmail } from "@/emails/contract-client";
import { ContractOwnerEmail } from "@/emails/contract-owner";
import type { OnboardingFormData, PricingResult } from "@/lib/onboarding-logic";
import { SERVICE_LABELS } from "@/lib/onboarding-logic";
import {
  findOrCreateContact,
  createDepositInvoice,
  sendInvoiceByEmail,
  type BexioContact,
  type BexioInvoice,
} from "@/lib/bexio";

// Sanity client with write access
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

interface SubmitRequest {
  formData: OnboardingFormData;
  pricing: PricingResult;
  signatureDataUrl: string;
  contractVersion: string;
}

// Fetch contract template from CMS
async function getContractTemplate() {
  try {
    return await sanityClient.fetch(
      `*[_type == "contractTemplate" && isActive == true][0] {
        _id,
        version,
        companyInfo {
          name,
          owner,
          "address": street + ", " + zipCity,
          email,
          phone
        },
        clauses {
          preamble,
          scopeOfWork,
          deposit,
          cancellation,
          clientObligations,
          forceMajeure,
          paymentTerms,
          liability,
          usageRights,
          jurisdiction
        },
        cancellationDays
      }`
    );
  } catch {
    return null;
  }
}

// Fetch email settings from CMS
async function getEmailSettings() {
  try {
    return await sanityClient.fetch(
      `*[_id == "emailSettings"][0] {
        enabled,
        recipientEmail,
        senderEmail,
        senderName,
        subjectPrefix
      }`
    );
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitRequest = await request.json();
    const { formData, pricing, signatureDataUrl, contractVersion } = body;

    // Validate required fields
    if (!formData.clientInfo.name || !formData.clientInfo.email) {
      return NextResponse.json(
        { error: "Bitte füllen Sie alle Pflichtfelder aus." },
        { status: 400 }
      );
    }

    if (!signatureDataUrl) {
      return NextResponse.json(
        { error: "Bitte unterschreiben Sie den Vertrag." },
        { status: 400 }
      );
    }

    // Get client IP and user agent
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const signedAt = new Date().toISOString();

    // Fetch contract template
    const contractTemplate = await getContractTemplate();

    // Generate PDF
    let pdfUrl = "";
    try {
      const pdfBuffer = await renderToBuffer(
        ContractPDF({
          formData,
          pricing,
          signatureDataUrl,
          signedAt,
          contractVersion,
          companyInfo: contractTemplate?.companyInfo,
          clauses: contractTemplate?.clauses,
          cancellationDays: contractTemplate?.cancellationDays,
        })
      );

      // Upload to Vercel Blob
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const filename = `contracts/${formData.serviceType}-${Date.now()}.pdf`;
        const blob = await put(filename, pdfBuffer, {
          access: "public",
          contentType: "application/pdf",
        });
        pdfUrl = blob.url;
        console.log("PDF uploaded to:", pdfUrl);
      } else {
        console.warn("BLOB_READ_WRITE_TOKEN not set - PDF not stored");
      }
    } catch (pdfError) {
      console.error("PDF generation error:", pdfError);
      // Continue without PDF - still save to Sanity and send basic emails
    }

    // Save to Sanity
    let sanityDocId = "";
    if (process.env.SANITY_API_TOKEN) {
      try {
        const document = {
          _type: "projectOnboarding",
          clientInfo: {
            name: formData.clientInfo.name,
            company: formData.clientInfo.company || undefined,
            email: formData.clientInfo.email,
            phone: formData.clientInfo.phone,
            street: formData.clientInfo.street || undefined,
            zipCity: formData.clientInfo.zipCity || undefined,
          },
          serviceType: formData.serviceType,
          projectDetails: {
            projectName: formData.projectDetails.projectName,
            description: formData.projectDetails.description || undefined,
            deadline: formData.projectDetails.deadline || undefined,
            shootingDate: formData.projectDetails.shootingDate || undefined,
            budget: formData.projectDetails.budget || undefined,
            locations: formData.projectDetails.locations || [],
          },
          serviceSpecificData: JSON.stringify(formData.serviceSpecificData),
          extras: formData.extras,
          pricing: {
            estimatedTotal: pricing.totalPrice,
            depositPercentage: pricing.depositPercentage,
            depositAmount: pricing.depositAmount,
            remainingAmount: pricing.remainingAmount,
          },
          contract: {
            signatureDataUrl,
            signedAt,
            ipAddress: ip,
            userAgent,
            contractPdfUrl: pdfUrl || undefined,
            contractVersion,
            termsAccepted: formData.termsAccepted,
          },
          status: "signed",
          submittedAt: signedAt,
          emailsSent: false,
        };

        const result = await sanityClient.create(document);
        sanityDocId = result._id;
        console.log("Project onboarding saved to Sanity:", sanityDocId);
      } catch (sanityError) {
        console.error("Sanity save error:", sanityError);
      }
    }

    // Bexio Integration: Create contact and invoice
    let bexioContact: BexioContact | null = null;
    let bexioContactIsNew = false;
    let bexioInvoice: BexioInvoice | null = null;
    let bexioInvoiceSent = false;

    if (process.env.BEXIO_API_TOKEN) {
      try {
        // Find or create contact in Bexio
        const { contact, isNew } = await findOrCreateContact({
          name: formData.clientInfo.name,
          company: formData.clientInfo.company,
          email: formData.clientInfo.email,
          phone: formData.clientInfo.phone,
          street: formData.clientInfo.street,
          zipCity: formData.clientInfo.zipCity,
        });
        bexioContact = contact;
        bexioContactIsNew = isNew;
        console.log(
          `Bexio contact ${isNew ? "created" : "found"}: ID ${contact.id}`
        );

        // Create deposit invoice
        const serviceName = SERVICE_LABELS[formData.serviceType] || formData.serviceType;
        bexioInvoice = await createDepositInvoice({
          contactId: contact.id,
          projectName: formData.projectDetails.projectName,
          serviceName,
          totalAmount: pricing.totalPrice,
          depositAmount: pricing.depositAmount,
          depositPercentage: pricing.depositPercentage,
        });
        console.log(`Bexio invoice created: ${bexioInvoice.document_nr}`);

        // Try to send invoice by email (may fail due to Bexio email template config)
        const sendResult = await sendInvoiceByEmail(bexioInvoice.id, {
          recipientEmail: formData.clientInfo.email,
          subject: `Anzahlungsrechnung - ${formData.projectDetails.projectName}`,
          message: `Guten Tag ${formData.clientInfo.name}

Vielen Dank für Ihre Projektanfrage!

Anbei erhalten Sie die Anzahlungsrechnung für Ihr Videoprojekt "${formData.projectDetails.projectName}".

Sobald die Anzahlung eingegangen ist, können wir mit der Planung beginnen.

Bei Fragen stehe ich Ihnen gerne zur Verfügung.

Freundliche Grüsse
Marcus Martini
emmotion.ch`,
        });
        bexioInvoiceSent = sendResult.sent;
        const bexioInvoiceIssued = sendResult.issued;
        if (sendResult.sent) {
          console.log(`Bexio invoice sent via email to: ${formData.clientInfo.email}`);
        } else if (sendResult.issued) {
          console.log(`Bexio invoice ${bexioInvoice.document_nr} marked as issued (send manually from Bexio)`);
        }

        // Update Sanity document with Bexio data
        if (sanityDocId && process.env.SANITY_API_TOKEN) {
          await sanityClient
            .patch(sanityDocId)
            .set({
              bexio: {
                contactId: contact.id,
                contactIsNew: bexioContactIsNew,
                invoiceId: bexioInvoice.id,
                invoiceNr: bexioInvoice.document_nr,
                invoiceSent: bexioInvoiceSent,
                invoiceIssued: bexioInvoiceIssued,
              },
            })
            .commit();
        }
      } catch (bexioError) {
        console.error("Bexio integration error:", bexioError);
        // Continue without Bexio - don't fail the whole request
      }
    } else {
      console.log("Bexio integration skipped - API token not configured");
    }

    // Send emails
    let emailsSent = false;
    const emailSettings = await getEmailSettings();

    if (process.env.RESEND_API_KEY && emailSettings?.enabled !== false) {
      const senderName = emailSettings?.senderName || "emmotion.ch";
      const senderEmail = emailSettings?.senderEmail || "noreply@emmotion.ch";
      const recipientEmail = emailSettings?.recipientEmail || "hallo@emmotion.ch";

      try {
        // Email to client
        await resend.emails.send({
          from: `${senderName} <${senderEmail}>`,
          to: formData.clientInfo.email,
          subject: `Ihre Projektanfrage - ${formData.projectDetails.projectName}`,
          react: ContractClientEmail({
            clientName: formData.clientInfo.name,
            projectName: formData.projectDetails.projectName,
            serviceType: formData.serviceType,
            totalPrice: pricing.totalPrice,
            depositAmount: pricing.depositAmount,
            depositPercentage: pricing.depositPercentage,
            pdfUrl,
            companyInfo: contractTemplate?.companyInfo,
          }),
        });

        // Email to owner
        await resend.emails.send({
          from: `${senderName} <${senderEmail}>`,
          to: recipientEmail,
          replyTo: formData.clientInfo.email,
          subject: `Neue Projektanfrage: ${formData.projectDetails.projectName}`,
          react: ContractOwnerEmail({
            formData,
            pricing,
            pdfUrl,
            sanityDocId,
            signedAt,
          }),
        });

        emailsSent = true;
        console.log("Emails sent successfully");

        // Update Sanity document with email status
        if (sanityDocId && process.env.SANITY_API_TOKEN) {
          await sanityClient.patch(sanityDocId).set({ emailsSent: true }).commit();
        }
      } catch (emailError) {
        console.error("Email sending error:", emailError);
      }
    } else {
      console.log("Email disabled or RESEND_API_KEY not set");
    }

    return NextResponse.json({
      success: true,
      message: "Vertrag erfolgreich eingereicht",
      sanityDocId,
      pdfUrl,
      emailsSent,
      bexio: bexioInvoice
        ? {
            contactId: bexioContact?.id,
            invoiceId: bexioInvoice.id,
            invoiceNr: bexioInvoice.document_nr,
            invoiceSent: bexioInvoiceSent,
          }
        : null,
    });
  } catch (error) {
    console.error("Project onboarding submission error:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." },
      { status: 500 }
    );
  }
}
