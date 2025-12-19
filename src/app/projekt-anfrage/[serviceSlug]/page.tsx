// Seite alle 60 Sekunden revalidieren für CMS-Updates
export const revalidate = 60;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OnboardingContent } from "./onboarding-content";
import { client } from "@sanity/lib/client";
import {
  serviceBySlugQuery,
  settingsQuery,
  onboardingQuestionnaireQuery,
  contractTemplateQuery,
} from "@sanity/lib/queries";
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

export async function generateStaticParams() {
  return validSlugs.map((slug) => ({ serviceSlug: slug }));
}

async function getServiceData(slug: string) {
  try {
    return await client.fetch(serviceBySlugQuery, { slug });
  } catch {
    return null;
  }
}

async function getQuestionnaire(serviceSlug: string) {
  try {
    return await client.fetch(onboardingQuestionnaireQuery, { serviceSlug });
  } catch {
    return null;
  }
}

async function getContractTemplate() {
  try {
    return await client.fetch(contractTemplateQuery);
  } catch {
    return null;
  }
}

async function getSettings() {
  try {
    return await client.fetch(settingsQuery);
  } catch {
    return null;
  }
}

export default async function ServiceOnboardingPage({ params }: PageProps) {
  const { serviceSlug } = await params;

  // Validate slug
  if (!validSlugs.includes(serviceSlug as ServiceType)) {
    notFound();
  }

  const [service, questionnaire, contractTemplate, settings] = await Promise.all([
    getServiceData(serviceSlug),
    getQuestionnaire(serviceSlug),
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
