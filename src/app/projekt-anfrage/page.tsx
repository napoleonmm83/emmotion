import type { Metadata } from "next";
import { ProjektAnfrageContent } from "./projekt-anfrage-content";
import { client } from "@sanity/lib/client";
import { settingsQuery, servicesQuery } from "@sanity/lib/queries";
import { urlFor } from "@sanity/lib/image";

export const revalidate = 60;

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

interface SanityService {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  icon?: string;
  priceFrom?: number;
  featuredImage?: { asset: { _ref: string } };
}

async function getServices() {
  try {
    const services = await client.fetch<SanityService[]>(servicesQuery);
    if (!services || services.length === 0) return null;

    return services.map((service) => ({
      title: service.title,
      slug: service.slug,
      shortDescription: service.shortDescription || "",
      icon: service.icon || "Film",
      priceFrom: service.priceFrom || 0,
      image: service.featuredImage?.asset
        ? urlFor(service.featuredImage).width(400).height(300).url()
        : null,
    }));
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

export default async function ProjektAnfragePage() {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);
  return <ProjektAnfrageContent services={services} settings={settings} />;
}
