import { cacheLife } from "next/cache";
import type { Metadata } from "next";
import { UeberMichContent } from "./ueber-mich-content";
import { client } from "@sanity/lib/client";
import { aboutPageQuery, settingsQuery } from "@sanity/lib/queries";
import { CACHE_PROFILES } from "@/lib/cache";

async function getAboutData() {
  "use cache";
  cacheLife(CACHE_PROFILES.cms); // Über-mich-Daten - 60s revalidate
  try {
    const data = await client.fetch(aboutPageQuery);
    return data;
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
  const [aboutData, settings] = await Promise.all([getAboutData(), getSettings()]);

  return <UeberMichContent data={aboutData} settings={settings} />;
}
