/**
 * Script zum Importieren/Aktualisieren der Site Settings im Sanity CMS
 *
 * Ausführen mit: npx tsx scripts/import-settings.ts
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

// Die bestehenden hardcoded Settings
const settings = {
  _type: "settings",
  _id: "settings", // Singleton ID
  siteName: "emmotion.ch",
  siteDescription: "Videoproduktion mit TV-Erfahrung für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz.",
  contact: {
    email: "hallo@emmotion.ch",
    phone: "+41 79 723 29 24",
    street: "Kerbelstrasse 6",
    city: "9470 Buchs SG",
    uid: "CHE-387.768.205",
    region: "Rheintal, Liechtenstein, Ostschweiz",
  },
  social: {
    instagram: "https://instagram.com/emmotion.ch",
    linkedin: "https://linkedin.com/in/marcusmartini",
    youtube: "https://youtube.com/@emmotion",
  },
  footer: {
    tagline: "Videoproduktion mit TV-Erfahrung für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz.",
    ctaText: "Bereit für Ihr nächstes Videoprojekt? Ich freue mich auf Ihre Anfrage.",
    copyrightName: "emmotion",
  },
  seo: {
    allowIndexing: false, // Auf true setzen für Go-Live!
    metaTitle: "emmotion.ch – Videoproduktion mit TV-Erfahrung",
    metaDescription: "Professionelle Videoproduktion für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz. Imagefilme, Eventvideos, Social Media Content und mehr.",
  },
};

async function importSettings() {
  console.log("🚀 Starte Import der Settings...\n");

  try {
    // Check if settings already exist
    const existing = await client.fetch(
      `*[_type == "settings"][0]._id`
    );

    if (existing) {
      // Update existing settings
      console.log("📝 Aktualisiere bestehende Settings...");
      const result = await client
        .patch(existing)
        .set({
          siteName: settings.siteName,
          siteDescription: settings.siteDescription,
          contact: settings.contact,
          social: settings.social,
          footer: settings.footer,
          // SEO nicht überschreiben falls bereits konfiguriert
        })
        .commit();
      console.log(`✅ Settings aktualisiert (${result._id})`);
    } else {
      // Create new settings
      console.log("📝 Erstelle neue Settings...");
      const result = await client.create(settings);
      console.log(`✅ Settings erstellt (${result._id})`);
    }
  } catch (error) {
    console.error("❌ Fehler:", error);
  }

  console.log("\n✨ Import abgeschlossen!");
}

importSettings();
