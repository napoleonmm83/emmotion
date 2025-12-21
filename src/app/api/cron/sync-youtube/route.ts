import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@sanity/client";
import { put, list } from "@vercel/blob";
import { fetchPlaylistData } from "@/lib/youtube";

// Create Sanity client lazily to ensure environment variables are available
function getSanityClient() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
  });
}

/**
 * Verify that request comes from Vercel Cron or is a manual sync with valid secret
 */
function isAuthorizedRequest(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const syncSecret = process.env.NEXT_PUBLIC_SYNC_SECRET;
  const authHeader = request.headers.get("authorization");

  // Check for Vercel Cron auth header
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  // Check for manual sync with secret (used by CMS button)
  const providedSecret = request.nextUrl.searchParams.get("secret");
  if (providedSecret) {
    // Accept either CRON_SECRET or NEXT_PUBLIC_SYNC_SECRET
    if ((cronSecret && providedSecret === cronSecret) ||
        (syncSecret && providedSecret === syncSecret)) {
      return true;
    }
  }

  return false;
}

export async function GET(request: NextRequest) {
  // Verify authentication
  if (!isAuthorizedRequest(request)) {
    console.warn("Unauthorized YouTube sync access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sanityClient = getSanityClient();

    // Get TV Productions settings from Sanity
    const tvSettings = await sanityClient.fetch<{
      _id: string;
      enabled: boolean;
      playlistId: string;
    } | null>(`*[_type == "tvProductions"][0]{ _id, enabled, playlistId }`);

    if (!tvSettings) {
      return NextResponse.json({
        success: false,
        message: "TV Produktionen nicht konfiguriert. Bitte im CMS anlegen.",
      });
    }

    if (!tvSettings.enabled) {
      return NextResponse.json({
        success: true,
        message: "TV Produktionen ist deaktiviert. Sync übersprungen.",
      });
    }

    if (!tvSettings.playlistId) {
      return NextResponse.json({
        success: false,
        message: "Keine Playlist-ID konfiguriert.",
      });
    }

    // Fetch data from YouTube
    console.log(`Syncing YouTube playlist: ${tvSettings.playlistId}`);
    const playlistData = await fetchPlaylistData(tvSettings.playlistId);

    // Get existing blobs to avoid re-uploading
    const existingBlobs = new Map<string, string>();
    try {
      const blobList = await list({ prefix: "tv-thumbnails/" });
      for (const blob of blobList.blobs) {
        // Extract video ID from pathname (tv-thumbnails/VIDEO_ID.jpg)
        const match = blob.pathname.match(/tv-thumbnails\/([^.]+)\.jpg/);
        if (match) {
          existingBlobs.set(match[1], blob.url);
        }
      }
    } catch {
      console.log("No existing blobs found or blob list failed");
    }

    // Upload thumbnails to Vercel Blob
    const videosWithBlobThumbnails = await Promise.all(
      playlistData.videos.map(async (video) => {
        // Check if thumbnail already exists in blob storage
        if (existingBlobs.has(video.youtubeId)) {
          return {
            ...video,
            thumbnailUrl: existingBlobs.get(video.youtubeId)!,
          };
        }

        try {
          // Download thumbnail from YouTube
          const response = await fetch(video.thumbnailUrl);
          if (!response.ok) {
            console.log(`Failed to fetch thumbnail for ${video.youtubeId}`);
            return video;
          }

          const imageBuffer = await response.arrayBuffer();

          // Upload to Vercel Blob
          const blob = await put(
            `tv-thumbnails/${video.youtubeId}.jpg`,
            imageBuffer,
            {
              access: "public",
              contentType: "image/jpeg",
            }
          );

          console.log(`Uploaded thumbnail for ${video.youtubeId}`);
          return {
            ...video,
            thumbnailUrl: blob.url,
          };
        } catch (error) {
          console.error(`Error uploading thumbnail for ${video.youtubeId}:`, error);
          return video; // Keep original URL if upload fails
        }
      })
    );

    // Add _key to each video for Sanity array compatibility
    const videosWithKeys = videosWithBlobThumbnails.map((video) => ({
      _key: video.youtubeId,  // Use YouTube ID as unique key
      ...video,
    }));

    // Check if Sanity token is available
    if (!process.env.SANITY_API_TOKEN) {
      console.error("SANITY_API_TOKEN is not set - cannot write to Sanity");
      return NextResponse.json({
        success: false,
        error: "SANITY_API_TOKEN nicht konfiguriert",
      }, { status: 500 });
    }

    // Update Sanity document with cached data
    try {
      const patchResult = await sanityClient
        .patch(tvSettings._id)
        .set({
          cachedData: {
            lastSyncedAt: playlistData.lastSyncedAt,
            totalVideos: playlistData.totalVideos,
            totalViews: playlistData.totalViews,
            totalLikes: playlistData.totalLikes,
            totalComments: playlistData.totalComments,
            videos: videosWithKeys,
          },
        })
        .commit();
      console.log("Sanity patch result:", patchResult._id);
    } catch (sanityError) {
      console.error("Sanity patch failed:", sanityError);
      return NextResponse.json({
        success: false,
        error: "Sanity Update fehlgeschlagen",
        details: sanityError instanceof Error ? sanityError.message : "Unknown error",
      }, { status: 500 });
    }

    console.log(
      `YouTube sync complete: ${playlistData.totalVideos} videos, ${playlistData.totalViews.toLocaleString()} views`
    );

    // Revalidate the TV productions page to show updated data immediately
    revalidatePath("/tv-produktionen");
    console.log("Revalidated /tv-produktionen page");

    return NextResponse.json({
      success: true,
      message: "YouTube-Daten erfolgreich synchronisiert",
      stats: {
        totalVideos: playlistData.totalVideos,
        totalViews: playlistData.totalViews,
        totalLikes: playlistData.totalLikes,
        totalComments: playlistData.totalComments,
        lastSyncedAt: playlistData.lastSyncedAt,
      },
    });
  } catch (error) {
    console.error("YouTube sync error:", error);
    return NextResponse.json(
      {
        error: "YouTube-Sync fehlgeschlagen",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
