import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { resend } from "@/lib/resend";
import { notifyError } from "@/lib/error-notify";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { validateOrigin } from "@/lib/csrf";
import { ContactNotificationEmail } from "@/emails/contact-notification";

// Sanity client with write access
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

// Simple in-memory rate limiting (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT) {
    return true;
  }

  record.count++;
  return false;
}

const MIN_SUBMISSION_TIME = 3000; // 3 seconds

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  website?: string; // Honeypot
  _timestamp?: number;
  turnstileToken?: string; // Cloudflare Turnstile
}

const SUBJECT_LABELS: Record<string, string> = {
  general: "Allgemeine Anfrage",
  project: "Projektanfrage",
  pricing: "Preisanfrage",
  collaboration: "Zusammenarbeit",
  other: "Sonstiges",
};

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeString(str: string): string {
  return str.trim().slice(0, 5000);
}

export async function POST(request: NextRequest) {
  try {
    // CSRF Protection: Validate origin
    if (!validateOrigin(request)) {
      return NextResponse.json(
        { error: "Ungültige Anfrage." },
        { status: 403 }
      );
    }

    // Get client IP for rate limiting and Turnstile
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429 }
      );
    }

    const body: ContactFormData = await request.json();

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

    // Honeypot check
    if (body.website && body.website.length > 0) {
      console.log("Honeypot triggered, ignoring submission");
      return NextResponse.json({ success: true, message: "Nachricht gesendet" });
    }

    // Time-based validation
    if (body._timestamp) {
      const submissionTime = Date.now() - body._timestamp;
      if (submissionTime < MIN_SUBMISSION_TIME) {
        console.log("Form submitted too quickly, likely a bot");
        return NextResponse.json({ success: true, message: "Nachricht gesendet" });
      }
    }

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: "Bitte füllen Sie alle Pflichtfelder aus." },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(body.email)) {
      return NextResponse.json(
        { error: "Bitte geben Sie eine gültige E-Mail-Adresse ein." },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeString(body.name),
      email: sanitizeString(body.email).toLowerCase(),
      phone: body.phone ? sanitizeString(body.phone) : undefined,
      company: body.company ? sanitizeString(body.company) : undefined,
      subject: body.subject,
      message: sanitizeString(body.message),
    };

    // Check for spam patterns
    const spamPatterns = [
      /\[url=/i,
      /\[link=/i,
      /<a\s+href/i,
      /viagra|cialis|casino|crypto|bitcoin|lottery|winner/i,
    ];

    if (spamPatterns.some((pattern) => pattern.test(sanitizedData.message))) {
      console.log("Spam pattern detected, ignoring submission");
      return NextResponse.json({ success: true, message: "Nachricht gesendet" });
    }

    let emailSent = false;
    const subjectLabel = SUBJECT_LABELS[sanitizedData.subject] || sanitizedData.subject;

    // Fetch email settings from CMS
    const emailSettings = await getEmailSettings();

    // Send email notification via Resend if enabled
    if (process.env.RESEND_API_KEY && emailSettings?.enabled) {
      try {
        const senderName = emailSettings.senderName || "emmotion.ch";
        const senderEmail = emailSettings.senderEmail || "noreply@emmotion.ch";
        const recipientEmail = emailSettings.recipientEmail || "hallo@emmotion.ch";
        const subjectPrefix = emailSettings.subjectPrefix || "[emmotion.ch]";

        const { error } = await resend.emails.send({
          from: `${senderName} <${senderEmail}>`,
          to: recipientEmail,
          replyTo: sanitizedData.email,
          subject: `${subjectPrefix} ${subjectLabel} von ${sanitizedData.name}`,
          react: ContactNotificationEmail({
            name: sanitizedData.name,
            email: sanitizedData.email,
            phone: sanitizedData.phone,
            company: sanitizedData.company,
            subject: sanitizedData.subject,
            subjectLabel,
            message: sanitizedData.message,
          }),
        });

        if (error) {
          console.error("Resend error:", error);
        } else {
          emailSent = true;
          console.log("Email notification sent successfully via Resend");
        }
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        await notifyError({
          context: "Kontaktformular E-Mail fehlgeschlagen",
          error: emailError,
          severity: "error",
          metadata: {
            senderName: sanitizedData.name,
            senderEmail: sanitizedData.email,
            subject: subjectLabel,
          },
        });
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
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        company: sanitizedData.company,
        subject: sanitizedData.subject,
        message: sanitizedData.message,
        status: "new",
        submittedAt: new Date().toISOString(),
        emailSent,
      };

      await sanityClient.create(document);
      console.log("Contact submission saved to Sanity");
    } else {
      console.warn("SANITY_API_TOKEN not set - submission not saved");
    }

    // Fetch success message from contact page settings
    let successMessage =
      "Vielen Dank für Ihre Nachricht! Ich melde mich innerhalb von 24 Stunden bei Ihnen.";

    try {
      if (process.env.SANITY_API_TOKEN) {
        const contactPage = await sanityClient.fetch(
          `*[_id == "contactPage"][0]{form}`
        );
        if (contactPage?.form?.successMessage) {
          successMessage = contactPage.form.successMessage;
        }
      }
    } catch {
      // Use default message
    }

    return NextResponse.json({
      success: true,
      message: successMessage,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    await notifyError({
      context: "Kritischer Fehler Kontaktformular",
      error,
      severity: "critical",
      metadata: {
        endpoint: "/api/contact",
      },
    });
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." },
      { status: 500 }
    );
  }
}
