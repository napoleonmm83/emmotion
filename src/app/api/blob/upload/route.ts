import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { rateLimitBlobUpload } from "@/lib/rate-limit";

function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return "unknown";
}

function isValidOrigin(request: Request): boolean {
  const origin = request.headers.get("origin") || "";
  const referer = request.headers.get("referer") || "";

  // Erlaubte Quellen
  const allowedPatterns = [
    /^https?:\/\/localhost(:\d+)?/,           // Lokale Entwicklung
    /^https?:\/\/127\.0\.0\.1(:\d+)?/,        // Lokale Entwicklung
    /^https:\/\/emmotion\.ch/,                 // Produktion
    /^https:\/\/.*\.emmotion\.ch/,            // Subdomains
    /^https:\/\/.*\.vercel\.app/,             // Vercel Preview
  ];

  // Prüfe Origin oder Referer
  const sourceUrl = origin || referer;

  if (!sourceUrl) {
    // Kein Origin/Referer - nur in Entwicklung erlauben
    return process.env.NODE_ENV === "development";
  }

  // Muss aus dem Studio kommen
  const isFromStudio = referer.includes("/studio");
  if (!isFromStudio && process.env.NODE_ENV !== "development") {
    console.warn("Upload attempt not from studio:", referer);
    return false;
  }

  return allowedPatterns.some(pattern => pattern.test(sourceUrl));
}

// Upload Secret für zusätzliche Sicherheit (optional)
const UPLOAD_SECRET = process.env.BLOB_UPLOAD_SECRET;

function hasValidSecret(request: Request): boolean {
  if (!UPLOAD_SECRET) {
    // Wenn kein Secret konfiguriert, überspringen
    return true;
  }

  const authHeader = request.headers.get("x-upload-secret");
  return authHeader === UPLOAD_SECRET;
}

// Client upload handler
export async function POST(request: Request): Promise<NextResponse> {
  const ip = getClientIP(request);

  // 1. Rate Limiting prüfen (Redis-backed with in-memory fallback)
  const rateLimitResult = await rateLimitBlobUpload(ip);
  if (!rateLimitResult.success) {
    console.warn(`Rate limit exceeded for IP: ${ip}`);
    return NextResponse.json(
      { error: "Zu viele Uploads. Bitte warten Sie eine Stunde." },
      {
        status: 429,
        headers: {
          "Retry-After": rateLimitResult.resetIn.toString(),
          "X-RateLimit-Remaining": "0",
        }
      }
    );
  }

  // 2. Origin validieren
  if (!isValidOrigin(request)) {
    console.warn(`Invalid origin for upload from IP: ${ip}`);
    return NextResponse.json(
      { error: "Nicht autorisiert" },
      { status: 403 }
    );
  }

  // 3. Optional: Upload Secret prüfen
  if (!hasValidSecret(request)) {
    console.warn(`Invalid upload secret from IP: ${ip}`);
    return NextResponse.json(
      { error: "Nicht autorisiert" },
      { status: 403 }
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          // Nur Video-Dateien erlauben
          allowedContentTypes: [
            "video/mp4",
            "video/webm",
            "video/quicktime",
            "video/x-msvideo",
          ],
          // Reduziert von 500MB auf 200MB
          maximumSizeInBytes: 200 * 1024 * 1024,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log(`Video uploaded by ${ip}:`, blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Blob upload error:", error);
    return NextResponse.json(
      { error: "Upload fehlgeschlagen" },
      { status: 500 }
    );
  }
}
