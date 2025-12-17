/**
 * Script zum Importieren der Demo-Projekte ins Sanity CMS
 *
 * Ausführen mit: npx tsx scripts/import-projects.ts
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

// Mapping von Kategorie-Slug zu Service-Titel für die Referenz
const categoryToServiceSlug: Record<string, string> = {
  imagefilm: "imagefilm",
  eventvideo: "eventvideo",
  produktvideo: "produktvideo",
  "social-media": "social-media",
  drohnenaufnahmen: "drohnenaufnahmen",
};

// Die bestehenden hardcoded Demo-Projekte
const projects = [
  {
    title: "Corporate Vision",
    slug: "corporate-vision",
    category: "imagefilm",
    industry: "dienstleistung",
    thumbnail:
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    client: "TechVision AG",
    year: "2024",
    challenge:
      "TechVision AG benötigte einen Imagefilm, der ihre innovative Unternehmenskultur und technische Expertise authentisch darstellt, um qualifizierte Fachkräfte anzuziehen.",
    solution:
      "Ich entwickelte ein Konzept, das die Mitarbeiter in den Mittelpunkt stellt und die moderne Arbeitsumgebung sowie spannende Projekte zeigt. Durch Interviews und B-Roll-Material entstand ein authentisches Porträt des Unternehmens.",
    result:
      "Der Imagefilm wird erfolgreich im Recruiting eingesetzt und hat die Bewerberquote um 40% gesteigert. Auf LinkedIn erreichte das Video über 50.000 Views.",
    featured: true,
  },
  {
    title: "Summit 2024",
    slug: "summit-2024",
    category: "eventvideo",
    industry: "dienstleistung",
    thumbnail:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    client: "Swiss Business Forum",
    year: "2024",
    challenge:
      "Das Swiss Business Forum wollte die Highlights ihres jährlichen Summits einfangen und für Marketing-Zwecke nutzen.",
    solution:
      "Mit einem kleinen Team dokumentierte ich die wichtigsten Momente: Keynotes, Networking-Sessions und die Atmosphäre des Events.",
    result:
      "Das Highlight-Video wird für die Bewerbung des nächsten Summits eingesetzt und hat bereits zu einer 25% höheren Anmeldequote geführt.",
    featured: true,
  },
  {
    title: "Product Launch",
    slug: "product-launch",
    category: "produktvideo",
    industry: "industrie",
    thumbnail:
      "https://images.unsplash.com/photo-1551817958-c5b51e7b4a33?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    client: "InnoTech GmbH",
    year: "2024",
    challenge:
      "InnoTech GmbH brauchte ein überzeugendes Produktvideo für die Markteinführung ihrer neuen Industrielösung.",
    solution:
      "Ich produzierte ein technisch präzises Video, das die Funktionen und Vorteile des Produkts klar kommuniziert.",
    result:
      "Das Video wird auf Messen und im Online-Marketing eingesetzt und hat die Conversion-Rate auf der Produktseite verdoppelt.",
    featured: true,
  },
  {
    title: "Alpine Views",
    slug: "alpine-views",
    category: "drohnenaufnahmen",
    industry: "tourismus",
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    client: "Tourismus Rheintal",
    year: "2024",
    challenge:
      "Tourismus Rheintal wollte die Schönheit der Region aus einer neuen Perspektive zeigen.",
    solution:
      "Mit professionellen Drohnenaufnahmen fing ich die atemberaubende Landschaft des Rheintals ein.",
    result:
      "Die Aufnahmen werden in der Tourismus-Kampagne eingesetzt und haben auf Social Media grosse Reichweite erzielt.",
    featured: false,
  },
  {
    title: "Brand Story",
    slug: "brand-story",
    category: "social-media",
    industry: "handwerk",
    thumbnail:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    client: "Schreinerei Müller",
    year: "2023",
    challenge:
      "Die Schreinerei Müller wollte ihre Handwerkskunst und Tradition auf Social Media präsentieren.",
    solution:
      "Ich erstellte eine Serie von kurzen, authentischen Videos, die den Arbeitsalltag und die Leidenschaft des Teams zeigen.",
    result:
      "Die Social-Media-Präsenz wurde deutlich gestärkt, mit einer Verdreifachung der Follower-Zahl innerhalb von 3 Monaten.",
    featured: false,
  },
  {
    title: "Interview Series",
    slug: "interview-series",
    category: "imagefilm",
    industry: "dienstleistung",
    thumbnail:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    client: "Consulting Partners",
    year: "2023",
    challenge:
      "Consulting Partners wollte die Expertise ihrer Berater durch eine Interview-Serie hervorheben.",
    solution:
      "Ich führte und filmte Interviews mit den führenden Beratern und schnitt sie zu einer ansprechenden Serie zusammen.",
    result:
      "Die Interview-Serie wird im Content-Marketing eingesetzt und hat die Thought-Leadership-Position des Unternehmens gestärkt.",
    featured: false,
  },
  {
    title: "Restaurant Ambiance",
    slug: "restaurant-ambiance",
    category: "imagefilm",
    industry: "gastronomie",
    thumbnail:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    client: "Restaurant Rheinblick",
    year: "2023",
    challenge:
      "Restaurant Rheinblick wollte die einzigartige Atmosphäre und kulinarische Qualität ihres Hauses präsentieren.",
    solution:
      "Ich produzierte ein stimmungsvolles Video, das die Ambiance, das Team und die Gerichte in Szene setzt.",
    result:
      "Das Video wird auf der Website und Social Media eingesetzt und hat zu einem Anstieg der Reservierungen geführt.",
    featured: false,
  },
  {
    title: "Factory Tour",
    slug: "factory-tour",
    category: "imagefilm",
    industry: "industrie",
    thumbnail:
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    client: "Metallbau Rheintal",
    year: "2023",
    challenge:
      "Metallbau Rheintal wollte potenziellen Kunden und Bewerbern einen Einblick in ihre Produktion geben.",
    solution:
      "Ich erstellte eine virtuelle Fabrikführung, die den gesamten Produktionsprozess zeigt.",
    result:
      "Das Video wird im B2B-Marketing und Recruiting eingesetzt und hat die Anfragen von qualifizierten Kunden erhöht.",
    featured: false,
  },
  {
    title: "Team Building Event",
    slug: "team-building-event",
    category: "eventvideo",
    industry: "dienstleistung",
    thumbnail:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    client: "Corporate Events AG",
    year: "2023",
    challenge:
      "Corporate Events AG wollte ein Team-Building-Event dokumentieren, um es als Referenz für zukünftige Kunden zu nutzen.",
    solution:
      "Ich begleitete das Event und fing die besten Momente und die positive Energie des Teams ein.",
    result:
      "Das Video dient als überzeugende Referenz und hat mehrere neue Buchungen generiert.",
    featured: false,
  },
];

async function getServiceIdBySlug(slug: string): Promise<string | null> {
  const service = await client.fetch(
    `*[_type == "service" && slug.current == $slug][0]._id`,
    { slug }
  );
  return service || null;
}

async function uploadImageFromUrl(
  imageUrl: string,
  filename: string
): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const asset = await client.assets.upload("image", Buffer.from(buffer), {
      filename,
    });
    return asset._id;
  } catch (error) {
    console.error(`Fehler beim Hochladen von ${filename}:`, error);
    return null;
  }
}

async function importProjects() {
  console.log("🚀 Starte Import der Projekte...\n");

  // Erst alle Service-IDs laden
  const serviceIds: Record<string, string> = {};
  for (const slug of Object.values(categoryToServiceSlug)) {
    const id = await getServiceIdBySlug(slug);
    if (id) {
      serviceIds[slug] = id;
    }
  }
  console.log("📂 Services gefunden:", Object.keys(serviceIds).join(", "));

  for (const project of projects) {
    try {
      // Check if project already exists
      const existing = await client.fetch(
        `*[_type == "project" && slug.current == $slug][0]._id`,
        { slug: project.slug }
      );

      if (existing) {
        console.log(`⏭️  "${project.title}" existiert bereits`);
        continue;
      }

      // Upload thumbnail
      console.log(`📷 Lade Thumbnail für "${project.title}"...`);
      const thumbnailId = await uploadImageFromUrl(
        project.thumbnail,
        `${project.slug}-thumbnail.jpg`
      );

      if (!thumbnailId) {
        console.log(`⚠️  Thumbnail-Upload fehlgeschlagen für "${project.title}"`);
        continue;
      }

      // Get service reference
      const serviceSlug = categoryToServiceSlug[project.category];
      const serviceId = serviceSlug ? serviceIds[serviceSlug] : null;

      // Create project document
      const projectDoc = {
        _type: "project",
        title: project.title,
        slug: { _type: "slug", current: project.slug },
        client: project.client,
        category: serviceId ? { _type: "reference", _ref: serviceId } : undefined,
        industry: project.industry,
        videoUrl: project.videoUrl,
        thumbnail: {
          _type: "image",
          asset: { _type: "reference", _ref: thumbnailId },
        },
        challenge: project.challenge,
        solution: project.solution,
        result: project.result,
        featured: project.featured,
        publishedAt: `${project.year}-01-01`,
      };

      const result = await client.create(projectDoc);
      console.log(`✅ "${project.title}" erstellt (${result._id})`);
    } catch (error) {
      console.error(`❌ Fehler bei "${project.title}":`, error);
    }
  }

  console.log("\n✨ Import abgeschlossen!");
}

importProjects();
