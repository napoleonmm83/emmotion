import type { Metadata } from "next";
import { UeberMichContent } from "./ueber-mich-content";
import { client } from "@sanity/lib/client";
import { aboutPageQuery } from "@sanity/lib/queries";

async function getAboutData() {
  try {
    const data = await client.fetch(aboutPageQuery);
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getAboutData();

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

export default async function UeberMichPage() {
  const aboutData = await getAboutData();

  return <UeberMichContent data={aboutData} />;
}
