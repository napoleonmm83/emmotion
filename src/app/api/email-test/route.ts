import { NextRequest, NextResponse } from "next/server";
import { resend, emailConfig } from "@/lib/resend";

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

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY nicht konfiguriert. Bitte in Vercel Environment Variables setzen."
        },
        { status: 400 }
      );
    }

    // Get test recipient from request body or use default
    const body = await request.json().catch(() => ({}));
    const testRecipient = body.testRecipient || emailConfig.to;

    // Send test email via Resend
    const { data, error } = await resend.emails.send({
      from: emailConfig.from,
      to: testRecipient,
      subject: "[emmotion.ch] Test-E-Mail",
      text: "Diese Test-E-Mail wurde erfolgreich gesendet. Die E-Mail-Konfiguration funktioniert!",
      html: createTestEmailHtml(),
    });

    if (error) {
      console.error("Resend test error:", error);
      return NextResponse.json(
        {
          success: false,
          error: `Fehler beim Senden: ${error.message}`
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test-E-Mail erfolgreich an ${testRecipient} gesendet`,
      emailId: data?.id,
    });

  } catch (error) {
    console.error("Email test error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler";
    return NextResponse.json(
      {
        success: false,
        error: `Fehler beim Senden: ${errorMessage}`
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check status
export async function GET() {
  return NextResponse.json({
    configured: !!process.env.RESEND_API_KEY,
    provider: "Resend",
    from: emailConfig.from,
    to: emailConfig.to,
  });
}
