import { MetadataRoute } from "next";
import { client } from "@sanity/lib/client";
import { groq } from "next-sanity";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://emmotion.ch";

// Query für alle Services
const servicesForSitemapQuery = groq`
  *[_type == "service"] | order(order asc) {
    "slug": slug.current,
    _updatedAt
  }
`;

// Query für alle Projekte
const projectsForSitemapQuery = groq`
  *[_type == "project"] | order(publishedAt desc) {
    "slug": slug.current,
    _updatedAt,
    publishedAt
  }
`;

// Query für Legal Pages
const legalPagesForSitemapQuery = groq`
  *[_type == "legalPage"] {
    "slug": slug.current,
    _updatedAt
  }
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Statische Seiten
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/leistungen`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ueber-mich`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/konfigurator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tv-produktionen`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Dynamische Service-Seiten
  let servicePages: MetadataRoute.Sitemap = [];
  try {
    const services = await client.fetch<Array<{ slug: string; _updatedAt: string }>>(
      servicesForSitemapQuery
    );
    if (services && services.length > 0) {
      servicePages = services.map((service) => ({
        url: `${baseUrl}/leistungen/${service.slug}`,
        lastModified: new Date(service._updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("Error fetching services for sitemap:", error);
  }

  // Dynamische Projekt-Seiten
  let projectPages: MetadataRoute.Sitemap = [];
  try {
    const projects = await client.fetch<
      Array<{ slug: string; _updatedAt: string; publishedAt?: string }>
    >(projectsForSitemapQuery);
    if (projects && projects.length > 0) {
      projectPages = projects.map((project) => ({
        url: `${baseUrl}/portfolio/${project.slug}`,
        lastModified: new Date(project._updatedAt || project.publishedAt || new Date()),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Error fetching projects for sitemap:", error);
  }

  // Legal Pages (Impressum, Datenschutz)
  let legalPages: MetadataRoute.Sitemap = [];
  try {
    const legals = await client.fetch<Array<{ slug: string; _updatedAt: string }>>(
      legalPagesForSitemapQuery
    );
    if (legals && legals.length > 0) {
      legalPages = legals.map((legal) => ({
        url: `${baseUrl}/${legal.slug}`,
        lastModified: new Date(legal._updatedAt),
        changeFrequency: "yearly" as const,
        priority: 0.3,
      }));
    }
  } catch (error) {
    console.error("Error fetching legal pages for sitemap:", error);
  }

  return [...staticPages, ...servicePages, ...projectPages, ...legalPages];
}
