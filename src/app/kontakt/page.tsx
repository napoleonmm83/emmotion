import { cacheLife } from "next/cache";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactPageContent } from "./contact-content";
import { client } from "@sanity/lib/client";
import { settingsQuery, contactPageQuery } from "@sanity/lib/queries";
import { CACHE_PROFILES } from "@/lib/cache";

// Default SEO
const defaultSeo = {
  title: "Kontakt | emmotion.ch",
  description:
    "Nimm Kontakt auf für dein nächstes Videoprojekt. Videoproduktion im Rheintal, Liechtenstein und der Ostschweiz.",
};

export async function generateMetadata(): Promise<Metadata> {
  let pageData;
  try {
    pageData = await client.fetch(contactPageQuery);
  } catch {
    pageData = null;
  }

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

async function getSettings() {
  "use cache";
  cacheLife(CACHE_PROFILES.settings); // Site-Einstellungen - 10min revalidate
  try {
    const data = await client.fetch(settingsQuery);
    return data || null;
  } catch {
    return null;
  }
}

async function getContactPageData() {
  "use cache";
  cacheLife(CACHE_PROFILES.cms); // Kontaktseiten-Daten - 60s revalidate
  try {
    const data = await client.fetch(contactPageQuery);
    return data || null;
  } catch {
    return null;
  }
}

export default async function KontaktPage() {
  const [settings, pageData] = await Promise.all([
    getSettings(),
    getContactPageData(),
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
