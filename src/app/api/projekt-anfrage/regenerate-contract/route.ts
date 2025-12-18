import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { renderToBuffer } from "@react-pdf/renderer";
import { put } from "@vercel/blob";
import { resend } from "@/lib/resend";
import { ContractPDF } from "@/lib/contract-pdf";
import { ContractCorrectionEmail } from "@/emails/contract-correction";
import type { PricingResult } from "@/lib/onboarding-logic";

// Sanity client with write access
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Webhook from Sanity when regenerateContract is set to true
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret (optional but recommended)
    // Sanity sends secret in 'sanity-webhook-signature' header
    const webhookSecret = request.headers.get("sanity-webhook-signature") || request.headers.get("x-sanity-webhook-secret");
    if (process.env.SANITY_WEBHOOK_SECRET && webhookSecret !== process.env.SANITY_WEBHOOK_SECRET) {
      console.log("Webhook secret mismatch - received:", webhookSecret?.substring(0, 10) + "...");
      // For now, allow requests without secret for easier setup
      // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Handle Sanity webhook payload
    const documentId = body._id || body.documentId;

    if (!documentId) {
      return NextResponse.json({ error: "Missing document ID" }, { status: 400 });
    }

    // Fetch the full project document
    const project = await sanityClient.fetch(
      `*[_type == "projectOnboarding" && _id == $id][0] {
        _id,
        clientInfo,
        serviceType,
        projectDetails,
        extras,
        pricing,
        contract,
        contractAdjustments,
        regenerateContract
      }`,
      { id: documentId }
    );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Only proceed if regenerateContract flag is true
    if (!project.regenerateContract) {
      return NextResponse.json({ message: "No regeneration needed" });
    }

    // Fetch contract template and global settings
    const result = await sanityClient.fetch(
      `{
        "template": *[_type == "contractTemplate" && isActive == true][0] {
          _id,
          version,
          clauses,
          cancellationDays,
          optionalClauses,
          pdfDesign
        },
        "settings": *[_id == "siteSettings"][0] {
          contact {
            companyName,
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

    // Merge company info from global settings
    const companyInfo = result.settings?.contact ? {
      name: result.settings.contact.companyName || "emmotion.ch",
      owner: result.settings.contact.ownerName || "Marcus Martini",
      address: [result.settings.contact.street, result.settings.contact.city].filter(Boolean).join(", ") || "Rheintal, Schweiz",
      email: result.settings.contact.email || "marcus@emmotion.ch",
      phone: result.settings.contact.phone || "",
      uid: result.settings.contact.uid || "",
    } : null;

    const contractTemplate = {
      ...result.template,
      companyInfo,
    };

    // Build form data from project
    const formData = {
      clientInfo: project.clientInfo,
      serviceType: project.serviceType,
      projectDetails: project.projectDetails,
      serviceSpecificData: {}, // Empty object for corrections
      extras: project.extras || {},
      termsAccepted: project.contract?.termsAccepted || true,
    };

    // Calculate adjusted pricing
    let adjustedPricing: PricingResult = {
      ...project.pricing,
      estimatedDays: project.pricing?.estimatedDays || 10, // Default 10 days
      breakdown: [
        { item: "Basispreis", price: project.pricing?.estimatedTotal || 0 },
      ],
    };

    // Initialize totalPrice if not set
    if (!adjustedPricing.totalPrice) {
      adjustedPricing.totalPrice = project.pricing?.estimatedTotal || 0;
    }

    // Apply custom price items
    if (project.contractAdjustments?.customPriceItems?.length > 0) {
      let additionalTotal = 0;
      for (const item of project.contractAdjustments.customPriceItems) {
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        adjustedPricing.breakdown.push({
          item: item.name,
          price: itemTotal,
        });
        additionalTotal += itemTotal;
      }
      adjustedPricing.totalPrice = (project.pricing?.estimatedTotal || 0) + additionalTotal;
    }

    // Apply discount
    if (project.contractAdjustments?.discount?.value) {
      const discount = project.contractAdjustments.discount;
      let discountAmount = 0;

      if (discount.type === "percentage") {
        discountAmount = Math.round(adjustedPricing.totalPrice * (discount.value / 100));
      } else {
        discountAmount = discount.value;
      }

      adjustedPricing.breakdown.push({
        item: `Rabatt${discount.reason ? ` (${discount.reason})` : ""}`,
        price: -discountAmount,
      });
      adjustedPricing.totalPrice -= discountAmount;
    }

    // Recalculate deposit based on new total
    adjustedPricing.depositAmount = Math.round(adjustedPricing.totalPrice * (adjustedPricing.depositPercentage / 100));
    adjustedPricing.remainingAmount = adjustedPricing.totalPrice - adjustedPricing.depositAmount;

    // Store previous PDF URL
    const previousPdfUrl = project.contract?.contractPdfUrl;

    // Generate new PDF
    let newPdfUrl = "";
    try {
      const pdfBuffer = await renderToBuffer(
        ContractPDF({
          formData,
          pricing: adjustedPricing,
          signatureDataUrl: project.contract?.signatureDataUrl || "",
          signedAt: project.contract?.signedAt || new Date().toISOString(),
          contractVersion: `${contractTemplate?.version || "1.0"}-korr`,
          companyInfo: contractTemplate?.companyInfo,
          clauses: contractTemplate?.clauses,
          cancellationDays: contractTemplate?.cancellationDays,
        })
      );

      // Upload to Vercel Blob
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const filename = `contracts/${project.serviceType}-${Date.now()}-corrected.pdf`;
        const blob = await put(filename, pdfBuffer, {
          access: "public",
          contentType: "application/pdf",
        });
        newPdfUrl = blob.url;
        console.log("Corrected PDF uploaded to:", newPdfUrl);
      }
    } catch (pdfError) {
      console.error("PDF generation error:", pdfError);
      return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
    }

    // Update the project document
    const correctionEntry = {
      _type: "object",
      correctedAt: new Date().toISOString(),
      reason: "Manuelle Korrektur via CMS",
      previousPdfUrl: previousPdfUrl || undefined,
      newPdfUrl: newPdfUrl || undefined,
      correctedBy: "System",
    };

    await sanityClient
      .patch(documentId)
      .set({
        "contract.contractPdfUrl": newPdfUrl,
        "contract.contractVersion": `${contractTemplate?.version || "1.0"}-korr`,
        "pricing.estimatedTotal": adjustedPricing.totalPrice,
        "pricing.depositAmount": adjustedPricing.depositAmount,
        "pricing.remainingAmount": adjustedPricing.remainingAmount,
        regenerateContract: false, // Reset the flag
      })
      .append("corrections", [correctionEntry])
      .commit();

    // Optionally send notification email
    if (process.env.RESEND_API_KEY && newPdfUrl) {
      try {
        await resend.emails.send({
          from: `${companyInfo?.name || "emmotion.ch"} <noreply@emmotion.ch>`,
          to: project.clientInfo.email,
          subject: `Aktualisierter Vertrag - ${project.projectDetails.projectName}`,
          react: ContractCorrectionEmail({
            clientName: project.clientInfo.name,
            projectName: project.projectDetails.projectName,
            pdfUrl: newPdfUrl,
            companyInfo: companyInfo || undefined,
          }),
        });
        console.log("Correction notification sent to:", project.clientInfo.email);
      } catch (emailError) {
        console.error("Email sending error:", emailError);
        // Don't fail the whole request for email errors
      }
    }

    return NextResponse.json({
      success: true,
      message: "Contract regenerated successfully",
      newPdfUrl,
      documentId,
    });
  } catch (error) {
    console.error("Contract regeneration error:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

// Also support GET for manual triggering with document ID
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const documentId = searchParams.get("id");

  if (!documentId) {
    return NextResponse.json({ error: "Missing document ID" }, { status: 400 });
  }

  // Create a mock request body and call POST
  const mockRequest = new Request(request.url, {
    method: "POST",
    headers: request.headers,
    body: JSON.stringify({ documentId }),
  });

  return POST(mockRequest as NextRequest);
}
