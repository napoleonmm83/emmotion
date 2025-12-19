"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Film,
  Video,
  Camera,
  Plane,
  Clapperboard,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container, SectionHeader } from "@/components/shared";

const iconMap = {
  Film,
  Video,
  Camera,
  Plane,
  Clapperboard,
  Sparkles,
};

interface ServiceDetail {
  iconName: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  priceFrom: number;
  idealFor: string[];
  benefits: Array<{ title: string; description: string }>;
  process: Array<{ step: number; title: string; description: string }>;
  faq: Array<{ question: string; answer: string }>;
  exampleVideos: Array<{ title: string; youtubeUrl: string; description?: string }>;
  relatedProjects: string[];
}

function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

interface ServicePageContentProps {
  service: ServiceDetail;
  settings?: {
    siteName?: string;
    contact?: { email?: string; phone?: string; street?: string; city?: string };
    social?: { instagram?: string; linkedin?: string; youtube?: string };
    footer?: { tagline?: string; ctaText?: string; copyrightName?: string };
  } | null;
}

export function ServicePageContent({ service, settings }: ServicePageContentProps) {
  const Icon = iconMap[service.iconName as keyof typeof iconMap] || Film;

  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Back Link */}
        <section className="py-6">
          <Container>
            <Link
              href="/leistungen"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Alle Leistungen
            </Link>
          </Container>
        </section>

        {/* Hero Section */}
        <section className="pb-12">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-primary font-medium">
                    ab CHF {service.priceFrom.toLocaleString("de-CH")}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-display text-foreground mb-6 tracking-wide">
                  {service.title}
                </h1>

                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {service.idealFor.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm"
                    >
                      <Check className="w-3.5 h-3.5 text-primary" />
                      {item}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/#kontakt"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
                  >
                    Anfrage starten
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/konfigurator"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-foreground font-medium rounded-lg border border-foreground/30 hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-400"
                  >
                    Preis berechnen
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-video rounded-xl overflow-hidden card-surface">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-xl gradient-primary opacity-20 blur-2xl" />
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 border-t border-border">
          <Container>
            <SectionHeader
              title="Deine Vorteile"
              subtitle={`Was du bei einem ${service.title}-Projekt von mir erwarten kannst.`}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card-surface rounded-xl p-6 lg:p-8 group hover:border-primary/30 transition-colors duration-400"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 mt-1">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Example Videos Section */}
        {service.exampleVideos && service.exampleVideos.length > 0 && (
          <section className="py-16 md:py-24 border-t border-border">
            <Container>
              <SectionHeader
                title="Beispielvideos"
                subtitle="Schau dir an, was möglich ist."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.exampleVideos.map((video, index) => {
                  const videoId = getYouTubeId(video.youtubeUrl);
                  if (!videoId) return null;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="card-surface rounded-xl overflow-hidden"
                    >
                      <div className="aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-foreground">{video.title}</h3>
                        {video.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {video.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Container>
          </section>
        )}

        {/* Process Section */}
        <section className="py-16 md:py-24 border-t border-border">
          <Container>
            <SectionHeader
              title="So läuft's ab"
              subtitle="Mein bewährter Prozess für erfolgreiche Videoprojekte."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.process.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="card-surface rounded-xl p-6 h-full">
                    <div className="text-4xl font-display text-primary/20 mb-4">
                      {String(step.step).padStart(2, "0")}
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {index < service.process.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-border" />
                  )}
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* FAQ Section */}
        {service.faq.length > 0 && (
          <section className="py-16 md:py-24 border-t border-border">
            <Container>
              <SectionHeader
                title="Häufige Fragen"
                subtitle={`Antworten zu ${service.title}`}
              />

              <div className="max-w-3xl mx-auto space-y-4">
                {service.faq.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card-surface rounded-xl p-6"
                  >
                    <h3 className="text-lg font-medium text-foreground mb-3">
                      {item.question}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center mt-8"
              >
                <p className="text-muted-foreground mb-4">
                  Weitere Fragen? Ich bin für dich da.
                </p>
                <Link
                  href="/#kontakt"
                  className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2 transition-colors"
                >
                  Kontakt aufnehmen
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </Container>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 md:py-24 border-t border-border relative overflow-hidden">
          <div className="absolute inset-0 gradient-primary opacity-5" />

          <Container className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-display text-foreground mb-6 tracking-wide">
                Bereit für dein {service.title}-Projekt?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Kontaktiere mich, um dein Projekt zu besprechen. Ich freue mich
                auf ein unverbindliches Erstgespräch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/#kontakt"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
                >
                  Jetzt anfragen
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-foreground font-medium rounded-lg border border-foreground/30 hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-400"
                >
                  Referenzen ansehen
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
