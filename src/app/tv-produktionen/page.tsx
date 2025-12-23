import { cacheLife } from "next/cache";
import { Metadata } from "next";
import { TVProduktionenContent } from "./tv-produktionen-content";
import { client } from "@sanity/lib/client";
import { tvProductionsQuery, settingsQuery } from "@sanity/lib/queries";
import { CACHE_PROFILES } from "@/lib/cache";

export async function generateMetadata(): Promise<Metadata> {
  const tvData = await getTVProductionsData();

  return {
    title: tvData?.seo?.metaTitle || tvData?.title || "TV Produktionen",
    description: tvData?.seo?.metaDescription || tvData?.subtitle ||
      "Meine Arbeiten für TV Rheintal – professionelle Videoproduktion für das Regionalfernsehen.",
    openGraph: {
      title: `${tvData?.title || "TV Produktionen"} | emmotion.ch`,
      description: tvData?.seo?.metaDescription || tvData?.subtitle ||
        "Meine Arbeiten für TV Rheintal – professionelle Videoproduktion für das Regionalfernsehen.",
    },
  };
}

interface TVProductionsData {
  _id: string;
  enabled: boolean;
  playlistId: string;
  title: string;
  subtitle: string;
  description: string;
  channelInfo?: {
    channelName: string;
    channelUrl: string;
    role: string;
  };
  cachedData?: {
    lastSyncedAt: string;
    totalVideos: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    videos: Array<{
      youtubeId: string;
      title: string;
      description: string;
      thumbnailUrl: string;
      publishedAt: string;
      duration: string;
      viewCount: number;
      likeCount: number;
      commentCount: number;
    }>;
  };
  seo?: {
    metaTitle: string;
    metaDescription: string;
  };
}

async function getTVProductionsData(): Promise<TVProductionsData | null> {
  "use cache";
  cacheLife(CACHE_PROFILES.external); // YouTube-Daten via Cron - 5min revalidate
  try {
    const data = await client.fetch<TVProductionsData>(tvProductionsQuery);
    return data || null;
  } catch {
    return null;
  }
}

async function getSettings() {
  "use cache";
  cacheLife(CACHE_PROFILES.settings); // Site-Einstellungen - 10min revalidate
  try {
    const data = await client.fetch(settingsQuery);
    return data || null;
  } catch {
    return null;
  }
}

export default async function TVProduktionenPage() {
  const [tvData, settings] = await Promise.all([
    getTVProductionsData(),
    getSettings(),
  ]);

  // Falls TV Produktionen nicht aktiviert oder nicht konfiguriert
  if (!tvData || !tvData.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">TV Produktionen</h1>
          <p className="text-muted-foreground">
            Dieser Bereich ist derzeit nicht verfügbar.
          </p>
        </div>
      </div>
    );
  }

  return <TVProduktionenContent tvData={tvData} settings={settings} />;
}
