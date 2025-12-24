import { Suspense } from "react";
import { Metadata } from "next";
import { TVProduktionenContent } from "./tv-produktionen-content";
import { getTvProductions, getSettings } from "@sanity/lib/data";

// =============================================================================
// TYPES
// =============================================================================

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

// =============================================================================
// METADATA
// =============================================================================

export async function generateMetadata(): Promise<Metadata> {
  const tvData = await getTvProductions() as TVProductionsData | null;

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

// =============================================================================
// VIDEO OBJECT SCHEMA
// =============================================================================

function generateVideoListSchema(tvData: TVProductionsData) {
  if (!tvData.cachedData?.videos?.length) return null;

  const videos = tvData.cachedData.videos.slice(0, 30); // Limit to 30 for schema

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: tvData.title || "TV Produktionen",
    description: tvData.subtitle || "Videoproduktionen für TV Rheintal",
    numberOfItems: tvData.cachedData.totalVideos,
    itemListElement: videos.map((video, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoObject",
        name: video.title,
        description: video.description?.slice(0, 200) || video.title,
        thumbnailUrl: video.thumbnailUrl,
        uploadDate: video.publishedAt,
        duration: video.duration,
        contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
        embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
        interactionStatistic: [
          {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/WatchAction",
            userInteractionCount: video.viewCount,
          },
          {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/LikeAction",
            userInteractionCount: video.likeCount,
          },
        ],
        publisher: {
          "@type": "Organization",
          name: tvData.channelInfo?.channelName || "TV Rheintal",
          url: tvData.channelInfo?.channelUrl,
        },
      },
    })),
  };
}

// =============================================================================
// ASYNC CONTENT COMPONENT
// =============================================================================

async function TVProduktionenPageContent() {
  const [tvData, settings] = await Promise.all([
    getTvProductions(),
    getSettings(),
  ]);

  const typedTvData = tvData as TVProductionsData | null;

  // Falls TV Produktionen nicht aktiviert oder nicht konfiguriert
  if (!typedTvData || !typedTvData.enabled) {
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

  const videoListSchema = generateVideoListSchema(typedTvData);

  return (
    <>
      {videoListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoListSchema) }}
        />
      )}
      <TVProduktionenContent tvData={typedTvData} settings={settings} />
    </>
  );
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

function TVProduktionenSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <div className="py-16 md:py-24 bg-muted/20">
        <div className="container">
          <div className="h-12 w-64 bg-muted animate-pulse rounded mb-4" />
          <div className="h-6 w-96 bg-muted animate-pulse rounded" />
        </div>
      </div>
      {/* Stats Skeleton */}
      <div className="container py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
      {/* Grid Skeleton */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-video bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function TVProduktionenPage() {
  return (
    <Suspense fallback={<TVProduktionenSkeleton />}>
      <TVProduktionenPageContent />
    </Suspense>
  );
}
