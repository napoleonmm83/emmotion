// Seite alle 60 Sekunden revalidieren für CMS-Updates
export const revalidate = 60;

import { Metadata } from "next";
import { PortfolioPageContent } from "./portfolio-content";
import { client } from "@sanity/lib/client";
import { projectsQuery, portfolioPageQuery, settingsQuery } from "@sanity/lib/queries";
import { urlFor } from "@sanity/lib/image";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Entdecken Sie eine Auswahl meiner Videoprojekte – von Imagefilmen über Eventvideos bis hin zu Social Media Content.",
  openGraph: {
    title: "Portfolio | emmotion.ch",
    description:
      "Entdecken Sie eine Auswahl meiner Videoprojekte – von Imagefilmen über Eventvideos bis hin zu Social Media Content.",
  },
};

interface SanityProject {
  _id: string;
  title: string;
  slug: { current: string };
  client?: string;
  category?: string;
  categorySlug?: string;
  industry?: string;
  videoUrl?: string;
  thumbnail?: { asset: { _ref: string } };
  featured?: boolean;
  publishedAt?: string;
}

interface PortfolioPageData {
  hero?: {
    title?: string;
    subtitle?: string;
  };
  categories?: Array<{
    value?: string;
    label?: string;
  }>;
  industries?: Array<{
    value?: string;
    label?: string;
  }>;
  cta?: {
    title?: string;
    description?: string;
    buttonText?: string;
  };
  emptyState?: {
    message?: string;
    resetText?: string;
  };
}

async function getProjects() {
  try {
    const projects = await client.fetch<SanityProject[]>(projectsQuery);
    if (!projects || projects.length === 0) return null;

    return projects.map((project) => ({
      title: project.title,
      slug: typeof project.slug === "string" ? project.slug : project.slug?.current || "",
      client: project.client || "",
      category: project.categorySlug || "imagefilm",
      industry: project.industry || "dienstleistung",
      videoUrl: project.videoUrl || "",
      thumbnail: project.thumbnail?.asset
        ? urlFor(project.thumbnail).width(800).height(600).url()
        : "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
      year: project.publishedAt
        ? new Date(project.publishedAt).getFullYear().toString()
        : "2024",
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return null;
  }
}

async function getPortfolioPageData(): Promise<PortfolioPageData | null> {
  try {
    const data = await client.fetch(portfolioPageQuery);
    return data || null;
  } catch {
    return null;
  }
}

async function getSettings() {
  try {
    const data = await client.fetch(settingsQuery);
    return data || null;
  } catch {
    return null;
  }
}

export default async function PortfolioPage() {
  const [projects, pageData, settings] = await Promise.all([
    getProjects(),
    getPortfolioPageData(),
    getSettings(),
  ]);

  return <PortfolioPageContent projects={projects} pageData={pageData} settings={settings} />;
}
