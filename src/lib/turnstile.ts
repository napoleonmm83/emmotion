// Cloudflare Turnstile verification

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export async function verifyTurnstileToken(token: string, ip?: string): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) {
    // Fail secure in production, allow in development
    if (process.env.NODE_ENV === "production") {
      console.error("TURNSTILE_SECRET_KEY not set in production - blocking request");
      return false;
    }
    console.warn("TURNSTILE_SECRET_KEY not set - skipping verification in development");
    return true;
  }

  if (!token) {
    console.warn("No Turnstile token provided");
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", TURNSTILE_SECRET_KEY);
    formData.append("response", token);
    if (ip) {
      formData.append("remoteip", ip);
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const result: TurnstileVerifyResponse = await response.json();

    if (!result.success) {
      console.warn("Turnstile verification failed:", result["error-codes"]);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}
