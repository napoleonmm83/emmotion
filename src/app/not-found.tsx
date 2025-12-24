import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NotFoundContent } from "./not-found-content";
import { getSettings } from "@sanity/lib/data";

// =============================================================================
// ASYNC CONTENT COMPONENT
// =============================================================================

async function NotFoundPageContent() {
  const settings = await getSettings();

  return (
    <>
      <Header />
      <NotFoundContent />
      <Footer settings={settings} />
    </>
  );
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

function NotFoundSkeleton() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="h-24 w-24 bg-muted animate-pulse rounded mx-auto mb-4" />
          <div className="h-8 w-48 bg-muted animate-pulse rounded mx-auto mb-2" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded mx-auto" />
        </div>
      </main>
      <footer className="h-64 bg-muted/10 animate-pulse" />
    </>
  );
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function NotFound() {
  return (
    <Suspense fallback={<NotFoundSkeleton />}>
      <NotFoundPageContent />
    </Suspense>
  );
}
