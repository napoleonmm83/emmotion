import { Suspense } from "react";
import type { Metadata } from "next";
import { ProjektAnfrageContent } from "./projekt-anfrage-content";
import { getServices, getSettings } from "@sanity/lib/data";
import { urlFor } from "@sanity/lib/image";

export const metadata: Metadata = {
  title: "Projekt anfragen | emmotion.ch",
  description:
    "Starte dein Videoprojekt mit emmotion.ch. Füll unser Onboarding-Formular aus und erhalte ein massgeschneidertes Angebot.",
  openGraph: {
    title: "Projekt anfragen | emmotion.ch",
    description:
      "Starte dein Videoprojekt mit emmotion.ch. Füll unser Onboarding-Formular aus.",
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
      ? urlFor(service.featuredImage).width(400).height(300).url()
      : null,
  }));
}

// =============================================================================
// ASYNC CONTENT COMPONENT
// =============================================================================

async function ProjektAnfragePageContent() {
  const [servicesData, settings] = await Promise.all([
    getServices(),
    getSettings(),
  ]);

  const services = transformServices(servicesData as SanityService[]);

  return <ProjektAnfrageContent services={services} settings={settings} />;
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

function ProjektAnfrageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <div className="py-16 md:py-24 bg-muted/20">
        <div className="container">
          <div className="h-12 w-64 bg-muted animate-pulse rounded mb-4" />
          <div className="h-6 w-96 bg-muted animate-pulse rounded" />
        </div>
      </div>
      {/* Services Grid Skeleton */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function ProjektAnfragePage() {
  return (
    <Suspense fallback={<ProjektAnfrageSkeleton />}>
      <ProjektAnfragePageContent />
    </Suspense>
  );
}
