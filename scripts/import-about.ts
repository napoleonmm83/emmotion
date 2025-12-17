/**
 * Script zum Importieren der "Über mich" Daten ins Sanity CMS
 *
 * Ausführen mit: npx tsx scripts/import-about.ts
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

// Die bestehenden hardcoded Daten aus ueber-mich-content.tsx
const aboutData = {
  _type: "aboutPage",
  _id: "aboutPage",
  name: "Marcus Martini",
  subtitle: "Videograf mit TV-Erfahrung",
  heroText:
    "Videograf mit TV-Erfahrung, spezialisiert auf authentische Unternehmensvideos. Ich bringe Ihre Geschichte auf den Punkt – professionell, persönlich und mit Leidenschaft.",
  description: [
    {
      _type: "block",
      _key: "desc1",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "span1",
          text: "Nach Jahren beim Regionalfernsehen weiss ich, wie man Geschichten erzählt, die berühren. Diese Erfahrung bringe ich jetzt für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz ein. Bei mir bekommen Sie keine anonyme Agentur, sondern einen persönlichen Partner für Ihr Videoprojekt.",
        },
      ],
      markDefs: [],
    },
  ],
  stats: [
    { _key: "stat1", value: "10+", label: "Jahre Erfahrung" },
    { _key: "stat2", value: "100+", label: "Projekte" },
    { _key: "stat3", value: "TV", label: "Qualitätsstandard" },
    { _key: "stat4", value: "100%", label: "Persönlich" },
  ],
  values: [
    {
      _key: "val1",
      icon: "Tv",
      title: "TV-Erfahrung",
      description:
        "Jahre im Regionalfernsehen haben mich gelehrt, Geschichten packend zu erzählen und auch unter Zeitdruck höchste Qualität zu liefern.",
    },
    {
      _key: "val2",
      icon: "Users",
      title: "Persönlich statt Agentur",
      description:
        "Bei mir arbeiten Sie direkt mit dem Produzenten. Keine Umwege, keine Missverständnisse – persönliche Betreuung von A bis Z.",
    },
    {
      _key: "val3",
      icon: "MapPin",
      title: "Regional verwurzelt",
      description:
        "Im Rheintal aufgewachsen, kenne ich die Region und ihre Menschen. Das schafft Vertrauen und authentische Ergebnisse.",
    },
    {
      _key: "val4",
      icon: "Heart",
      title: "Mit Leidenschaft",
      description:
        "Video ist nicht nur mein Beruf, sondern meine Leidenschaft. Diese Begeisterung fliesst in jedes Projekt ein.",
    },
  ],
  timeline: [
    {
      _key: "time1",
      year: "Heute",
      title: "emmotion.ch",
      description:
        "Selbstständiger Videograf für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz.",
    },
    {
      _key: "time2",
      year: "Vorher",
      title: "Regionalfernsehen",
      description:
        "Kameramann und Editor beim Regionalfernsehen. Täglich Beiträge produziert, live gesendet, Geschichten erzählt.",
    },
    {
      _key: "time3",
      year: "Anfänge",
      title: "Die Leidenschaft entdeckt",
      description:
        "Schon früh die Kamera in der Hand. Was als Hobby begann, wurde zur Berufung.",
    },
  ],
  whyWorkWithMe: {
    title: "Warum mit mir arbeiten?",
    description:
      "Bei einer grossen Agentur sind Sie einer von vielen. Bei mir sind Sie mein Fokus. Ich nehme mir Zeit für Ihr Projekt und liefere Qualität, die überzeugt.",
    points: [
      "Direkte Kommunikation ohne Umwege",
      "Fixpreise statt böser Überraschungen",
      "Schnelle Reaktionszeiten",
      "Lokale Präsenz – persönliche Treffen möglich",
      "TV-Qualität zu fairen Preisen",
    ],
  },
  seo: {
    metaTitle: "Über mich | emmotion.ch",
    metaDescription:
      "Marcus Martini - Videograf mit TV-Erfahrung aus dem Rheintal. Persönliche Videoproduktion für Unternehmen in der Ostschweiz und Liechtenstein.",
  },
};

async function importAboutPage() {
  console.log("🚀 Starte Import der 'Über mich' Seite...\n");

  try {
    // Check if document already exists
    const existing = await client.fetch(`*[_id == "aboutPage"][0]._id`);

    if (existing) {
      console.log("📝 'Über mich' existiert bereits - aktualisiere...");
      // Update existing document
      const result = await client
        .patch("aboutPage")
        .set({
          name: aboutData.name,
          subtitle: aboutData.subtitle,
          heroText: aboutData.heroText,
          description: aboutData.description,
          stats: aboutData.stats,
          values: aboutData.values,
          timeline: aboutData.timeline,
          whyWorkWithMe: aboutData.whyWorkWithMe,
          seo: aboutData.seo,
        })
        .commit();
      console.log(`✅ 'Über mich' aktualisiert (${result._id})`);
    } else {
      console.log("📝 Erstelle 'Über mich' Dokument...");
      // Create new document with specific ID
      const result = await client.createOrReplace(aboutData);
      console.log(`✅ 'Über mich' erstellt (${result._id})`);
    }
  } catch (error) {
    console.error("❌ Fehler beim Import:", error);
    process.exit(1);
  }

  console.log("\n✨ Import abgeschlossen!");
}

importAboutPage();
