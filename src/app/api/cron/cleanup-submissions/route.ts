import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Retention period in days (GDPR compliant)
const RETENTION_DAYS = 60;

/**
 * Verify that request comes from Vercel Cron
 * Vercel automatically sends Authorization: Bearer <CRON_SECRET> header
 */
function isAuthorizedCronRequest(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;

  // In development without CRON_SECRET, block all requests
  if (!cronSecret) {
    return false;
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  // Verify cron authentication
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);
    const cutoffISO = cutoffDate.toISOString();

    // Find old submissions
    const oldSubmissions = await sanityClient.fetch<{ _id: string }[]>(
      `*[_type == "contactSubmission" && submittedAt < $cutoff]{ _id }`,
      { cutoff: cutoffISO }
    );

    if (oldSubmissions.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Keine alten Anfragen gefunden",
        deleted: 0,
      });
    }

    // Delete old submissions
    const transaction = sanityClient.transaction();
    for (const submission of oldSubmissions) {
      transaction.delete(submission._id);
    }
    await transaction.commit();

    return NextResponse.json({
      success: true,
      message: `${oldSubmissions.length} Anfragen gelöscht (älter als ${RETENTION_DAYS} Tage)`,
      deleted: oldSubmissions.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Cleanup fehlgeschlagen" },
      { status: 500 }
    );
  }
}
