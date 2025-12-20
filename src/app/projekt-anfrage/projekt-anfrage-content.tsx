"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Film,
  Video,
  Camera,
  Plane,
  Clapperboard,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  PenLine,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container, SectionHeader } from "@/components/shared";
import { Card } from "@/components/ui/card";

// Icon mapping for dynamic icons from Sanity
const iconMap: Record<string, LucideIcon> = {
  Film,
  Video,
  Camera,
  Plane,
  Clapperboard,
  Sparkles,
};

interface ServiceFromSanity {
  title: string;
  slug: string;
  shortDescription: string;
  icon: string;
  priceFrom: number;
  image: string | null;
}

// Default services if Sanity has no data
const defaultServices: ServiceFromSanity[] = [
  {
    title: "Imagefilm",
    slug: "imagefilm",
    shortDescription: "Professionelle Unternehmensvideos für Website, Social Media und Recruiting.",
    icon: "Film",
    priceFrom: 2400,
    image: null,
  },
  {
    title: "Eventvideo",
    slug: "eventvideo",
    shortDescription: "Dynamische Dokumentation deiner Veranstaltungen und Events.",
    icon: "Video",
    priceFrom: 1800,
    image: null,
  },
  {
    title: "Social Media Content",
    slug: "social-media",
    shortDescription: "Kurze, wirkungsvolle Videos für Instagram, LinkedIn und TikTok.",
    icon: "Camera",
    priceFrom: 600,
    image: null,
  },
  {
    title: "Drohnenaufnahmen",
    slug: "drohnenaufnahmen",
    shortDescription: "Spektakuläre Luftaufnahmen für einzigartige Perspektiven.",
    icon: "Plane",
    priceFrom: 400,
    image: null,
  },
  {
    title: "Produktvideo",
    slug: "produktvideo",
    shortDescription: "Präsentiere deine Produkte im besten Licht.",
    icon: "Clapperboard",
    priceFrom: 800,
    image: null,
  },
  {
    title: "Postproduktion",
    slug: "postproduktion",
    shortDescription: "Professionelle Nachbearbeitung: Schnitt, Color Grading, Motion Graphics.",
    icon: "Sparkles",
    priceFrom: 500,
    image: null,
  },
];

const processSteps = [
  {
    icon: CheckCircle2,
    title: "Service wählen",
    description: "Wähle die passende Leistung für dein Projekt.",
  },
  {
    icon: FileText,
    title: "Details angeben",
    description: "Beantworte einige Fragen zu deinem Projekt.",
  },
  {
    icon: PenLine,
    title: "Vertrag unterzeichnen",
    description: "Prüfe und unterschreibe den Vertrag digital.",
  },
];

interface ProjektAnfrageContentProps {
  services: ServiceFromSanity[] | null;
  settings?: {
    siteName?: string;
    contact?: { email?: string; phone?: string; street?: string; city?: string };
    social?: { instagram?: string; linkedin?: string; youtube?: string };
    footer?: { tagline?: string; ctaText?: string; copyrightName?: string };
  } | null;
}

export function ProjektAnfrageContent({ services: sanityServices, settings }: ProjektAnfrageContentProps) {
  const services = sanityServices && sanityServices.length > 0 ? sanityServices : defaultServices;

  // Track page view
  useEffect(() => {
    track("projekt_anfrage_view", {
      servicesCount: services.length,
    });
  }, [services.length]);

  // Track service selection
  const handleServiceClick = (serviceSlug: string, serviceTitle: string) => {
    track("service_selected", {
      service: serviceSlug,
      serviceTitle: serviceTitle,
    });
  };

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
                Projekt anfragen
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Starte dein Videoprojekt in wenigen Schritten. Wähle die passende
                Leistung, beantworte einige Fragen und erhalte direkt einen
                massgeschneiderten Vertrag.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Process Steps */}
        <section className="pb-12">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {processSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="flex items-start gap-4 p-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-primary font-medium mb-1">
                      Schritt {index + 1}
                    </div>
                    <h3 className="font-medium text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </Container>
        </section>

        {/* Service Selection */}
        <section className="py-16 md:py-24 border-t border-border">
          <Container>
            <SectionHeader
              title="Welche Leistung benötigst du?"
              subtitle="Wähle einen Service, um mit dem Onboarding zu starten."
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {services.map((service, index) => {
                const Icon = iconMap[service.icon] || Film;

                return (
                  <motion.div
                    key={service.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <Link
                      href={`/projekt-anfrage/${service.slug}`}
                      className="block h-full"
                      onClick={() => handleServiceClick(service.slug, service.title)}
                    >
                      <Card className="h-full group hover:border-primary/50 transition-all duration-300">
                        {/* Image or Gradient */}
                        <div className="relative h-40 bg-gradient-to-br from-primary/20 to-secondary/20">
                          {service.image && (
                            <Image
                              src={service.image}
                              alt={service.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                          <div className="absolute bottom-4 left-4">
                            <div className="p-2 rounded-lg bg-background/80 backdrop-blur-sm">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                              {service.title}
                            </h3>
                            <span className="text-sm text-primary font-medium whitespace-nowrap ml-2">
                              ab CHF {service.priceFrom.toLocaleString("de-CH")}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            {service.shortDescription}
                          </p>
                          <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                            Jetzt starten
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </Container>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 border-t border-border">
          <Container>
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4 tracking-wide">
                  Warum das Projekt-Onboarding?
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Transparent",
                    description: "Du weisst von Anfang an, was dich erwartet – keine versteckten Kosten.",
                  },
                  {
                    title: "Verbindlich",
                    description: "Mit dem digitalen Vertrag sind beide Seiten abgesichert.",
                  },
                  {
                    title: "Schnell",
                    description: "In wenigen Minuten zum fertigen Auftrag – ohne Papierkram.",
                  },
                  {
                    title: "Persönlich",
                    description: "Deine individuellen Anforderungen fliessen direkt in den Vertrag ein.",
                  },
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Alternative CTA */}
        <section className="py-16 md:py-24 border-t border-border">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl font-display text-foreground mb-4 tracking-wide">
                Noch unsicher?
              </h2>
              <p className="text-muted-foreground mb-8">
                Kein Problem! Nutze den Konfigurator für eine unverbindliche Preisschätzung
                oder kontaktiere mich direkt für ein persönliches Gespräch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/konfigurator"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-foreground font-medium rounded-lg border border-foreground/30 hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-300"
                >
                  Preis berechnen
                </Link>
                <Link
                  href="/#kontakt"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-foreground font-medium rounded-lg border border-foreground/30 hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-300"
                >
                  Kontakt aufnehmen
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
