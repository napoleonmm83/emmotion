import { cacheLife } from "next/cache";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NotFoundContent } from "./not-found-content";
import { client } from "@sanity/lib/client";
import { settingsQuery } from "@sanity/lib/queries";
import { CACHE_PROFILES } from "@/lib/cache";

async function getSettings() {
  "use cache";
  cacheLife(CACHE_PROFILES.settings); // Site-Einstellungen - 10min revalidate
  try {
    return await client.fetch(settingsQuery);
  } catch {
    return null;
  }
}

export default async function NotFound() {
  const settings = await getSettings();

  return (
    <>
      <Header />
      <NotFoundContent />
      <Footer settings={settings} />
    </>
  );
}
