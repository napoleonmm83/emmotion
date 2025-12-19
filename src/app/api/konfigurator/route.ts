import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { resend } from "@/lib/resend";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { validateOrigin } from "@/lib/csrf";
import { rateLimitKonfigurator } from "@/lib/rate-limit";
import { sanitizeString, sanitizeEmail, sanitizePhone, isBodySizeValid } from "@/lib/sanitize";
import { KonfiguratorNotificationEmail } from "@/emails/konfigurator-notification";
import {
  KonfiguratorInput,
  PriceResult,
  VIDEO_TYPES,
  DURATION_OPTIONS,
  COMPLEXITY_OPTIONS,
  EXTRAS_INFO,
  calculatePrice,
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
  priceResult?: PriceResult; // Client-seitig, wird ignoriert - Server berechnet neu
  turnstileToken?: string; // Cloudflare Turnstile
}

export async function POST(request: NextRequest) {
  try {
    // Request size validation (50KB max)
    if (!isBodySizeValid(request.headers.get("content-length"), 50000)) {
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

    // Get client IP for Turnstile verification and rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check rate limit (Redis-backed with in-memory fallback)
    const rateLimitResult = await rateLimitKonfigurator(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuch es später erneut." },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimitResult.resetIn.toString(),
            "X-RateLimit-Remaining": "0",
          }
        }
      );
    }

    const body: KonfiguratorRequest = await request.json();

    // Verify Turnstile token
    if (process.env.TURNSTILE_SECRET_KEY) {
      const isValid = await verifyTurnstileToken(body.turnstileToken || "", ip);
      if (!isValid) {
        return NextResponse.json(
          { error: "Sicherheitsüberprüfung fehlgeschlagen. Bitte versuch es erneut." },
          { status: 400 }
        );
      }
    }

    // Validate required fields
    if (!body.name || !body.email || !body.configuration) {
      return NextResponse.json(
        { error: "Bitte füll alle Pflichtfelder aus." },
        { status: 400 }
      );
    }

    const config = body.configuration;

    // Validate configuration values
    const validVideoTypes = ["imagefilm", "recruiting", "produkt", "social", "event"];
    const validDurations = ["short", "medium", "long"];
    const validComplexities = ["simple", "standard", "premium"];

    if (!validVideoTypes.includes(config.videoType)) {
      return NextResponse.json(
        { error: "Ungültiger Video-Typ." },
        { status: 400 }
      );
    }
    if (!validDurations.includes(config.duration)) {
      return NextResponse.json(
        { error: "Ungültige Dauer." },
        { status: 400 }
      );
    }
    if (!validComplexities.includes(config.complexity)) {
      return NextResponse.json(
        { error: "Ungültige Komplexität." },
        { status: 400 }
      );
    }

    // Server-seitige Preisberechnung (verhindert Preismanipulation)
    const price = calculatePrice(config);

    // Sanitize user inputs (DOMPurify removes HTML tags)
    const sanitizedName = sanitizeString(body.name, 200);
    const sanitizedEmail = sanitizeEmail(body.email);
    const sanitizedPhone = body.phone ? sanitizePhone(body.phone) : undefined;
    const sanitizedMessage = body.message ? sanitizeString(body.message, 2000) : undefined;

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
          replyTo: sanitizedEmail,
          subject: `[Konfigurator] ${VIDEO_TYPES[config.videoType].label} – ${sanitizedName}`,
          react: KonfiguratorNotificationEmail({
            name: sanitizedName,
            email: sanitizedEmail,
            phone: sanitizedPhone,
            message: sanitizedMessage,
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
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
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

${sanitizedMessage ? `Zusätzliche Nachricht:\n${sanitizedMessage}` : ""}
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
