import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactPageContent } from "./contact-content";
import { getSettings, getContactPage } from "@sanity/lib/data";

// Default SEO
const defaultSeo = {
  title: "Kontakt | emmotion.ch",
  description:
    "Nimm Kontakt auf für dein nächstes Videoprojekt. Videoproduktion im Rheintal, Liechtenstein und der Ostschweiz.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getContactPage();

  const title = pageData?.seo?.metaTitle || defaultSeo.title;
  const description = pageData?.seo?.metaDescription || defaultSeo.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

// =============================================================================
// ASYNC CONTENT COMPONENT
// =============================================================================

async function KontaktContent() {
  const [settings, pageData] = await Promise.all([
    getSettings(),
    getContactPage(),
  ]);

  return (
    <>
      <Header />
      <main className="pt-20">
        <ContactPageContent settings={settings} pageData={pageData} />
      </main>
      <Footer settings={settings} />
    </>
  );
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

function KontaktSkeleton() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="h-12 w-64 bg-muted animate-pulse rounded" />
              <div className="h-6 w-full bg-muted animate-pulse rounded" />
              <div className="h-48 bg-muted animate-pulse rounded-lg" />
            </div>
            <div className="h-96 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </main>
      <footer className="h-64 bg-muted/10 animate-pulse" />
    </>
  );
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function KontaktPage() {
  return (
    <Suspense fallback={<KontaktSkeleton />}>
      <KontaktContent />
    </Suspense>
  );
}
