import type { MetadataRoute } from "next";
import { client } from "@sanity/lib/client";
import { seoSettingsQuery } from "@sanity/lib/queries";

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Hole SEO-Einstellungen aus Sanity
  const settings = await client.fetch(seoSettingsQuery);
  const allowIndexing = settings?.seo?.allowIndexing ?? false;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://emmotion.ch";

  if (!allowIndexing) {
    // Indexierung deaktiviert - blockiere alle Crawler
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  // Indexierung aktiviert - normale Regeln
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
