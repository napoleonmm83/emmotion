import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { join } from "path";

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
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function cleanup() {
  console.log("Lösche Duplikate...\n");

  try {
    // Lösche das alte aboutPage Dokument (nicht das Singleton mit ID 'aboutPage')
    const result = await client.delete("6f7eb2f6-58fa-4334-8fae-26adbbc90096");
    console.log("✅ Altes aboutPage Duplikat gelöscht");
  } catch (e) {
    console.log("Duplikat existiert nicht mehr oder Fehler:", e);
  }

  // Verifiziere
  const remaining = await client.fetch('*[_type == "aboutPage"]{ _id, name }');
  console.log("\nVerbleibende aboutPage Dokumente:");
  remaining.forEach((doc: { _id: string; name: string }) => {
    console.log(`- ${doc._id}: ${doc.name}`);
  });
}

cleanup();
