// Seite alle 60 Sekunden revalidieren für CMS-Updates
export const revalidate = 60;

import { Metadata } from "next";
import { LeistungenPageContent } from "./leistungen-content";
import { client } from "@sanity/lib/client";
import { servicesQuery } from "@sanity/lib/queries";
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
        ? urlFor(service.featuredImage).width(800).height(600).url()
        : null,
      idealFor: service.idealFor || [],
    }));
  } catch {
    return null;
  }
}

export default async function LeistungenPage() {
  const services = await getServices();
  return <LeistungenPageContent services={services} />;
}
