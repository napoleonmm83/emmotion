import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { resend } from "@/lib/resend";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { KonfiguratorNotificationEmail } from "@/emails/konfigurator-notification";
import {
  KonfiguratorInput,
  PriceResult,
  VIDEO_TYPES,
  DURATION_OPTIONS,
  COMPLEXITY_OPTIONS,
  EXTRAS_INFO,
} from "@/lib/konfigurator-logic";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Email Settings Interface
interface EmailSettings {
  enabled: boolean;
  recipientEmail: string;
  senderEmail: string;
  senderName: string;
  subjectPrefix: string;
}

// Fetch email settings from CMS
async function getEmailSettings(): Promise<EmailSettings | null> {
  try {
    const settings = await sanityClient.fetch(
      `*[_id == "emailSettings"][0] {
        enabled,
        recipientEmail,
        senderEmail,
        senderName,
        subjectPrefix
      }`
    );
    return settings;
  } catch {
    return null;
  }
}

interface KonfiguratorRequest {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  configuration: KonfiguratorInput;
  priceResult: PriceResult;
  turnstileToken?: string; // Cloudflare Turnstile
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for Turnstile verification
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const body: KonfiguratorRequest = await request.json();

    // Verify Turnstile token
    if (process.env.TURNSTILE_SECRET_KEY) {
      const isValid = await verifyTurnstileToken(body.turnstileToken || "", ip);
      if (!isValid) {
        return NextResponse.json(
          { error: "Sicherheitsüberprüfung fehlgeschlagen. Bitte versuchen Sie es erneut." },
          { status: 400 }
        );
      }
    }

    // Validate required fields
    if (!body.name || !body.email || !body.configuration) {
      return NextResponse.json(
        { error: "Bitte füllen Sie alle Pflichtfelder aus." },
        { status: 400 }
      );
    }

    const config = body.configuration;
    const price = body.priceResult;

    // Prepare extras list for email
    const extras = (Object.entries(config.extras) as [keyof typeof config.extras, boolean][])
      .filter(([, value]) => value)
      .map(([key]) => `${EXTRAS_INFO[key].label} (+CHF ${EXTRAS_INFO[key].price})`);

    let emailSent = false;

    // Fetch email settings from CMS
    const emailSettings = await getEmailSettings();

    // Send email notification via Resend if enabled
    if (process.env.RESEND_API_KEY && emailSettings?.enabled) {
      try {
        const senderName = emailSettings.senderName || "emmotion.ch";
        const senderEmail = emailSettings.senderEmail || "noreply@emmotion.ch";
        const recipientEmail = emailSettings.recipientEmail || "hallo@emmotion.ch";

        const { error } = await resend.emails.send({
          from: `${senderName} Konfigurator <${senderEmail}>`,
          to: recipientEmail,
          replyTo: body.email,
          subject: `[Konfigurator] ${VIDEO_TYPES[config.videoType].label} – ${body.name}`,
          react: KonfiguratorNotificationEmail({
            name: body.name,
            email: body.email,
            phone: body.phone,
            message: body.message,
            videoType: VIDEO_TYPES[config.videoType].label,
            duration: DURATION_OPTIONS[config.duration].label,
            complexity: COMPLEXITY_OPTIONS[config.complexity].label,
            extras,
            priceMin: price.priceRange.min,
            priceMax: price.priceRange.max,
            estimatedDays: price.estimatedDays,
          }),
        });

        if (error) {
          console.error("Resend error:", error);
        } else {
          emailSent = true;
          console.log("Konfigurator email sent successfully via Resend");
        }
      } catch (emailError) {
        console.error("Failed to send konfigurator email:", emailError);
      }
    } else if (!emailSettings?.enabled) {
      console.log("Email disabled in CMS - skipping email notification");
    } else {
      console.log("RESEND_API_KEY not set - skipping email notification");
    }

    // Save to Sanity
    if (process.env.SANITY_API_TOKEN) {
      const document = {
        _type: "contactSubmission",
        name: body.name,
        email: body.email,
        phone: body.phone || undefined,
        subject: "konfigurator",
        message: `
KONFIGURATOR-ANFRAGE
====================
Video-Typ: ${VIDEO_TYPES[config.videoType].label}
Länge: ${DURATION_OPTIONS[config.duration].label}
Umfang: ${COMPLEXITY_OPTIONS[config.complexity].label}
Extras: ${extras.length > 0 ? extras.join(", ") : "Keine"}

Preisschätzung: CHF ${price.priceRange.min} – ${price.priceRange.max}
Lieferzeit: ca. ${price.estimatedDays} Werktage

${body.message ? `Zusätzliche Nachricht:\n${body.message}` : ""}
        `.trim(),
        status: "new",
        submittedAt: new Date().toISOString(),
        emailSent,
      };

      await sanityClient.create(document);
      console.log("Konfigurator submission saved to Sanity");
    }

    return NextResponse.json({
      success: true,
      message: "Anfrage erfolgreich gesendet",
    });
  } catch (error) {
    console.error("Konfigurator error:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten." },
      { status: 500 }
    );
  }
}
