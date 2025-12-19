/**
 * Input Sanitization Utilities
 * Prevents XSS attacks by stripping HTML and limiting input length
 */

/**
 * Strip all HTML tags from a string
 * Uses regex-based approach compatible with Next.js server components
 */
function stripHtml(str: string): string {
  if (!str) return "";

  // Decode HTML entities first
  let decoded = str
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, "/")
    .replace(/&nbsp;/gi, " ");

  // Remove all HTML tags
  decoded = decoded.replace(/<[^>]*>/g, "");

  // Remove any remaining HTML entities
  decoded = decoded.replace(/&[a-zA-Z0-9#]+;/g, "");

  // Normalize whitespace
  decoded = decoded.replace(/\s+/g, " ");

  return decoded;
}

/**
 * Sanitize user input to prevent XSS attacks
 * Removes all HTML tags and trims/truncates the string
 */
export function sanitizeString(str: string, maxLength: number = 5000): string {
  if (!str || typeof str !== "string") {
    return "";
  }

  // Strip HTML and trim
  const sanitized = stripHtml(str).trim();

  // Truncate to max length
  return sanitized.slice(0, maxLength);
}

/**
 * Sanitize email address
 * Only allows valid email characters
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== "string") {
    return "";
  }

  // Strip HTML, trim, lowercase
  const sanitized = stripHtml(email)
    .trim()
    .toLowerCase()
    .slice(0, 254); // Max email length per RFC 5321

  // Remove any characters that aren't valid in emails
  return sanitized.replace(/[^\w.@+-]/g, "");
}

/**
 * Sanitize phone number
 * Only allows digits, spaces, +, -, (, )
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== "string") {
    return "";
  }

  // Remove everything except allowed characters
  return phone
    .replace(/[^\d\s+\-()]/g, "")
    .trim()
    .slice(0, 30);
}

/**
 * Validate request body size
 * Returns true if body is within limits
 */
export function isBodySizeValid(
  contentLength: string | null,
  maxBytes: number = 50000 // 50KB default
): boolean {
  if (!contentLength) {
    return true; // No content-length header, let it through (will be checked later)
  }

  const size = parseInt(contentLength, 10);
  if (isNaN(size)) {
    return true;
  }

  return size <= maxBytes;
}
