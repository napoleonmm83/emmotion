"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container, VideoThumbnail } from "@/components/shared";
import { Tv, Film, Eye, Play } from "lucide-react";
import Image from "next/image";

interface Project {
  title: string;
  slug: string;
  category: string;
  industry: string;
  thumbnail: string;
  videoUrl: string;
  client: string;
  year: string;
}

interface FilterOption {
  value: string;
  label: string;
}

// Fallback Kategorien
const defaultCategories: FilterOption[] = [
  { value: "all", label: "Alle" },
  { value: "imagefilm", label: "Imagefilme" },
  { value: "eventvideo", label: "Eventvideos" },
  { value: "produktvideo", label: "Produktvideos" },
  { value: "social-media", label: "Social Media" },
  { value: "drohnenaufnahmen", label: "Drohnenaufnahmen" },
];

// Fallback Branchen
const defaultIndustries: FilterOption[] = [
  { value: "all", label: "Alle Branchen" },
  { value: "gastronomie", label: "Gastronomie" },
  { value: "industrie", label: "Industrie" },
  { value: "handwerk", label: "Handwerk" },
  { value: "dienstleistung", label: "Dienstleistung" },
  { value: "tourismus", label: "Tourismus" },
];

// Fallback Hero
const defaultHero = {
  title: "Portfolio",
  subtitle:
    "Eine Auswahl meiner Videoprojekte – jedes Video erzählt eine einzigartige Geschichte. Von Imagefilmen über Eventvideos bis hin zu Social Media Content.",
};

// Fallback CTA
const defaultCta = {
  title: "Ihr Projekt könnte hier sein",
  description:
    "Ich freue mich darauf, Ihre Geschichte zu erzählen. Kontaktieren Sie mich für ein unverbindliches Erstgespräch.",
  buttonText: "Projekt anfragen",
};

// Fallback Empty State
const defaultEmptyState = {
  message: "Keine Projekte für diese Filter gefunden.",
  resetText: "Filter zurücksetzen",
};

// Fallback Demo-Projekte wenn keine CMS-Daten vorhanden
const fallbackProjects: Project[] = [
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
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

interface TVPreview {
  thumbnail: string | null;
  totalVideos: number;
  totalViews: number;
}

interface PortfolioPageContentProps {
  projects?: Project[] | null;
  pageData?: {
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
  } | null;
  settings?: {
    siteName?: string;
    contact?: {
      email?: string;
      phone?: string;
      street?: string;
      city?: string;
      uid?: string;
      region?: string;
    };
    social?: {
      linkedin?: string;
      instagram?: string;
      youtube?: string;
    };
    footer?: {
      tagline?: string;
      ctaText?: string;
      copyrightName?: string;
    };
  } | null;
  tvPreview?: TVPreview | null;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return Math.round(num / 1000) + "K";
  }
  return num.toLocaleString("de-CH");
}

export function PortfolioPageContent({
  projects,
  pageData,
  settings,
  tvPreview,
}: PortfolioPageContentProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  // CMS-Daten oder Fallback verwenden
  const projectList =
    projects && projects.length > 0 ? projects : fallbackProjects;

  // Filter-Optionen aus CMS oder Fallback
  const categories: FilterOption[] =
    pageData?.categories && pageData.categories.length > 0
      ? [
          { value: "all", label: "Alle" },
          ...pageData.categories.map((c) => ({
            value: c.value || "",
            label: c.label || "",
          })),
        ]
      : defaultCategories;

  const industries: FilterOption[] =
    pageData?.industries && pageData.industries.length > 0
      ? [
          { value: "all", label: "Alle Branchen" },
          ...pageData.industries.map((i) => ({
            value: i.value || "",
            label: i.label || "",
          })),
        ]
      : defaultIndustries;

  // Hero-Texte
  const hero = {
    title: pageData?.hero?.title || defaultHero.title,
    subtitle: pageData?.hero?.subtitle || defaultHero.subtitle,
  };

  // CTA-Texte
  const cta = {
    title: pageData?.cta?.title || defaultCta.title,
    description: pageData?.cta?.description || defaultCta.description,
    buttonText: pageData?.cta?.buttonText || defaultCta.buttonText,
  };

  // Empty State-Texte
  const emptyState = {
    message: pageData?.emptyState?.message || defaultEmptyState.message,
    resetText: pageData?.emptyState?.resetText || defaultEmptyState.resetText,
  };

  const filteredProjects = projectList.filter((project) => {
    const categoryMatch =
      selectedCategory === "all" || project.category === selectedCategory;
    const industryMatch =
      selectedIndustry === "all" || project.industry === selectedIndustry;
    return categoryMatch && industryMatch;
  });

  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground mb-6 tracking-wide">
                {hero.title}
              </h1>
              <p className="text-muted-foreground text-lg">{hero.subtitle}</p>
            </motion.div>
          </Container>
        </section>

        {/* Filters */}
        <section className="pb-8">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col md:flex-row gap-6 justify-center items-center"
            >
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category.value
                        ? "gradient-primary text-foreground glow-primary"
                        : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
                {/* TV Produktionen Link */}
                <Link
                  href="/tv-produktionen"
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground inline-flex items-center gap-1.5"
                >
                  <Tv className="w-3.5 h-3.5" />
                  TV Produktionen
                </Link>
              </div>

              {/* Industry Filter */}
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-4 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
              >
                {industries.map((industry) => (
                  <option key={industry.value} value={industry.value}>
                    {industry.label}
                  </option>
                ))}
              </select>
            </motion.div>
          </Container>
        </section>

        {/* Projects Grid */}
        <section className="py-12 md:py-16">
          <Container>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCategory}-${selectedIndustry}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* TV Produktionen Card - nur bei "Alle" anzeigen */}
                {selectedCategory === "all" && selectedIndustry === "all" && tvPreview && (
                  <motion.div variants={itemVariants}>
                    <Link href="/tv-produktionen" className="group block">
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                        {tvPreview.thumbnail ? (
                          <Image
                            src={tvPreview.thumbnail}
                            alt="TV Produktionen"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Tv className="w-16 h-16 text-primary/50" />
                          </div>
                        )}
                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 text-xs font-medium bg-black/60 backdrop-blur-sm text-white rounded">
                            TV Rheintal
                          </span>
                        </div>
                        {/* Play Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white ml-1" fill="white" />
                          </div>
                        </div>
                      </div>
                      {/* Text below */}
                      <div className="mt-3 px-1">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          TV Produktionen
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Film className="w-3.5 h-3.5" />
                            {tvPreview.totalVideos} Videos
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {formatNumber(tvPreview.totalViews)} Views
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}

                {filteredProjects.map((project, index) => (
                  <motion.div key={project.slug} variants={itemVariants}>
                    <Link href={`/portfolio/${project.slug}`}>
                      <VideoThumbnail
                        src={project.thumbnail}
                        alt={project.title}
                        title={project.title}
                        category={project.category
                          .replace("-", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                        priority={index < 6}
                      />
                    </Link>
                    <div className="mt-3 px-1">
                      <p className="text-sm text-muted-foreground">
                        {project.client} · {project.year}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-muted-foreground text-lg">
                  {emptyState.message}
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedIndustry("all");
                  }}
                  className="mt-4 text-primary hover:text-primary/80 transition-colors"
                >
                  {emptyState.resetText}
                </button>
              </motion.div>
            )}
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 border-t border-border">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-display text-foreground mb-6 tracking-wide">
                {cta.title}
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                {cta.description}
              </p>
              <Link
                href="/#kontakt"
                className="inline-flex items-center gap-2 px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
              >
                {cta.buttonText}
              </Link>
            </motion.div>
          </Container>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
