import { Suspense } from "react";
import type { Metadata } from "next";
import { UeberMichContent } from "./ueber-mich-content";
import { getAboutPage, getSettings } from "@sanity/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getAboutPage();

  return {
    title: data?.seo?.metaTitle || "Über mich | emmotion.ch",
    description:
      data?.seo?.metaDescription ||
      "Marcus Martini - Videograf mit TV-Erfahrung aus dem Rheintal. Persönliche Videoproduktion für Unternehmen in der Ostschweiz und Liechtenstein.",
    openGraph: {
      title: data?.seo?.metaTitle || "Über mich | emmotion.ch",
      description:
        data?.seo?.metaDescription ||
        "Marcus Martini - Videograf mit TV-Erfahrung aus dem Rheintal. Persönliche Videoproduktion für Unternehmen.",
    },
  };
}

// =============================================================================
// ASYNC CONTENT COMPONENT
// =============================================================================

async function UeberMichPageContent() {
  const [aboutData, settings] = await Promise.all([
    getAboutPage(),
    getSettings(),
  ]);

  return <UeberMichContent data={aboutData} settings={settings} />;
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

function UeberMichSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <div className="py-16 md:py-24 bg-muted/20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-[4/5] bg-muted animate-pulse rounded-lg" />
            <div className="space-y-4">
              <div className="h-12 w-64 bg-muted animate-pulse rounded" />
              <div className="h-6 w-full bg-muted animate-pulse rounded" />
              <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function UeberMichPage() {
  return (
    <Suspense fallback={<UeberMichSkeleton />}>
      <UeberMichPageContent />
    </Suspense>
  );
}
