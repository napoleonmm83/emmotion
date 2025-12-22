// CSRF Protection via Origin/Referer validation
// Works alongside Turnstile CAPTCHA for defense in depth

const ALLOWED_ORIGINS = [
  "https://emmotion.ch",
  "https://www.emmotion.ch",
  // Vercel Preview URLs
  /^https:\/\/emmotion-.*\.vercel\.app$/,
  /^https:\/\/.*-napoleonmm83\.vercel\.app$/,
];

// Development origins
const DEV_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // In development, allow dev origins
  if (process.env.NODE_ENV === "development") {
    if (!origin && !referer) return true;
    const sourceUrl = origin || referer || "";
    return DEV_ORIGINS.some((dev) => sourceUrl.startsWith(dev));
  }

  // In production, require valid origin
  if (!origin && !referer) {
    return false;
  }

  const sourceUrl = origin || referer || "";

  // Check against allowed origins
  const isAllowed = ALLOWED_ORIGINS.some((allowed) => {
    if (typeof allowed === "string") {
      return sourceUrl.startsWith(allowed);
    }
    // RegExp pattern
    return allowed.test(sourceUrl);
  });

  return isAllowed;
}
