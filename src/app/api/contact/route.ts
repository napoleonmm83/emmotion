import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import nodemailer from "nodemailer";

// Sanity client with write access
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// SMTP Transporter (nur erstellen wenn konfiguriert)
function createMailTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465", // true für 465, false für andere
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
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

// E-Mail HTML Template
function createEmailHtml(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}): string {
  const subjectLabel = SUBJECT_LABELS[data.subject] || data.subject;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #d41919, #ff4444); padding: 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Neue Kontaktanfrage</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">über emmotion.ch</p>
  </div>

  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; width: 120px; vertical-align: top;">Name:</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; vertical-align: top;">E-Mail:</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
          <a href="mailto:${data.email}" style="color: #d41919;">${data.email}</a>
        </td>
      </tr>
      ${data.phone ? `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; vertical-align: top;">Telefon:</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
          <a href="tel:${data.phone}" style="color: #d41919;">${data.phone}</a>
        </td>
      </tr>
      ` : ""}
      ${data.company ? `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; vertical-align: top;">Firma:</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${data.company}</td>
      </tr>
      ` : ""}
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; vertical-align: top;">Betreff:</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${subjectLabel}</td>
      </tr>
    </table>

    <div style="margin-top: 24px;">
      <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #374151;">Nachricht:</h3>
      <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${data.message}</div>
    </div>
  </div>

  <div style="background: #1f2937; padding: 20px 30px; border-radius: 0 0 12px 12px; text-align: center;">
    <p style="color: #9ca3af; margin: 0; font-size: 14px;">
      Diese E-Mail wurde automatisch über das Kontaktformular auf emmotion.ch gesendet.
    </p>
  </div>
</body>
</html>
  `.trim();
}

// E-Mail Text-Version (Fallback)
function createEmailText(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}): string {
  const subjectLabel = SUBJECT_LABELS[data.subject] || data.subject;

  return `
NEUE KONTAKTANFRAGE über emmotion.ch
=====================================

Name: ${data.name}
E-Mail: ${data.email}
${data.phone ? `Telefon: ${data.phone}` : ""}
${data.company ? `Firma: ${data.company}` : ""}
Betreff: ${subjectLabel}

NACHRICHT:
----------
${data.message}

---
Diese E-Mail wurde automatisch über das Kontaktformular auf emmotion.ch gesendet.
  `.trim();
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
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

    // Send email notification via SMTP
    const transporter = createMailTransporter();
    if (transporter) {
      try {
        const subjectLabel = SUBJECT_LABELS[sanitizedData.subject] || sanitizedData.subject;

        await transporter.sendMail({
          from: `"emmotion.ch" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
          to: process.env.SMTP_TO || process.env.SMTP_USER,
          replyTo: sanitizedData.email,
          subject: `[emmotion.ch] ${subjectLabel} von ${sanitizedData.name}`,
          text: createEmailText(sanitizedData),
          html: createEmailHtml(sanitizedData),
        });

        emailSent = true;
        console.log("Email notification sent successfully");
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Continue without email - still save to Sanity
      }
    } else {
      console.log("SMTP not configured - skipping email notification");
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

    // Fetch success message from settings
    let successMessage =
      "Vielen Dank für Ihre Nachricht! Ich melde mich innerhalb von 24 Stunden bei Ihnen.";

    try {
      if (process.env.SANITY_API_TOKEN) {
        const settings = await sanityClient.fetch(
          `*[_type == "settings"][0]{contactForm}`
        );
        if (settings?.contactForm?.successMessage) {
          successMessage = settings.contactForm.successMessage;
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
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." },
      { status: 500 }
    );
  }
}
