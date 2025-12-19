import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { fetchPlaylistData } from "@/lib/youtube";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (Vercel sets this header for cron jobs)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Allow if it's a Vercel cron job or has valid secret
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Update Sanity document with cached data
    await sanityClient
      .patch(tvSettings._id)
      .set({
        cachedData: {
          lastSyncedAt: playlistData.lastSyncedAt,
          totalVideos: playlistData.totalVideos,
          totalViews: playlistData.totalViews,
          totalLikes: playlistData.totalLikes,
          totalComments: playlistData.totalComments,
          videos: playlistData.videos,
        },
      })
      .commit();

    console.log(
      `YouTube sync complete: ${playlistData.totalVideos} videos, ${playlistData.totalViews.toLocaleString()} views`
    );

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
