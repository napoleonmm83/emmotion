import { Suspense } from "react";
import { Metadata } from "next";
import { PortfolioPageContent } from "./portfolio-content";
import { getProjects, getPortfolioPage, getSettings, getTvProductions } from "@sanity/lib/data";
import { urlFor } from "@sanity/lib/image";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Entdecke eine Auswahl meiner Videoprojekte – von Imagefilmen über Eventvideos bis hin zu Social Media Content.",
  openGraph: {
    title: "Portfolio | emmotion.ch",
    description:
      "Entdecke eine Auswahl meiner Videoprojekte – von Imagefilmen über Eventvideos bis hin zu Social Media Content.",
  },
};

// =============================================================================
// DATA TRANSFORMATION HELPERS
// =============================================================================

interface SanityProject {
  _id: string;
  title: string;
  slug: { current: string };
  client?: string;
  category?: string;
  categorySlug?: string;
  industry?: string;
  videoUrl?: string;
  thumbnail?: { asset: { _ref: string } };
  featured?: boolean;
  publishedAt?: string;
}

interface TVProductionsData {
  enabled: boolean;
  cachedData?: {
    totalVideos: number;
    totalViews: number;
    videos: Array<{
      youtubeId: string;
      title: string;
      thumbnailUrl: string;
    }>;
  };
}

function transformProjects(data: SanityProject[] | null) {
  if (!data || data.length === 0) return null;

  return data.map((project) => ({
    title: project.title,
    slug: typeof project.slug === "string" ? project.slug : project.slug?.current || "",
    client: project.client || "",
    category: project.categorySlug || "imagefilm",
    industry: project.industry || "dienstleistung",
    videoUrl: project.videoUrl || "",
    thumbnail: project.thumbnail?.asset
      ? urlFor(project.thumbnail).width(800).height(600).url()
      : "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
    year: project.publishedAt
      ? new Date(project.publishedAt).getFullYear().toString()
      : "2024",
  }));
}

function transformTVPreview(data: TVProductionsData | null) {
  if (!data?.enabled || !data.cachedData?.videos?.length) return null;

  const videos = data.cachedData.videos;
  const videosWithValidThumbnails = videos.filter(v =>
    v.thumbnailUrl &&
    !v.thumbnailUrl.endsWith('.mp4') &&
    (v.thumbnailUrl.includes('ytimg.com') || v.thumbnailUrl.includes('.jpg') || v.thumbnailUrl.includes('.png') || v.thumbnailUrl.includes('.webp'))
  );

  if (videosWithValidThumbnails.length === 0) {
    const firstVideo = videos[0];
    return {
      thumbnail: firstVideo ? `https://i.ytimg.com/vi/${firstVideo.youtubeId}/hqdefault.jpg` : null,
      totalVideos: data.cachedData.totalVideos,
      totalViews: data.cachedData.totalViews,
    };
  }

  // Use first valid video (client components can randomize if needed)
  const selectedVideo = videosWithValidThumbnails[0];

  return {
    thumbnail: selectedVideo?.thumbnailUrl || null,
    totalVideos: data.cachedData.totalVideos,
    totalViews: data.cachedData.totalViews,
  };
}

// =============================================================================
// ASYNC CONTENT COMPONENT
// =============================================================================

async function PortfolioContent() {
  const [projectsData, pageData, settings, tvData] = await Promise.all([
    getProjects(),
    getPortfolioPage(),
    getSettings(),
    getTvProductions(),
  ]);

  const projects = transformProjects(projectsData as SanityProject[]);
  const tvPreview = transformTVPreview(tvData as TVProductionsData);

  return (
    <PortfolioPageContent
      projects={projects}
      pageData={pageData}
      settings={settings}
      tvPreview={tvPreview}
    />
  );
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

function PortfolioSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <div className="py-16 md:py-24 bg-muted/20">
        <div className="container">
          <div className="h-12 w-64 bg-muted animate-pulse rounded mb-4" />
          <div className="h-6 w-96 bg-muted animate-pulse rounded" />
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

export default function PortfolioPage() {
  return (
    <Suspense fallback={<PortfolioSkeleton />}>
      <PortfolioContent />
    </Suspense>
  );
}
