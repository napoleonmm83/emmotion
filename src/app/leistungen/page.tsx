import { Suspense } from "react";
import { Metadata } from "next";
import { LeistungenPageContent } from "./leistungen-content";
import { getServices, getSettings } from "@sanity/lib/data";
import { urlFor } from "@sanity/lib/image";

export const metadata: Metadata = {
  title: "Leistungen",
  description:
    "Professionelle Videoproduktion: Imagefilme, Eventvideos, Social Media Content, Drohnenaufnahmen, Produktvideos und Postproduktion.",
  openGraph: {
    title: "Leistungen | emmotion.ch",
    description:
      "Professionelle Videoproduktion: Imagefilme, Eventvideos, Social Media Content, Drohnenaufnahmen, Produktvideos und Postproduktion.",
  },
};

// =============================================================================
// DATA TRANSFORMATION HELPERS
// =============================================================================

interface SanityService {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  icon?: string;
  priceFrom?: number;
  featuredImage?: { asset: { _ref: string } };
  idealFor?: string[];
}

function transformServices(data: SanityService[] | null) {
  if (!data || data.length === 0) return null;

  return data.map((service) => ({
    title: service.title,
    slug: service.slug,
    shortDescription: service.shortDescription || "",
    icon: service.icon || "Film",
    priceFrom: service.priceFrom || 0,
    image: service.featuredImage?.asset
      ? urlFor(service.featuredImage).width(800).height(600).url()
      : null,
    idealFor: service.idealFor || [],
  }));
}

// =============================================================================
// ASYNC CONTENT COMPONENT
// =============================================================================

async function LeistungenContent() {
  const [servicesData, settings] = await Promise.all([
    getServices(),
    getSettings(),
  ]);

  const services = transformServices(servicesData as SanityService[]);

  return <LeistungenPageContent services={services} settings={settings} />;
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

function LeistungenSkeleton() {
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
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function LeistungenPage() {
  return (
    <Suspense fallback={<LeistungenSkeleton />}>
      <LeistungenContent />
    </Suspense>
  );
}
