import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import nodemailer from "nodemailer";
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

function createMailTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

interface KonfiguratorRequest {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  configuration: KonfiguratorInput;
  priceResult: PriceResult;
}

function createEmailHtml(data: KonfiguratorRequest): string {
  const config = data.configuration;
  const price = data.priceResult;

  const extrasHtml = (Object.entries(config.extras) as [keyof typeof config.extras, boolean][])
    .filter(([, value]) => value)
    .map(([key]) => `<li>${EXTRAS_INFO[key].label} (+CHF ${EXTRAS_INFO[key].price})</li>`)
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #d41919, #ff4444); padding: 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Neue Konfigurator-Anfrage</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">über emmotion.ch</p>
  </div>

  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
    <!-- Kontaktdaten -->
    <h2 style="font-size: 18px; margin: 0 0 15px 0; color: #374151;">Kontaktdaten</h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
      <tr>
        <td style="padding: 8px 0; font-weight: 600; width: 100px;">Name:</td>
        <td style="padding: 8px 0;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: 600;">E-Mail:</td>
        <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #d41919;">${data.email}</a></td>
      </tr>
      ${data.phone ? `
      <tr>
        <td style="padding: 8px 0; font-weight: 600;">Telefon:</td>
        <td style="padding: 8px 0;"><a href="tel:${data.phone}" style="color: #d41919;">${data.phone}</a></td>
      </tr>
      ` : ""}
    </table>

    <!-- Konfiguration -->
    <h2 style="font-size: 18px; margin: 0 0 15px 0; color: #374151;">Konfiguration</h2>
    <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 25px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: 600;">Video-Typ:</td>
          <td style="padding: 8px 0;">${VIDEO_TYPES[config.videoType].label}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600;">Länge:</td>
          <td style="padding: 8px 0;">${DURATION_OPTIONS[config.duration].label}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600;">Umfang:</td>
          <td style="padding: 8px 0;">${COMPLEXITY_OPTIONS[config.complexity].label}</td>
        </tr>
      </table>
      ${extrasHtml ? `
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
        <strong>Extras:</strong>
        <ul style="margin: 10px 0 0 0; padding-left: 20px;">${extrasHtml}</ul>
      </div>
      ` : ""}
    </div>

    <!-- Preis -->
    <h2 style="font-size: 18px; margin: 0 0 15px 0; color: #374151;">Preisschätzung</h2>
    <div style="background: linear-gradient(135deg, #d41919, #ff4444); padding: 20px; border-radius: 8px; text-align: center; color: white;">
      <p style="margin: 0 0 5px 0; font-size: 14px; opacity: 0.9;">Geschätzter Preis</p>
      <p style="margin: 0; font-size: 32px; font-weight: bold;">
        CHF ${price.priceRange.min.toLocaleString("de-CH")} – ${price.priceRange.max.toLocaleString("de-CH")}
      </p>
      <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">
        Lieferzeit: ca. ${price.estimatedDays} Werktage
      </p>
    </div>

    ${data.message ? `
    <div style="margin-top: 25px;">
      <h2 style="font-size: 18px; margin: 0 0 15px 0; color: #374151;">Nachricht</h2>
      <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${data.message}</div>
    </div>
    ` : ""}
  </div>

  <div style="background: #1f2937; padding: 20px 30px; border-radius: 0 0 12px 12px; text-align: center;">
    <p style="color: #9ca3af; margin: 0; font-size: 14px;">
      Diese Anfrage wurde über den Video-Konfigurator auf emmotion.ch gesendet.
    </p>
  </div>
</body>
</html>
  `.trim();
}

function createEmailText(data: KonfiguratorRequest): string {
  const config = data.configuration;
  const price = data.priceResult;

  const extras = (Object.entries(config.extras) as [keyof typeof config.extras, boolean][])
    .filter(([, value]) => value)
    .map(([key]) => `- ${EXTRAS_INFO[key].label} (+CHF ${EXTRAS_INFO[key].price})`)
    .join("\n");

  return `
NEUE KONFIGURATOR-ANFRAGE über emmotion.ch
==========================================

KONTAKTDATEN
------------
Name: ${data.name}
E-Mail: ${data.email}
${data.phone ? `Telefon: ${data.phone}` : ""}

KONFIGURATION
-------------
Video-Typ: ${VIDEO_TYPES[config.videoType].label}
Länge: ${DURATION_OPTIONS[config.duration].label}
Umfang: ${COMPLEXITY_OPTIONS[config.complexity].label}
${extras ? `\nExtras:\n${extras}` : ""}

PREISSCHÄTZUNG
--------------
CHF ${price.priceRange.min.toLocaleString("de-CH")} – ${price.priceRange.max.toLocaleString("de-CH")}
Lieferzeit: ca. ${price.estimatedDays} Werktage

${data.message ? `NACHRICHT\n---------\n${data.message}` : ""}

---
Diese Anfrage wurde über den Video-Konfigurator auf emmotion.ch gesendet.
  `.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body: KonfiguratorRequest = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.configuration) {
      return NextResponse.json(
        { error: "Bitte füllen Sie alle Pflichtfelder aus." },
        { status: 400 }
      );
    }

    let emailSent = false;

    // Send email notification
    const transporter = createMailTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"emmotion.ch Konfigurator" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
          to: process.env.SMTP_TO || process.env.SMTP_USER,
          replyTo: body.email,
          subject: `[Konfigurator] ${VIDEO_TYPES[body.configuration.videoType].label} – ${body.name}`,
          text: createEmailText(body),
          html: createEmailHtml(body),
        });

        emailSent = true;
        console.log("Konfigurator email sent successfully");
      } catch (emailError) {
        console.error("Failed to send konfigurator email:", emailError);
      }
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
Video-Typ: ${VIDEO_TYPES[body.configuration.videoType].label}
Länge: ${DURATION_OPTIONS[body.configuration.duration].label}
Umfang: ${COMPLEXITY_OPTIONS[body.configuration.complexity].label}
Extras: ${Object.entries(body.configuration.extras)
  .filter(([, v]) => v)
  .map(([k]) => EXTRAS_INFO[k as keyof typeof EXTRAS_INFO].label)
  .join(", ") || "Keine"}

Preisschätzung: CHF ${body.priceResult.priceRange.min} – ${body.priceResult.priceRange.max}
Lieferzeit: ca. ${body.priceResult.estimatedDays} Werktage

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
