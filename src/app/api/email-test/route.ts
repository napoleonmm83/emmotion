import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { resend } from "@/lib/resend";
import { rateLimit } from "@/lib/rate-limit";

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
  testEmail?: {
    testRecipient?: string;
  };
}

// Test E-Mail HTML Template
function createTestEmailHtml(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Test erfolgreich!</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">E-Mail-Konfiguration funktioniert</p>
  </div>

  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="margin: 0 0 16px 0;">
      Diese Test-E-Mail wurde erfolgreich über Resend gesendet.
    </p>
    <p style="margin: 0 0 16px 0;">
      <strong>Was bedeutet das?</strong>
    </p>
    <ul style="margin: 0; padding-left: 20px;">
      <li>Die Resend API ist korrekt konfiguriert</li>
      <li>Kontaktanfragen werden per E-Mail zugestellt</li>
      <li>Konfigurator-Anfragen werden per E-Mail zugestellt</li>
    </ul>
  </div>

  <div style="background: #1f2937; padding: 20px 30px; border-radius: 0 0 12px 12px; text-align: center;">
    <p style="color: #9ca3af; margin: 0; font-size: 14px;">
      emmotion.ch – E-Mail Test vom ${new Date().toLocaleString("de-CH")}
    </p>
  </div>
</body>
</html>
  `.trim();
}

// Update test result in Sanity
async function updateTestResult(message: string) {
  try {
    if (!process.env.SANITY_API_TOKEN) return;

    await sanityClient
      .patch("emailSettings")
      .set({
        "testEmail.lastTestResult": message,
        "testEmail.lastTestDate": new Date().toISOString(),
      })
      .commit();
  } catch (error) {
    console.error("Failed to update test result:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Rate limiting: 3 test emails per hour (admin function)
    const rateLimitResult = await rateLimit(ip, {
      limit: 3,
      window: 3600,
      prefix: "email_test",
    });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Zu viele Test-E-Mails. Bitte warte kurz." },
        { status: 429 }
      );
    }

    // Verify authorization (simple token check)
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.SANITY_API_TOKEN;

    if (!authHeader || !authHeader.includes(expectedToken?.slice(0, 20) || "")) {
      // Allow if request comes from same origin (Sanity Studio)
      const origin = request.headers.get("origin") || "";
      const referer = request.headers.get("referer") || "";

      if (!origin.includes("localhost") && !referer.includes("/studio")) {
        return NextResponse.json(
          { error: "Nicht autorisiert" },
          { status: 401 }
        );
      }
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      const result = {
        success: false,
        error: "RESEND_API_KEY nicht konfiguriert. Bitte in Vercel Environment Variables setzen."
      };
      await updateTestResult(result.error);
      return NextResponse.json(result, { status: 400 });
    }

    // Fetch email settings from Sanity
    const emailSettings: EmailSettings | null = await sanityClient.fetch(
      `*[_id == "emailSettings"][0] {
        enabled,
        recipientEmail,
        senderEmail,
        senderName,
        subjectPrefix,
        testEmail {
          testRecipient
        }
      }`
    );

    if (!emailSettings) {
      const result = {
        success: false,
        error: "E-Mail-Einstellungen nicht gefunden. Bitte zuerst konfigurieren.",
      };
      await updateTestResult(result.error);
      return NextResponse.json(result, { status: 400 });
    }

    if (!emailSettings.senderEmail) {
      const result = {
        success: false,
        error: "Absender E-Mail nicht konfiguriert. Bitte in den Einstellungen setzen.",
      };
      await updateTestResult(result.error);
      return NextResponse.json(result, { status: 400 });
    }

    const testRecipient = emailSettings.testEmail?.testRecipient || emailSettings.recipientEmail;

    if (!testRecipient) {
      const result = {
        success: false,
        error: "Keine Test-Empfänger-Adresse angegeben.",
      };
      await updateTestResult(result.error);
      return NextResponse.json(result, { status: 400 });
    }

    const senderName = emailSettings.senderName || "emmotion.ch";
    const senderEmail = emailSettings.senderEmail;
    const subjectPrefix = emailSettings.subjectPrefix || "[emmotion.ch]";

    // Send test email via Resend
    const { data, error } = await resend.emails.send({
      from: `${senderName} <${senderEmail}>`,
      to: testRecipient,
      subject: `${subjectPrefix} Test-E-Mail`,
      text: "Diese Test-E-Mail wurde erfolgreich gesendet. Die E-Mail-Konfiguration funktioniert!",
      html: createTestEmailHtml(),
    });

    if (error) {
      console.error("Resend test error:", error);
      const result = {
        success: false,
        error: `Fehler beim Senden: ${error.message}`
      };
      await updateTestResult(result.error);
      return NextResponse.json(result, { status: 400 });
    }

    const successMessage = `✅ Test-E-Mail erfolgreich an ${testRecipient} gesendet`;
    await updateTestResult(successMessage);

    return NextResponse.json({
      success: true,
      message: successMessage,
      emailId: data?.id,
    });

  } catch (error) {
    console.error("Email test error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler";
    const result = {
      success: false,
      error: `Fehler beim Senden: ${errorMessage}`
    };
    await updateTestResult(result.error);
    return NextResponse.json(result, { status: 500 });
  }
}

// GET endpoint to check status
export async function GET() {
  try {
    const emailSettings = await sanityClient.fetch(
      `*[_id == "emailSettings"][0] {
        enabled,
        senderEmail,
        recipientEmail
      }`
    );

    return NextResponse.json({
      configured: !!emailSettings?.senderEmail,
      enabled: emailSettings?.enabled || false,
      provider: "Resend",
      senderEmail: emailSettings?.senderEmail || null,
      recipientEmail: emailSettings?.recipientEmail || null,
    });
  } catch {
    return NextResponse.json({ configured: false, enabled: false, provider: "Resend" });
  }
}
