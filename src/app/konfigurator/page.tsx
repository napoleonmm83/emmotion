import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { KonfiguratorPageContent } from "./konfigurator-content";
import { getKonfiguratorPage, getSettings } from "@sanity/lib/data";

export const metadata: Metadata = {
  title: "Video-Konfigurator | emmotion.ch",
  description:
    "Berechne den Preis für dein Videoprojekt. Imagefilm, Recruiting-Video, Produktvideo oder Social Media Content – konfiguriere dein Wunschvideo.",
  openGraph: {
    title: "Video-Konfigurator | emmotion.ch",
    description:
      "Berechne den Preis für dein Videoprojekt. Konfiguriere dein Wunschvideo und erhalte eine unverbindliche Preisschätzung.",
  },
};

// =============================================================================
// ASYNC CONTENT COMPONENT
// =============================================================================

async function KonfiguratorContent() {
  const [pageData, settings] = await Promise.all([
    getKonfiguratorPage(),
    getSettings(),
  ]);

  return (
    <>
      <Header />
      <main className="pt-20">
        <KonfiguratorPageContent data={pageData} />
      </main>
      <Footer settings={settings} />
    </>
  );
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

function KonfiguratorSkeleton() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <div className="container py-16">
          <div className="max-w-4xl mx-auto">
            <div className="h-12 w-64 bg-muted animate-pulse rounded mb-4 mx-auto" />
            <div className="h-6 w-96 bg-muted animate-pulse rounded mb-12 mx-auto" />
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

export default function KonfiguratorPage() {
  return (
    <Suspense fallback={<KonfiguratorSkeleton />}>
      <KonfiguratorContent />
    </Suspense>
  );
}
