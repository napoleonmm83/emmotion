// Seite alle 60 Sekunden revalidieren für CMS-Updates
export const revalidate = 60;

import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactPageContent } from "./contact-content";
import { client } from "@sanity/lib/client";
import { settingsQuery, contactPageQuery } from "@sanity/lib/queries";

// Default SEO
const defaultSeo = {
  title: "Kontakt | emmotion.ch",
  description:
    "Nehmen Sie Kontakt auf für Ihr nächstes Videoprojekt. Videoproduktion im Rheintal, Liechtenstein und der Ostschweiz.",
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
  try {
    const data = await client.fetch(settingsQuery);
    return data || null;
  } catch {
    return null;
  }
}

async function getContactPageData() {
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
