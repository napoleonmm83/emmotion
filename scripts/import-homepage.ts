/**
 * Script zum Importieren der Startseiten-Daten ins Sanity CMS
 *
 * Ausführen mit: npx tsx scripts/import-homepage.ts
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { join } from "path";

// Load environment variables from .env.local
function loadEnv() {
  try {
    const envPath = join(process.cwd(), ".env.local");
    const envContent = readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const [key, ...valueParts] = line.split("=");
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join("=").trim();
      }
    }
  } catch (e) {
    console.error("Could not load .env.local");
  }
}

loadEnv();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Die bestehenden hardcoded Daten aus hero.tsx
const homePageData = {
  _type: "homePage",
  _id: "homePage",
  hero: {
    titleLine1: "Videos, die",
    titleHighlight: "wirken.",
    subtitle:
      "Videoproduktion mit TV-Erfahrung – für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz.",
    ctaPrimaryText: "Projekt anfragen",
    ctaPrimaryLink: "#kontakt",
    ctaSecondaryText: "Portfolio ansehen",
    ctaSecondaryLink: "#portfolio",
  },
  sections: {
    showServices: true,
    showPortfolio: true,
    showTestimonials: true,
    showCTA: true,
    showAbout: true,
    showContact: true,
  },
  seo: {
    metaTitle: "emmotion.ch | Videoproduktion Rheintal & Ostschweiz",
    metaDescription:
      "Professionelle Videoproduktion mit TV-Erfahrung für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz. Imagefilme, Recruiting-Videos und mehr.",
  },
};

async function importHomePage() {
  console.log("🚀 Starte Import der Startseite...\n");

  try {
    // Check if document already exists
    const existing = await client.fetch(`*[_id == "homePage"][0]._id`);

    if (existing) {
      console.log("📝 Startseite existiert bereits - aktualisiere...");
      const result = await client
        .patch("homePage")
        .set({
          hero: homePageData.hero,
          sections: homePageData.sections,
          seo: homePageData.seo,
        })
        .commit();
      console.log(`✅ Startseite aktualisiert (${result._id})`);
    } else {
      console.log("📝 Erstelle Startseite Dokument...");
      const result = await client.createOrReplace(homePageData);
      console.log(`✅ Startseite erstellt (${result._id})`);
    }
  } catch (error) {
    console.error("❌ Fehler beim Import:", error);
    process.exit(1);
  }

  console.log("\n✨ Import abgeschlossen!");
}

importHomePage();
