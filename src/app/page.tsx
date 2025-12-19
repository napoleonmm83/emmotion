// Seite alle 60 Sekunden revalidieren für CMS-Updates
export const revalidate = 60;

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
import { client } from "@sanity/lib/client";
import { aboutPageQuery, homePageQuery, featuredTestimonialsQuery, featuredProjectsQuery, servicesQuery, settingsQuery, tvProductionsQuery } from "@sanity/lib/queries";
import { urlFor } from "@sanity/lib/image";

async function getHomePageData() {
  try {
    const data = await client.fetch(homePageQuery);
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
  } catch {
    return null;
  }
}

async function getAboutData() {
  try {
    const data = await client.fetch(aboutPageQuery);
    if (!data) return null;

    return {
      name: data.name,
      profileImage: data.profileImage?.asset
        ? urlFor(data.profileImage).width(800).height(1000).url()
        : undefined,
      heroText: data.heroText,
      description: data.heroText,
      // Stats aus dem CMS
      stats: data.stats,
    };
  } catch {
    return null;
  }
}

interface SanityTestimonial {
  _id: string;
  quote: string;
  author: string;
  position?: string;
  company?: string;
}

async function getTestimonials() {
  try {
    const data = await client.fetch<SanityTestimonial[]>(featuredTestimonialsQuery);
    if (!data || data.length === 0) return null;

    return data.map((t) => ({
      quote: t.quote,
      name: t.author,
      role: t.position || "",
      company: t.company || "",
    }));
  } catch {
    return null;
  }
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

async function getFeaturedProjects() {
  try {
    const data = await client.fetch<SanityFeaturedProject[]>(featuredProjectsQuery);
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
  } catch {
    return null;
  }
}

interface SanityService {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  icon?: string;
  idealFor?: string[];
}

async function getServices() {
  try {
    const data = await client.fetch<SanityService[]>(servicesQuery);
    if (!data || data.length === 0) return null;

    return data.map((s) => ({
      title: s.title,
      slug: s.slug,
      shortDescription: s.shortDescription,
      icon: s.icon,
      idealFor: s.idealFor,
    }));
  } catch {
    return null;
  }
}

async function getSettings() {
  try {
    const data = await client.fetch(settingsQuery);
    return data || null;
  } catch {
    return null;
  }
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

async function getTVProductionsPreview() {
  try {
    const data = await client.fetch<TVProductionsData>(tvProductionsQuery);
    if (!data?.enabled || !data.cachedData?.videos?.length) return null;

    // Nur Videos mit gültigen Bild-Thumbnails (keine .mp4 URLs)
    const videos = data.cachedData.videos;
    const videosWithValidThumbnails = videos.filter(v =>
      v.thumbnailUrl &&
      !v.thumbnailUrl.endsWith('.mp4') &&
      (v.thumbnailUrl.includes('ytimg.com') || v.thumbnailUrl.includes('.jpg') || v.thumbnailUrl.includes('.png') || v.thumbnailUrl.includes('.webp'))
    );

    if (videosWithValidThumbnails.length === 0) {
      // Fallback: YouTube-Thumbnail direkt aus Video-ID generieren
      const firstVideo = videos[0];
      return {
        thumbnail: firstVideo ? `https://i.ytimg.com/vi/${firstVideo.youtubeId}/hqdefault.jpg` : null,
        totalVideos: data.cachedData.totalVideos,
        totalViews: data.cachedData.totalViews,
      };
    }

    // Deterministisches Thumbnail basierend auf dem aktuellen Tag
    const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const index = dayOfYear % Math.min(videosWithValidThumbnails.length, 20);
    const selectedVideo = videosWithValidThumbnails[index];

    return {
      thumbnail: selectedVideo?.thumbnailUrl || null,
      totalVideos: data.cachedData.totalVideos,
      totalViews: data.cachedData.totalViews,
    };
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [homePageData, aboutData, testimonials, featuredProjects, services, settings, tvPreview] = await Promise.all([
    getHomePageData(),
    getAboutData(),
    getTestimonials(),
    getFeaturedProjects(),
    getServices(),
    getSettings(),
    getTVProductionsPreview(),
  ]);

  // Default section visibility (all visible)
  const sections = homePageData?.sections ?? {
    showServices: true,
    showPortfolio: true,
    showTestimonials: true,
    showCTA: true,
    showAbout: true,
    showContact: true,
  };

  return (
    <>
      <Header />
      <main>
        <HeroSection data={homePageData?.hero} />
        {sections.showServices && <ServicesSection data={services} />}
        {sections.showPortfolio && <PortfolioSection data={featuredProjects} tvPreview={tvPreview} />}
        {sections.showTestimonials && <TestimonialsSection data={testimonials} />}
        {sections.showCTA && <CTASection variant="konfigurator" />}
        {sections.showAbout && <AboutSection data={aboutData} />}
        {sections.showContact && <ContactSection settings={settings} />}
      </main>
      <Footer settings={settings} />
    </>
  );
}
