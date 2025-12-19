import { resend } from "./resend";

interface ErrorNotifyOptions {
  context: string;
  error: Error | unknown;
  metadata?: Record<string, string | number | boolean | null | undefined>;
  severity?: "warning" | "error" | "critical";
}

const ADMIN_EMAIL = process.env.ERROR_NOTIFY_EMAIL || "hallo@emmotion.ch";
const SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || "noreply@emmotion.ch";

/**
 * Send an email notification when an error occurs.
 * Fails silently if email cannot be sent.
 */
export async function notifyError({
  context,
  error,
  metadata = {},
  severity = "error",
}: ErrorNotifyOptions): Promise<void> {
  // Skip if RESEND_API_KEY is not configured
  if (!process.env.RESEND_API_KEY) {
    console.warn("[notifyError] RESEND_API_KEY not configured, skipping notification");
    return;
  }

  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  const severityEmoji = {
    warning: "⚠️",
    error: "❌",
    critical: "🚨",
  }[severity];

  const timestamp = new Date().toLocaleString("de-CH", {
    dateStyle: "full",
    timeStyle: "long",
    timeZone: "Europe/Zurich",
  });

  const metadataLines = Object.entries(metadata)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `  • ${k}: ${v}`)
    .join("\n");

  const emailContent = `
${severityEmoji} ${severity.toUpperCase()}: ${context}

Zeitpunkt: ${timestamp}

Fehlermeldung:
${errorMessage}

${metadataLines ? `Kontext:\n${metadataLines}` : ""}

${errorStack ? `Stack Trace:\n${errorStack}` : ""}

---
Diese E-Mail wurde automatisch von emmotion.ch gesendet.
`.trim();

  try {
    await resend.emails.send({
      from: `emmotion.ch Alerts <${SENDER_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `${severityEmoji} [${severity.toUpperCase()}] ${context}`,
      text: emailContent,
    });
    console.log(`[notifyError] Notification sent for: ${context}`);
  } catch (sendError) {
    // Fail silently - we don't want error notification to cause more errors
    console.error("[notifyError] Failed to send notification:", sendError);
  }
}

/**
 * Helper to wrap async operations with error notification.
 * Returns the result or null on failure.
 */
export async function withErrorNotify<T>(
  context: string,
  operation: () => Promise<T>,
  options: {
    metadata?: ErrorNotifyOptions["metadata"];
    severity?: ErrorNotifyOptions["severity"];
    rethrow?: boolean;
  } = {}
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    await notifyError({
      context,
      error,
      metadata: options.metadata,
      severity: options.severity,
    });

    if (options.rethrow) {
      throw error;
    }
    return null;
  }
}
