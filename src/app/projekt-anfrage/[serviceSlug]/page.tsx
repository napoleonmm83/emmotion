import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OnboardingContent } from "./onboarding-content";
import {
  getServiceBySlug,
  getOnboardingQuestionnaire,
  getContractTemplate,
  getSettings,
} from "@sanity/lib/data";
import { SERVICE_LABELS, type ServiceType } from "@/lib/onboarding-logic";

interface PageProps {
  params: Promise<{ serviceSlug: string }>;
}

const validSlugs: ServiceType[] = [
  "imagefilm",
  "eventvideo",
  "social-media",
  "drohnenaufnahmen",
  "produktvideo",
  "postproduktion",
];

// =============================================================================
// METADATA
// =============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { serviceSlug } = await params;
  const serviceLabel = SERVICE_LABELS[serviceSlug as ServiceType] || serviceSlug;

  return {
    title: `${serviceLabel} anfragen | emmotion.ch`,
    description: `Starte dein ${serviceLabel}-Projekt mit emmotion.ch. Beantworte einige Fragen und erhalte einen massgeschneiderten Vertrag.`,
    openGraph: {
      title: `${serviceLabel} anfragen | emmotion.ch`,
      description: `Starte dein ${serviceLabel}-Projekt mit emmotion.ch.`,
    },
  };
}

// =============================================================================
// STATIC PARAMS
// =============================================================================

export async function generateStaticParams() {
  return validSlugs.map((slug) => ({ serviceSlug: slug }));
}

// =============================================================================
// ASYNC CONTENT COMPONENT
// =============================================================================

interface OnboardingPageContentProps {
  serviceSlug: string;
}

async function OnboardingPageContent({ serviceSlug }: OnboardingPageContentProps) {
  // Validate slug
  if (!validSlugs.includes(serviceSlug as ServiceType)) {
    notFound();
  }

  const [service, questionnaire, contractTemplate, settings] = await Promise.all([
    getServiceBySlug(serviceSlug),
    getOnboardingQuestionnaire(serviceSlug),
    getContractTemplate(),
    getSettings(),
  ]);

  return (
    <OnboardingContent
      serviceSlug={serviceSlug as ServiceType}
      service={service}
      questionnaire={questionnaire}
      contractTemplate={contractTemplate}
      settings={settings}
    />
  );
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

function OnboardingSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Header Skeleton */}
      <div className="py-8 bg-muted/20">
        <div className="container">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </div>
      </div>
      {/* Form Skeleton */}
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-12 bg-muted animate-pulse rounded-lg" />
              </div>
            ))}
            <div className="h-12 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function ServiceOnboardingPage({ params }: PageProps) {
  const { serviceSlug } = await params;

  return (
    <Suspense fallback={<OnboardingSkeleton />}>
      <OnboardingPageContent serviceSlug={serviceSlug} />
    </Suspense>
  );
}
