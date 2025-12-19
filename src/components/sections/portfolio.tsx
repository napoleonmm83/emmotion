"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Film } from "lucide-react";
import Link from "next/link";
import { Container, SectionHeader, VideoThumbnail } from "@/components/shared";

interface Project {
  title: string;
  slug: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
}

interface PortfolioSectionProps {
  data?: Project[] | null;
}

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

export function PortfolioSection({ data }: PortfolioSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const hasProjects = data && data.length > 0;

  return (
    <section id="portfolio" className="py-24 md:py-32 border-t border-border">
      <Container>
        <SectionHeader
          title="Portfolio"
          subtitle="Eine Auswahl meiner Projekte – jedes Video erzählt eine einzigartige Geschichte."
        />

        {hasProjects ? (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {data.map((project, index) => (
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
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center py-16 md:py-24"
          >
            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <Film className="w-10 h-10 text-primary" />
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-display text-foreground mb-4">
                Coming Soon
              </h3>
              <p className="text-muted-foreground text-lg mb-8">
                Hier entsteht gerade etwas Grossartiges. Die ersten Projekte sind bereits in Arbeit – schau bald wieder vorbei!
              </p>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border text-foreground font-medium rounded-lg hover:border-primary/50 transition-all duration-300"
              >
                Projekt anfragen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
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
