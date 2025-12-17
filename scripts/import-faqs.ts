/**
 * Script zum Importieren der FAQs ins Sanity CMS
 *
 * Ausführen mit: npx tsx scripts/import-faqs.ts
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

interface FAQData {
  _type: "faq";
  question: string;
  answer: Array<{
    _type: "block";
    _key: string;
    style?: string;
    listItem?: string;
    children: Array<{
      _type: "span";
      _key: string;
      text: string;
      marks?: string[];
    }>;
    markDefs?: Array<{ _type: string; _key: string }>;
  }>;
  category: string;
  order: number;
}

// Die bestehenden hardcoded FAQs
const faqs: FAQData[] = [
  {
    _type: "faq",
    question: "Was kostet ein Imagevideo?",
    answer: [
      {
        _type: "block",
        _key: "b1",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Die Kosten für ein Imagevideo variieren je nach Umfang, Länge und Komplexität. Ein einfaches Imagevideo beginnt ab ca. CHF 2'400. Mit dem ",
          },
          {
            _type: "span",
            _key: "s2",
            marks: ["strong"],
            text: "Video-Konfigurator",
          },
          {
            _type: "span",
            _key: "s3",
            text: " können Sie eine unverbindliche Preisschätzung für Ihr Projekt erhalten.",
          },
        ],
        markDefs: [],
      },
    ],
    category: "kosten",
    order: 1,
  },
  {
    _type: "faq",
    question: "Welche Rechte erhalte ich am fertigen Video?",
    answer: [
      {
        _type: "block",
        _key: "b1",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Sie erhalten die vollständigen Nutzungsrechte für alle vereinbarten Kanäle (Website, Social Media, Messen etc.). Die Rechte an der Musik und verwendeten Stockmaterial sind ebenfalls abgedeckt. Details werden im Angebot festgehalten.",
          },
        ],
        markDefs: [],
      },
    ],
    category: "kosten",
    order: 2,
  },
  {
    _type: "faq",
    question: "Wie lange dauert die Produktion eines Videos?",
    answer: [
      {
        _type: "block",
        _key: "b1",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Die Produktionszeit hängt vom Projektumfang ab. Ein typisches Imagevideo dauert ca. 2-4 Wochen von der Planung bis zur Fertigstellung. Für dringende Projekte biete ich auch einen Express-Service an.",
          },
        ],
        markDefs: [],
      },
    ],
    category: "ablauf",
    order: 3,
  },
  {
    _type: "faq",
    question: "Wie läuft eine Videoproduktion ab?",
    answer: [
      {
        _type: "block",
        _key: "b1",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Der Ablauf gliedert sich in vier Phasen: 1. Beratung & Konzept – Ich bespreche mit Ihnen Ihre Ziele und entwickle ein Konzept. 2. Planung – Drehbuch, Zeitplan und Vorbereitung. 3. Dreh – Professionelle Aufnahmen vor Ort. 4. Postproduktion – Schnitt, Farbkorrektur, Musik und Effekte.",
          },
        ],
        markDefs: [],
      },
    ],
    category: "ablauf",
    order: 4,
  },
  {
    _type: "faq",
    question: "Kann ich Änderungen am fertigen Video verlangen?",
    answer: [
      {
        _type: "block",
        _key: "b1",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Ja, zwei Korrekturschleifen sind im Preis inbegriffen. Sie erhalten zunächst einen Rohschnitt zur Prüfung und können dann Anpassungen wünschen. Grössere Änderungen nach Freigabe werden separat berechnet.",
          },
        ],
        markDefs: [],
      },
    ],
    category: "ablauf",
    order: 5,
  },
  {
    _type: "faq",
    question: "In welcher Qualität wird gefilmt?",
    answer: [
      {
        _type: "block",
        _key: "b1",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Ich filme standardmässig in 4K-Auflösung mit professionellem Kameraequipment. Das garantiert höchste Bildqualität und Flexibilität in der Postproduktion. Auf Wunsch sind auch andere Formate möglich.",
          },
        ],
        markDefs: [],
      },
    ],
    category: "technik",
    order: 6,
  },
  {
    _type: "faq",
    question: "Bieten Sie auch Drohnenaufnahmen an?",
    answer: [
      {
        _type: "block",
        _key: "b1",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Ja, ich bin zertifizierter Drohnenpilot und biete professionelle Luftaufnahmen an. Drohnenaufnahmen können als Extra zu jedem Videoprojekt hinzugebucht werden und verleihen Ihrem Video eine beeindruckende Perspektive.",
          },
        ],
        markDefs: [],
      },
    ],
    category: "technik",
    order: 7,
  },
  {
    _type: "faq",
    question: "Wer sind Sie und was unterscheidet Sie von anderen?",
    answer: [
      {
        _type: "block",
        _key: "b1",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Ich bin Marcus Martini, Videograf mit TV-Erfahrung aus dem Regionalfernsehen. Im Gegensatz zu grossen Agenturen arbeiten Sie bei mir direkt mit dem Produzenten – persönlich, flexibel und ohne Umwege. Mein Fokus liegt auf authentischen Geschichten für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz.",
          },
        ],
        markDefs: [],
      },
    ],
    category: "allgemein",
    order: 8,
  },
];

async function importFAQs() {
  console.log("🚀 Starte Import der FAQs...\n");

  for (const faq of faqs) {
    try {
      // Check if FAQ already exists (by question)
      const existing = await client.fetch(
        `*[_type == "faq" && question == $question][0]._id`,
        { question: faq.question }
      );

      if (existing) {
        console.log(`⏭️  "${faq.question.substring(0, 40)}..." existiert bereits`);
        continue;
      }

      // Create new FAQ
      const result = await client.create(faq);
      console.log(`✅ "${faq.question.substring(0, 40)}..." erstellt (${result._id})`);
    } catch (error) {
      console.error(`❌ Fehler bei "${faq.question}":`, error);
    }
  }

  console.log("\n✨ Import abgeschlossen!");
}

importFAQs();
