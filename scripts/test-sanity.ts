import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { join } from "path";

// Load env
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

// Client mit Token um auch Drafts zu sehen
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function test() {
  console.log("Testing Sanity connection...\n");

  // Alle HomePage Dokumente (inkl. Drafts)
  const allHomePages = await client.fetch('*[_type == "homePage"]{ _id, hero }');
  console.log("=== Alle HomePage Dokumente ===");
  allHomePages.forEach((doc: { _id: string; hero?: { titleLine1?: string } }) => {
    const isDraft = doc._id.startsWith("drafts.");
    console.log(`- ${doc._id} (${isDraft ? "DRAFT" : "PUBLISHED"})`);
    console.log(`  titleLine1: ${doc.hero?.titleLine1}`);
  });

  // Alle AboutPage Dokumente (inkl. Drafts)
  const allAboutPages = await client.fetch('*[_type == "aboutPage"]{ _id, name, heroText }');
  console.log("\n=== Alle AboutPage Dokumente ===");
  allAboutPages.forEach((doc: { _id: string; name?: string; heroText?: string }) => {
    const isDraft = doc._id.startsWith("drafts.");
    console.log(`- ${doc._id} (${isDraft ? "DRAFT" : "PUBLISHED"})`);
    console.log(`  name: ${doc.name}`);
    console.log(`  heroText: ${doc.heroText?.substring(0, 40)}...`);
  });

  console.log("\n=== HINWEIS ===");
  console.log("Wenn du nur DRAFT-Dokumente siehst, musst du im CMS auf 'Publish' klicken!");
}

test();
