"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container, SectionHeader, VideoThumbnail } from "@/components/shared";

interface Project {
  title: string;
  slug: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
}

const projects: Project[] = [
  {
    title: "Corporate Vision",
    slug: "corporate-vision",
    category: "Imagefilm",
    thumbnail:
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    title: "Summit 2024",
    slug: "summit-2024",
    category: "Eventdokumentation",
    thumbnail:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    title: "Product Launch",
    slug: "product-launch",
    category: "Produktvideo",
    thumbnail:
      "https://images.unsplash.com/photo-1551817958-c5b51e7b4a33?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    title: "Alpine Views",
    slug: "alpine-views",
    category: "Drohnenaufnahmen",
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
  {
    title: "Brand Story",
    slug: "brand-story",
    category: "Social Media",
    thumbnail:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  },
  {
    title: "Interview Series",
    slug: "interview-series",
    category: "Imagefilm",
    thumbnail:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  },
];

function VideoLightbox({
  isOpen,
  onClose,
  videoUrl,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <button
          className="absolute top-6 right-6 p-3 rounded-full bg-foreground/10 text-foreground hover:bg-foreground/20 transition-colors"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-6xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-center text-foreground/60 mt-4 text-sm">{title}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

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

export function PortfolioSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="portfolio" className="py-24 md:py-32 border-t border-border">
      <Container>
        <SectionHeader
          title="Portfolio"
          subtitle="Eine Auswahl meiner Projekte – jedes Video erzählt eine einzigartige Geschichte."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, index) => (
            <motion.div key={project.slug} variants={itemVariants}>
              <VideoThumbnail
                src={project.thumbnail}
                alt={project.title}
                title={project.title}
                category={project.category}
                onClick={() => setSelectedProject(project)}
                priority={index < 3}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
          >
            Alle Projekte ansehen
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </Container>

      <VideoLightbox
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        videoUrl={selectedProject?.videoUrl || ""}
        title={selectedProject?.title || ""}
      />
    </section>
  );
}
