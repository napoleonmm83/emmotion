import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  HeroSection,
  ServicesSection,
  PortfolioSection,
  TestimonialsSection,
  AboutSection,
  ContactSection,
  CTASection,
} from "@/components/sections";
import {
  getHomePage,
  getAboutPage,
  getFeaturedTestimonials,
  getFeaturedProjects,
  getServices,
  getSettings,
  getTvProductions,
} from "@sanity/lib/data";
import { urlFor } from "@sanity/lib/image";

// =============================================================================
// METADATA
// =============================================================================

export const metadata: Metadata = {
  title: "emmotion.ch | Videoproduktion mit TV-Erfahrung",
  description:
    "Professionelle Videoproduktion für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz. Imagefilme, Eventvideos, Social Media Content und mehr.",
  openGraph: {
    title: "emmotion.ch | Videoproduktion mit TV-Erfahrung",
    description:
      "Professionelle Videoproduktion für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz.",
    type: "website",
  },
};

// =============================================================================
// DATA TRANSFORMATION HELPERS
// =============================================================================

interface SanityTestimonial {
  _id: string;
  quote: string;
  author: string;
  position?: string;
  company?: string;
}

interface SanityFeaturedProject {
  _id: string;
  title: string;
  slug: { current: string };
  client?: string;
  category?: string;
  videoUrl?: string;
  thumbnail?: { asset: { _ref: string } };
}

interface SanityService {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  icon?: string;
  idealFor?: string[];
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

function transformHomePageData(data: Awaited<ReturnType<typeof getHomePage>>) {
  if (!data) return null;
  return {
    hero: {
      titleLine1: data.hero?.titleLine1,
      titleHighlight: data.hero?.titleHighlight,
      subtitle: data.hero?.subtitle,
      ctaPrimaryText: data.hero?.ctaPrimaryText,
      ctaPrimaryLink: data.hero?.ctaPrimaryLink,
      ctaSecondaryText: data.hero?.ctaSecondaryText,
      ctaSecondaryLink: data.hero?.ctaSecondaryLink,
      backgroundVideo: data.hero?.backgroundVideo,
      backgroundImage: data.hero?.backgroundImage
        ? urlFor(data.hero.backgroundImage).width(1920).quality(75).format("webp").url()
        : undefined,
    },
    sections: {
      showServices: data.sections?.showServices ?? true,
      showPortfolio: data.sections?.showPortfolio ?? true,
      showTestimonials: data.sections?.showTestimonials ?? true,
      showCTA: data.sections?.showCTA ?? true,
      showAbout: data.sections?.showAbout ?? true,
      showContact: data.sections?.showContact ?? true,
    },
  };
}

function transformAboutData(data: Awaited<ReturnType<typeof getAboutPage>>) {
  if (!data) return null;
  return {
    name: data.name,
    profileImage: data.profileImage?.asset
      ? urlFor(data.profileImage).width(800).height(1000).url()
      : undefined,
    heroText: data.heroText,
    description: data.heroText,
    stats: data.stats,
  };
}

function transformTestimonials(data: SanityTestimonial[] | null) {
  if (!data || data.length === 0) return null;
  return data.map((t) => ({
    quote: t.quote,
    name: t.author,
    role: t.position || "",
    company: t.company || "",
  }));
}

function transformFeaturedProjects(data: SanityFeaturedProject[] | null) {
  if (!data || data.length === 0) return null;
  return data.map((p) => ({
    title: p.title,
    slug: typeof p.slug === "string" ? p.slug : p.slug?.current || "",
    category: p.category || "Videoproduktion",
    thumbnail: p.thumbnail?.asset
      ? urlFor(p.thumbnail).width(800).height(600).url()
      : "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
    videoUrl: p.videoUrl || "",
  }));
}

function transformServices(data: SanityService[] | null) {
  if (!data || data.length === 0) return null;
  return data.map((s) => ({
    title: s.title,
    slug: s.slug,
    shortDescription: s.shortDescription,
    icon: s.icon,
    idealFor: s.idealFor,
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
// ASYNC COMPONENTS (mit cached data)
// =============================================================================

async function HomeContent() {
  const [homePageData, aboutData, testimonials, featuredProjects, services, settings, tvData] = await Promise.all([
    getHomePage(),
    getAboutPage(),
    getFeaturedTestimonials(),
    getFeaturedProjects(),
    getServices(),
    getSettings(),
    getTvProductions(),
  ]);

  const transformedHomePage = transformHomePageData(homePageData);
  const transformedAbout = transformAboutData(aboutData);
  const transformedTestimonials = transformTestimonials(testimonials as SanityTestimonial[]);
  const transformedProjects = transformFeaturedProjects(featuredProjects as SanityFeaturedProject[]);
  const transformedServices = transformServices(services as SanityService[]);
  const tvPreview = transformTVPreview(tvData as TVProductionsData);

  const sections = transformedHomePage?.sections ?? {
    showServices: true,
    showPortfolio: true,
    showTestimonials: true,
    showCTA: true,
    showAbout: true,
    showContact: true,
  };

  return (
    <>
      <main>
        <HeroSection data={transformedHomePage?.hero} />
        {sections.showServices && <ServicesSection data={transformedServices} />}
        {sections.showPortfolio && <PortfolioSection data={transformedProjects} tvPreview={tvPreview} />}
        {sections.showTestimonials && <TestimonialsSection data={transformedTestimonials} />}
        {sections.showCTA && <CTASection variant="konfigurator" />}
        {sections.showAbout && <AboutSection data={transformedAbout} />}
        {sections.showContact && <ContactSection settings={settings} />}
      </main>
      <Footer settings={settings} />
    </>
  );
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function HomePage() {
  return (
    <>
      <Header />
      <Suspense fallback={<HomePageSkeleton />}>
        <HomeContent />
      </Suspense>
    </>
  );
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

function HomePageSkeleton() {
  return (
    <>
      <main>
        {/* Hero Skeleton */}
        <div className="min-h-screen bg-muted/20 animate-pulse" />
      </main>
      <footer className="bg-muted/10 h-64 animate-pulse" />
    </>
  );
}
