import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

// Client upload handler - no body size limit
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Hier könnte Auth-Check stattfinden
        return {
          allowedContentTypes: ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"],
          maximumSizeInBytes: 500 * 1024 * 1024, // 500MB
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Video uploaded:", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Blob upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
