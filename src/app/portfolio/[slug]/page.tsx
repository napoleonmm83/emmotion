// Seite alle 60 Sekunden revalidieren für CMS-Updates
export const revalidate = 60;

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectPageContent } from "./project-content";
import { client } from "@sanity/lib/client";
import { projectBySlugQuery, projectsQuery, settingsQuery } from "@sanity/lib/queries";
import { urlFor } from "@sanity/lib/image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface SanityProject {
  _id: string;
  title: string;
  slug: { current: string };
  client?: string;
  category?: { title: string; slug: { current: string } };
  categorySlug?: string;
  industry?: string;
  videoUrl?: string;
  thumbnail?: { asset: { _ref: string } };
  challenge?: string;
  solution?: string;
  result?: string;
  testimonial?: {
    quote: string;
    author: string;
    position?: string;
    company?: string;
  };
  publishedAt?: string;
}

interface SanityProjectListItem {
  _id: string;
  title: string;
  slug: { current: string };
  client?: string;
  category?: string;
  categorySlug?: string;
  industry?: string;
  videoUrl?: string;
  thumbnail?: { asset: { _ref: string } };
  publishedAt?: string;
}

async function getProjectBySlug(slug: string) {
  try {
    const project = await client.fetch<SanityProject>(projectBySlugQuery, { slug });
    if (!project) return null;

    return {
      title: project.title,
      slug: project.slug?.current || slug,
      client: project.client || "",
      category: project.category?.title || "Videoproduktion",
      categorySlug: project.category?.slug?.current || "imagefilm",
      industry: project.industry || "Dienstleistung",
      videoUrl: project.videoUrl || "",
      thumbnail: project.thumbnail?.asset
        ? urlFor(project.thumbnail).width(1200).height(675).url()
        : "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80",
      year: project.publishedAt
        ? new Date(project.publishedAt).getFullYear().toString()
        : "2024",
      challenge: project.challenge,
      solution: project.solution,
      result: project.result,
      testimonial: project.testimonial
        ? {
            quote: project.testimonial.quote,
            name: project.testimonial.author,
            role: project.testimonial.position || "",
            company: project.testimonial.company || "",
          }
        : undefined,
    };
  } catch {
    return null;
  }
}

async function getAllProjects() {
  try {
    const projects = await client.fetch<SanityProjectListItem[]>(projectsQuery);
    if (!projects || projects.length === 0) return [];

    return projects.map((project) => ({
      title: project.title,
      slug: project.slug?.current || "",
      client: project.client || "",
      category: project.category || "Videoproduktion",
      categorySlug: project.categorySlug || "imagefilm",
      industry: project.industry || "Dienstleistung",
      videoUrl: project.videoUrl || "",
      thumbnail: project.thumbnail?.asset
        ? urlFor(project.thumbnail).width(800).height(600).url()
        : "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
      year: project.publishedAt
        ? new Date(project.publishedAt).getFullYear().toString()
        : "2024",
    }));
  } catch {
    return [];
  }
}

async function getSettings() {
  try {
    return await client.fetch(settingsQuery);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Projekt nicht gefunden",
    };
  }

  return {
    title: project.title,
    description: `${project.category} für ${project.client}${project.challenge ? ` - ${project.challenge.slice(0, 120)}...` : ""}`,
    openGraph: {
      title: `${project.title} | emmotion.ch`,
      description: `${project.category} für ${project.client}`,
      images: [{ url: project.thumbnail }],
    },
  };
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getProjectBySlug(slug), getSettings()]);

  if (!project) {
    notFound();
  }

  // Get related projects (same category, excluding current)
  const allProjects = await getAllProjects();
  const relatedProjects = allProjects
    .filter((p) => p.categorySlug === project.categorySlug && p.slug !== project.slug)
    .slice(0, 3);

  return <ProjectPageContent project={project} relatedProjects={relatedProjects} settings={settings} />;
}
