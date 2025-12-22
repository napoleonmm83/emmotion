import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { renderToBuffer } from "@react-pdf/renderer";
import { put } from "@vercel/blob";
import { resend } from "@/lib/resend";
import { notifyError } from "@/lib/error-notify";
import { validateOrigin } from "@/lib/csrf";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeString, sanitizeEmail, sanitizePhone, isBodySizeValid } from "@/lib/sanitize";
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

// Fetch contract template and global settings from CMS
async function getContractTemplate() {
  try {
    // Fetch both contract template and global settings
    const result = await sanityClient.fetch(
      `{
        "template": *[_type == "contractTemplate" && isActive == true][0] {
          _id,
          version,
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
        },
        "settings": *[_id == "siteSettings"][0] {
          contact {
            companyName,
            companyTagline,
            ownerName,
            email,
            phone,
            street,
            city,
            uid
          }
        }
      }`
    );

    // Merge company info from global settings into template format
    const companyInfo = result.settings?.contact ? {
      name: result.settings.contact.companyName || "emmotion.ch",
      tagline: result.settings.contact.companyTagline || "Videoproduktion für Unternehmen",
      owner: result.settings.contact.ownerName || "Marcus Martini",
      address: [result.settings.contact.street, result.settings.contact.city].filter(Boolean).join(", ") || "Rheintal, Schweiz",
      email: result.settings.contact.email || "marcus@emmotion.ch",
      phone: result.settings.contact.phone || "",
      uid: result.settings.contact.uid || "",
    } : null;

    return {
      ...result.template,
      companyInfo,
    };
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
    // Request size validation (500KB max - signatures can be large)
    if (!isBodySizeValid(request.headers.get("content-length"), 500000)) {
      return NextResponse.json(
        { error: "Anfrage zu gross." },
        { status: 413 }
      );
    }

    // CSRF Protection: Validate origin
    if (!validateOrigin(request)) {
      return NextResponse.json(
        { error: "Ungültige Anfrage." },
        { status: 403 }
      );
    }

    // Get client IP and user agent
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Rate limiting: 5 submissions per hour
    const rateLimitResult = await rateLimit(ip, {
      limit: 5,
      window: 3600,
      prefix: "submit_signed",
    });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuch es später erneut." },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimitResult.resetIn.toString(),
          },
        }
      );
    }

    const body: SubmitRequest = await request.json();
    const { formData, pricing, signatureDataUrl, contractVersion } = body;

    // Validate required fields
    if (!formData.clientInfo.name || !formData.clientInfo.email) {
      return NextResponse.json(
        { error: "Bitte füll alle Pflichtfelder aus." },
        { status: 400 }
      );
    }

    if (!signatureDataUrl) {
      return NextResponse.json(
        { error: "Bitte unterschreibe den Vertrag." },
        { status: 400 }
      );
    }

    // Sanitize client input
    const sanitizedClientInfo = {
      ...formData.clientInfo,
      name: sanitizeString(formData.clientInfo.name, 200),
      email: sanitizeEmail(formData.clientInfo.email),
      phone: formData.clientInfo.phone ? sanitizePhone(formData.clientInfo.phone) : formData.clientInfo.phone,
      company: formData.clientInfo.company ? sanitizeString(formData.clientInfo.company, 200) : formData.clientInfo.company,
      street: formData.clientInfo.street ? sanitizeString(formData.clientInfo.street, 200) : formData.clientInfo.street,
      zipCity: formData.clientInfo.zipCity ? sanitizeString(formData.clientInfo.zipCity, 100) : formData.clientInfo.zipCity,
    };
    const sanitizedProjectDetails = {
      ...formData.projectDetails,
      projectName: sanitizeString(formData.projectDetails.projectName, 200),
      description: formData.projectDetails.description ? sanitizeString(formData.projectDetails.description, 2000) : formData.projectDetails.description,
    };

    // Replace with sanitized data
    formData.clientInfo = sanitizedClientInfo;
    formData.projectDetails = sanitizedProjectDetails;

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
      }
    } catch (pdfError) {
      await notifyError({
        context: "PDF-Generierung fehlgeschlagen",
        error: pdfError,
        severity: "warning",
        metadata: {
          clientName: formData.clientInfo.name,
          projectName: formData.projectDetails.projectName,
          serviceType: formData.serviceType,
        },
      });
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
      } catch (sanityError) {
        await notifyError({
          context: "Sanity Speichern fehlgeschlagen",
          error: sanityError,
          severity: "error",
          metadata: {
            clientName: formData.clientInfo.name,
            clientEmail: formData.clientInfo.email,
            projectName: formData.projectDetails.projectName,
            serviceType: formData.serviceType,
          },
        });
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

        // Send invoice by email via Bexio
        // Note: Message must contain [Network Link] placeholder for Bexio to work
        const sendResult = await sendInvoiceByEmail(bexioInvoice.id, {
          recipientEmail: formData.clientInfo.email,
          subject: `Anzahlungsrechnung - ${formData.projectDetails.projectName}`,
          clientName: formData.clientInfo.name,
          projectName: formData.projectDetails.projectName,
        });
        bexioInvoiceSent = sendResult.sent;
        const bexioInvoiceIssued = sendResult.issued;

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
      } catch {
        // Continue without Bexio - don't fail the whole request
      }
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

        // Update Sanity document with email status
        if (sanityDocId && process.env.SANITY_API_TOKEN) {
          await sanityClient.patch(sanityDocId).set({ emailsSent: true }).commit();
        }
      } catch (emailError) {
        await notifyError({
          context: "E-Mail-Versand fehlgeschlagen",
          error: emailError,
          severity: "error",
          metadata: {
            clientName: formData.clientInfo.name,
            clientEmail: formData.clientInfo.email,
            projectName: formData.projectDetails.projectName,
            sanityDocId,
          },
        });
      }
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
    await notifyError({
      context: "Kritischer Fehler bei Projektanfrage",
      error,
      severity: "critical",
      metadata: {
        endpoint: "/api/projekt-anfrage/submit-signed",
      },
    });
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten. Bitte versuch es später erneut." },
      { status: 500 }
    );
  }
}
