"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  Container,
  SectionHeader,
  VideoPlayer,
  VideoThumbnail,
} from "@/components/shared";

interface Project {
  title: string;
  slug: string;
  category: string;
  industry: string;
  thumbnail: string;
  videoUrl: string;
  client: string;
  year: string;
  challenge?: string;
  solution?: string;
  result?: string;
  testimonial?: {
    quote: string;
    name: string;
    role: string;
    company: string;
  };
}

interface ProjectPageContentProps {
  project: Project;
  relatedProjects: Project[];
  settings?: {
    siteName?: string;
    contact?: { email?: string; phone?: string; street?: string; city?: string };
    social?: { instagram?: string; linkedin?: string; youtube?: string };
    footer?: { tagline?: string; ctaText?: string; copyrightName?: string };
  } | null;
}

export function ProjectPageContent({
  project,
  relatedProjects,
  settings,
}: ProjectPageContentProps) {
  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Back Link */}
        <section className="py-6">
          <Container>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück zum Portfolio
            </Link>
          </Container>
        </section>

        {/* Hero Section */}
        <section className="pb-12">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl"
            >
              <p className="text-primary font-medium mb-4">{project.category}</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground mb-6 tracking-wide">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <span>Kunde: {project.client}</span>
                <span>·</span>
                <span>Branche: {project.industry}</span>
                <span>·</span>
                <span>{project.year}</span>
              </div>
            </motion.div>
          </Container>
        </section>

        {/* Video Player */}
        <section className="pb-16">
          <Container size="large">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <VideoPlayer
                src={project.videoUrl}
                poster={project.thumbnail}
                title={project.title}
                className="rounded-xl shadow-2xl"
                aspectRatio="video"
                showControls
              />
            </motion.div>
          </Container>
        </section>

        {/* Project Details */}
        {(project.challenge || project.solution || project.result) && (
          <section className="py-16 border-t border-border">
            <Container>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {project.challenge && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-xl font-display text-foreground mb-4 tracking-wide">
                      Herausforderung
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.challenge}
                    </p>
                  </motion.div>
                )}

                {project.solution && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <h2 className="text-xl font-display text-foreground mb-4 tracking-wide">
                      Lösung
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.solution}
                    </p>
                  </motion.div>
                )}

                {project.result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h2 className="text-xl font-display text-foreground mb-4 tracking-wide">
                      Ergebnis
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.result}
                    </p>
                  </motion.div>
                )}
              </div>
            </Container>
          </section>
        )}

        {/* Testimonial */}
        {project.testimonial && (
          <section className="py-16 border-t border-border">
            <Container>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="max-w-3xl mx-auto text-center"
              >
                <Quote className="w-12 h-12 text-primary mx-auto mb-6 opacity-50" />
                <blockquote className="text-xl md:text-2xl text-foreground leading-relaxed mb-8 italic">
                  &ldquo;{project.testimonial.quote}&rdquo;
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-foreground font-medium text-lg">
                      {project.testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-foreground font-medium">
                      {project.testimonial.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {project.testimonial.role}, {project.testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Container>
          </section>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="py-16 md:py-24 border-t border-border">
            <Container>
              <SectionHeader
                title="Ähnliche Projekte"
                subtitle="Weitere Arbeiten aus dieser Kategorie"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjects.map((relatedProject, index) => (
                  <motion.div
                    key={relatedProject.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link href={`/portfolio/${relatedProject.slug}`}>
                      <VideoThumbnail
                        src={relatedProject.thumbnail}
                        alt={relatedProject.title}
                        title={relatedProject.title}
                        category={relatedProject.category}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </Container>
          </section>
        )}

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
                Bereit für dein Projekt?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Ich freue mich darauf, deine Geschichte zu erzählen. Kontaktiere
                mich für ein unverbindliches Erstgespräch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
                >
                  Projekt anfragen
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-foreground font-medium rounded-lg border border-foreground/30 hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-400"
                >
                  Weitere Projekte
                </Link>
              </div>
            </motion.div>
          </Container>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
