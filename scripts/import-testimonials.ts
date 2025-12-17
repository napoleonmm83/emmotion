/**
 * Script zum Importieren der Demo-Testimonials ins Sanity CMS
 *
 * Ausführen mit: npx tsx scripts/import-testimonials.ts
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

// Die bestehenden hardcoded Demo-Testimonials
const testimonials = [
  {
    quote:
      "Die Zusammenarbeit war von Anfang an professionell und unkompliziert. Das Ergebnis hat unsere Erwartungen übertroffen.",
    author: "Sarah Müller",
    position: "Marketing Leiterin",
    company: "TechVision AG",
    featured: true,
  },
  {
    quote:
      "Endlich ein Videograf, der versteht, was wir brauchen. Die Qualität ist auf TV-Niveau – absolut empfehlenswert.",
    author: "Thomas Brunner",
    position: "Geschäftsführer",
    company: "Brunner Immobilien",
    featured: true,
  },
  {
    quote:
      "Unser Imagefilm hat uns bereits mehrere neue Kunden gebracht. Die Investition hat sich mehr als gelohnt.",
    author: "Lisa Oberhauser",
    position: "Inhaberin",
    company: "Oberhauser Design Studio",
    featured: true,
  },
];

async function importTestimonials() {
  console.log("🚀 Starte Import der Testimonials...\n");

  for (const testimonial of testimonials) {
    try {
      // Check if testimonial already exists (by author name)
      const existing = await client.fetch(
        `*[_type == "testimonial" && author == $author][0]._id`,
        { author: testimonial.author }
      );

      if (existing) {
        console.log(`⏭️  "${testimonial.author}" existiert bereits`);
        continue;
      }

      // Create testimonial document
      const testimonialDoc = {
        _type: "testimonial",
        quote: testimonial.quote,
        author: testimonial.author,
        position: testimonial.position,
        company: testimonial.company,
        featured: testimonial.featured,
      };

      const result = await client.create(testimonialDoc);
      console.log(`✅ "${testimonial.author}" erstellt (${result._id})`);
    } catch (error) {
      console.error(`❌ Fehler bei "${testimonial.author}":`, error);
    }
  }

  console.log("\n✨ Import abgeschlossen!");
}

importTestimonials();
