import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectPageContent } from "./project-content";
import { getProjectBySlug, getProjects, getSettings } from "@sanity/lib/data";
import { urlFor } from "@sanity/lib/image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// =============================================================================
// DATA TRANSFORMATION HELPERS
// =============================================================================

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

function transformProjectDetail(data: SanityProject | null, slug: string) {
  if (!data) return null;

  return {
    title: data.title,
    slug: data.slug?.current || slug,
    client: data.client || "",
    category: data.category?.title || "Videoproduktion",
    categorySlug: data.category?.slug?.current || "imagefilm",
    industry: data.industry || "Dienstleistung",
    videoUrl: data.videoUrl || "",
    thumbnail: data.thumbnail?.asset
      ? urlFor(data.thumbnail).width(1200).height(675).url()
      : "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80",
    year: data.publishedAt
      ? new Date(data.publishedAt).getFullYear().toString()
      : "2024",
    challenge: data.challenge,
    solution: data.solution,
    result: data.result,
    testimonial: data.testimonial
      ? {
          quote: data.testimonial.quote,
          name: data.testimonial.author,
          role: data.testimonial.position || "",
          company: data.testimonial.company || "",
        }
      : undefined,
  };
}

function transformProjectsList(data: SanityProjectListItem[] | null) {
  if (!data || data.length === 0) return [];

  return data.map((project) => ({
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
}

// =============================================================================
// METADATA
// =============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const projectData = await getProjectBySlug(slug);
  const project = transformProjectDetail(projectData as SanityProject, slug);

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

// =============================================================================
// STATIC PARAMS
// =============================================================================

export async function generateStaticParams() {
  const projectsData = await getProjects();
  const projects = transformProjectsList(projectsData as SanityProjectListItem[]);
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// =============================================================================
// VIDEO OBJECT SCHEMA
// =============================================================================

function generateVideoObjectSchema(project: {
  title: string;
  slug: string;
  client: string;
  category: string;
  videoUrl: string;
  thumbnail: string;
  year: string;
  challenge?: string;
}) {
  // Only generate schema if project has a video
  if (!project.videoUrl) return null;

  const description = project.challenge
    ? `${project.category} für ${project.client}: ${project.challenge}`
    : `${project.category} für ${project.client}`;

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: project.title,
    description: description.slice(0, 300),
    thumbnailUrl: project.thumbnail,
    uploadDate: `${project.year}-01-01`,
    contentUrl: project.videoUrl,
    embedUrl: project.videoUrl,
    publisher: {
      "@type": "Organization",
      name: "emmotion.ch",
      logo: {
        "@type": "ImageObject",
        url: "https://emmotion.ch/logo.png",
      },
    },
  };
}

// =============================================================================
// ASYNC CONTENT COMPONENT
// =============================================================================

interface ProjectContentProps {
  slug: string;
}

async function ProjectContent({ slug }: ProjectContentProps) {
  const [projectData, settings, projectsData] = await Promise.all([
    getProjectBySlug(slug),
    getSettings(),
    getProjects(),
  ]);

  const project = transformProjectDetail(projectData as SanityProject, slug);

  if (!project) {
    notFound();
  }

  const allProjects = transformProjectsList(projectsData as SanityProjectListItem[]);
  const relatedProjects = allProjects
    .filter((p) => p.categorySlug === project.categorySlug && p.slug !== project.slug)
    .slice(0, 3);

  const videoSchema = generateVideoObjectSchema(project);

  return (
    <>
      {videoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
      )}
      <ProjectPageContent
        project={project}
        relatedProjects={relatedProjects}
        settings={settings}
      />
    </>
  );
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

function ProjectSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Video Skeleton */}
      <div className="aspect-video bg-muted animate-pulse" />
      {/* Content Skeleton */}
      <div className="container py-12">
        <div className="h-10 w-96 bg-muted animate-pulse rounded mb-4" />
        <div className="h-6 w-48 bg-muted animate-pulse rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <ProjectContent slug={slug} />
    </Suspense>
  );
}
