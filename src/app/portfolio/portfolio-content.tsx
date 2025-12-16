"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container, VideoThumbnail } from "@/components/shared";

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

const categories = [
  { value: "all", label: "Alle" },
  { value: "imagefilm", label: "Imagefilme" },
  { value: "eventvideo", label: "Eventvideos" },
  { value: "produktvideo", label: "Produktvideos" },
  { value: "social-media", label: "Social Media" },
  { value: "drohnenaufnahmen", label: "Drohnenaufnahmen" },
];

const industries = [
  { value: "all", label: "Alle Branchen" },
  { value: "gastronomie", label: "Gastronomie" },
  { value: "industrie", label: "Industrie" },
  { value: "handwerk", label: "Handwerk" },
  { value: "dienstleistung", label: "Dienstleistung" },
  { value: "tourismus", label: "Tourismus" },
];

// Demo projects - will be replaced with Sanity data
const projects: Project[] = [
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
  {
    title: "Alpine Views",
    slug: "alpine-views",
    category: "drohnenaufnahmen",
    industry: "tourismus",
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    client: "Tourismus Rheintal",
    year: "2024",
  },
  {
    title: "Brand Story",
    slug: "brand-story",
    category: "social-media",
    industry: "handwerk",
    thumbnail:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    client: "Schreinerei Müller",
    year: "2023",
  },
  {
    title: "Interview Series",
    slug: "interview-series",
    category: "imagefilm",
    industry: "dienstleistung",
    thumbnail:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    client: "Consulting Partners",
    year: "2023",
  },
  {
    title: "Restaurant Ambiance",
    slug: "restaurant-ambiance",
    category: "imagefilm",
    industry: "gastronomie",
    thumbnail:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    client: "Restaurant Rheinblick",
    year: "2023",
  },
  {
    title: "Factory Tour",
    slug: "factory-tour",
    category: "imagefilm",
    industry: "industrie",
    thumbnail:
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    client: "Metallbau Rheintal",
    year: "2023",
  },
  {
    title: "Team Building Event",
    slug: "team-building-event",
    category: "eventvideo",
    industry: "dienstleistung",
    thumbnail:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    client: "Corporate Events AG",
    year: "2023",
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

export function PortfolioPageContent() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  const filteredProjects = projects.filter((project) => {
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
                Portfolio
              </h1>
              <p className="text-muted-foreground text-lg">
                Eine Auswahl meiner Videoprojekte – jedes Video erzählt eine
                einzigartige Geschichte. Von Imagefilmen über Eventvideos bis
                hin zu Social Media Content.
              </p>
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
                  Keine Projekte für diese Filter gefunden.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedIndustry("all");
                  }}
                  className="mt-4 text-primary hover:text-primary/80 transition-colors"
                >
                  Filter zurücksetzen
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
                Ihr Projekt könnte hier sein
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Ich freue mich darauf, Ihre Geschichte zu erzählen. Kontaktieren
                Sie mich für ein unverbindliches Erstgespräch.
              </p>
              <Link
                href="/#kontakt"
                className="inline-flex items-center gap-2 px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
              >
                Projekt anfragen
              </Link>
            </motion.div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
