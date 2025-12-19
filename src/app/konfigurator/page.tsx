// Seite alle 60 Sekunden revalidieren für CMS-Updates
export const revalidate = 60;

import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { KonfiguratorPageContent } from "./konfigurator-content";
import { client } from "@sanity/lib/client";
import { konfiguratorPageQuery, settingsQuery } from "@sanity/lib/queries";

export const metadata: Metadata = {
  title: "Video-Konfigurator | emmotion.ch",
  description:
    "Berechne den Preis für dein Videoprojekt. Imagefilm, Recruiting-Video, Produktvideo oder Social Media Content – konfiguriere dein Wunschvideo.",
  openGraph: {
    title: "Video-Konfigurator | emmotion.ch",
    description:
      "Berechne den Preis für dein Videoprojekt. Konfiguriere dein Wunschvideo und erhalte eine unverbindliche Preisschätzung.",
  },
};

interface KonfiguratorPageData {
  hero?: {
    title?: string;
    subtitle?: string;
  };
  benefits?: Array<{
    icon?: string;
    title?: string;
    description?: string;
  }>;
  infoSection?: {
    title?: string;
    description?: string;
  };
  steps?: Array<{
    title?: string;
    description?: string;
  }>;
}

async function getKonfiguratorPageData(): Promise<KonfiguratorPageData | null> {
  try {
    const data = await client.fetch(konfiguratorPageQuery);
    return data || null;
  } catch {
    return null;
  }
}

async function getSettings() {
  try {
    const data = await client.fetch(settingsQuery);
    return data || null;
  } catch {
    return null;
  }
}

export default async function KonfiguratorPage() {
  const [pageData, settings] = await Promise.all([
    getKonfiguratorPageData(),
    getSettings(),
  ]);

  return (
    <>
      <Header />
      <main className="pt-20">
        <KonfiguratorPageContent data={pageData} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
