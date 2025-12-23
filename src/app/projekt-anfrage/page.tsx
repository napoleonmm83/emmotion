import { cacheLife } from "next/cache";
import type { Metadata } from "next";
import { ProjektAnfrageContent } from "./projekt-anfrage-content";
import { client } from "@sanity/lib/client";
import { settingsQuery, servicesQuery } from "@sanity/lib/queries";
import { urlFor } from "@sanity/lib/image";
import { CACHE_PROFILES } from "@/lib/cache";

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
  "use cache";
  cacheLife(CACHE_PROFILES.cms); // Services sind regulärer CMS-Inhalt - 60s revalidate
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
  "use cache";
  cacheLife(CACHE_PROFILES.settings); // Site-Einstellungen - 10min revalidate
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
