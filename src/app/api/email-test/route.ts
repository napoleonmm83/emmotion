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

interface EmailSettings {
  enabled: boolean;
  recipientEmail: string;
  senderName: string;
  subjectPrefix: string;
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
  };
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
    <h1 style="color: white; margin: 0; font-size: 24px;">✅ Test erfolgreich!</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">E-Mail-Konfiguration funktioniert</p>
  </div>

  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="margin: 0 0 16px 0;">
      Diese Test-E-Mail wurde erfolgreich über die E-Mail-Einstellungen in Sanity CMS gesendet.
    </p>
    <p style="margin: 0 0 16px 0;">
      <strong>Was bedeutet das?</strong>
    </p>
    <ul style="margin: 0; padding-left: 20px;">
      <li>Die SMTP-Einstellungen sind korrekt konfiguriert</li>
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

export async function POST(request: NextRequest) {
  try {
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

    // Fetch email settings from Sanity
    const emailSettings: EmailSettings | null = await sanityClient.fetch(
      `*[_id == "emailSettings"][0] {
        enabled,
        recipientEmail,
        senderName,
        subjectPrefix,
        smtp {
          host,
          port,
          secure,
          user,
          password
        },
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

    if (!emailSettings.enabled) {
      const result = {
        success: false,
        error: "E-Mail-Versand ist deaktiviert. Bitte in den Einstellungen aktivieren.",
      };
      await updateTestResult(result.error);
      return NextResponse.json(result, { status: 400 });
    }

    const { smtp } = emailSettings;

    if (!smtp?.host || !smtp?.user || !smtp?.password) {
      const result = {
        success: false,
        error: "SMTP-Einstellungen unvollständig. Bitte Host, Benutzername und Passwort eingeben.",
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

    // Create transporter with CMS settings
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port || 587,
      secure: smtp.secure || false,
      auth: {
        user: smtp.user,
        pass: smtp.password,
      },
    });

    // Verify connection
    try {
      await transporter.verify();
    } catch (verifyError) {
      const errorMessage = verifyError instanceof Error ? verifyError.message : "Unbekannter Fehler";
      const result = {
        success: false,
        error: `SMTP-Verbindung fehlgeschlagen: ${errorMessage}`,
      };
      await updateTestResult(result.error);
      return NextResponse.json(result, { status: 400 });
    }

    // Send test email
    const subjectPrefix = emailSettings.subjectPrefix || "[emmotion.ch]";
    const senderName = emailSettings.senderName || "emmotion.ch";

    await transporter.sendMail({
      from: `"${senderName}" <${smtp.user}>`,
      to: testRecipient,
      subject: `${subjectPrefix} Test-E-Mail`,
      text: "Diese Test-E-Mail wurde erfolgreich gesendet. Die E-Mail-Konfiguration funktioniert!",
      html: createTestEmailHtml(),
    });

    const successMessage = `✅ Test-E-Mail erfolgreich an ${testRecipient} gesendet`;
    await updateTestResult(successMessage);

    return NextResponse.json({
      success: true,
      message: successMessage,
    });

  } catch (error) {
    console.error("Email test error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler";
    const result = {
      success: false,
      error: `Fehler beim Senden: ${errorMessage}`,
    };
    await updateTestResult(result.error);
    return NextResponse.json(result, { status: 500 });
  }
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

// GET endpoint to check status
export async function GET() {
  try {
    const emailSettings = await sanityClient.fetch(
      `*[_id == "emailSettings"][0] {
        enabled,
        smtp { host }
      }`
    );

    return NextResponse.json({
      configured: !!(emailSettings?.smtp?.host),
      enabled: emailSettings?.enabled || false,
    });
  } catch {
    return NextResponse.json({ configured: false, enabled: false });
  }
}
