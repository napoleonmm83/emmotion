"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import {
  Film,
  Video,
  Camera,
  Plane,
  Clapperboard,
  Sparkles,
  ArrowRight,
  Check,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container, ImageWithFallback } from "@/components/shared";
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
  idealFor: string[];
}

interface Service {
  icon: LucideIcon;
  title: string;
  slug: string;
  shortDescription: string;
  image: string;
  priceFrom: number;
  idealFor: string[];
}

// Default fallback services (used when Sanity has no data)
const defaultServices: Service[] = [
  {
    icon: Film,
    title: "Imagefilme",
    slug: "imagefilm",
    shortDescription:
      "Professionelle Unternehmensvideos, die Ihre Marke authentisch und überzeugend präsentieren. Perfekt für Website, Social Media und Recruiting.",
    image:
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
    priceFrom: 2400,
    idealFor: ["Unternehmenspräsentation", "Recruiting", "Website"],
  },
  {
    icon: Video,
    title: "Eventvideos",
    slug: "eventvideo",
    shortDescription:
      "Dynamische Dokumentation deiner Veranstaltungen – von Konferenzen über Firmenfeiern bis zu Produktlaunches.",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
    priceFrom: 1800,
    idealFor: ["Konferenzen", "Firmenfeiern", "Messen"],
  },
  {
    icon: Camera,
    title: "Social Media Content",
    slug: "social-media",
    shortDescription:
      "Kurze, wirkungsvolle Videos optimiert für Instagram, LinkedIn, TikTok und YouTube. Perfekt für regelmässigen Content.",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
    priceFrom: 600,
    idealFor: ["Instagram Reels", "LinkedIn", "TikTok", "YouTube Shorts"],
  },
  {
    icon: Plane,
    title: "Drohnenaufnahmen",
    slug: "drohnenaufnahmen",
    shortDescription:
      "Spektakuläre Luftaufnahmen für einzigartige Perspektiven. Ideal für Immobilien, Tourismus und Imagefilme.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    priceFrom: 400,
    idealFor: ["Immobilien", "Tourismus", "Architektur"],
  },
  {
    icon: Clapperboard,
    title: "Produktvideos",
    slug: "produktvideo",
    shortDescription:
      "Präsentiere deine Produkte im besten Licht. Von einfachen Produktaufnahmen bis zu aufwendigen Spots.",
    image:
      "https://images.unsplash.com/photo-1551817958-c5b51e7b4a33?auto=format&fit=crop&w=800&q=80",
    priceFrom: 800,
    idealFor: ["E-Commerce", "Amazon", "Produktpräsentation"],
  },
  {
    icon: Sparkles,
    title: "Postproduktion",
    slug: "postproduktion",
    shortDescription:
      "Professionelle Nachbearbeitung deiner Videos auf höchstem Niveau. Color Grading, Motion Graphics und Sound Design.",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    priceFrom: 500,
    idealFor: ["Color Grading", "Motion Graphics", "Sound Design"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

interface LeistungenPageContentProps {
  services: ServiceFromSanity[] | null;
  settings?: {
    siteName?: string;
    contact?: { email?: string; phone?: string; street?: string; city?: string };
    social?: { instagram?: string; linkedin?: string; youtube?: string };
    footer?: { tagline?: string; ctaText?: string; copyrightName?: string };
  } | null;
}

export function LeistungenPageContent({ services: sanityServices, settings }: LeistungenPageContentProps) {
  // Convert Sanity services to component format or use defaults
  const services: Service[] = sanityServices
    ? sanityServices.map((s) => ({
        icon: iconMap[s.icon] || Film,
        title: s.title,
        slug: s.slug,
        shortDescription: s.shortDescription,
        image: s.image || "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
        priceFrom: s.priceFrom,
        idealFor: s.idealFor,
      }))
    : defaultServices;

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
                Leistungen
              </h1>
              <p className="text-muted-foreground text-lg">
                Von der Konzeption bis zur finalen Produktion – professionelle
                Videoproduktion mit TV-Erfahrung für jeden Bedarf. Alle
                Leistungen aus einer Hand.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Services List */}
        <section className="pb-24">
          <Container>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {services.map((service, index) => (
                <motion.div key={service.slug} variants={itemVariants}>
                  <Link href={`/leistungen/${service.slug}`} aria-label={`Mehr erfahren über ${service.title}`}>
                    <Card
                      className={`group hover:border-primary/50 transition-colors duration-400 ${
                        index % 2 === 0 ? "" : "md:flex-row-reverse"
                      } md:flex`}
                    >
                      {/* Image */}
                      <div className="relative w-full md:w-2/5 aspect-video md:aspect-auto overflow-hidden">
                        <ImageWithFallback
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 40vw"
                          fallbackClassName="absolute inset-0 h-full min-h-[200px]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-background/20" />
                      </div>

                      {/* Content */}
                      <div className="p-6 md:p-8 lg:p-10 md:w-3/5 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <service.icon className="w-6 h-6 text-primary" />
                          </div>
                          <span className="text-primary text-sm font-medium">
                            ab CHF {service.priceFrom.toLocaleString("de-CH")}
                          </span>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-display text-foreground mb-4 tracking-wide group-hover:text-primary transition-colors">
                          {service.title}
                        </h2>

                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {service.shortDescription}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {service.idealFor.map((item) => (
                            <span
                              key={item}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm"
                            >
                              <Check className="w-3.5 h-3.5 text-primary" />
                              {item}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                          Mehr erfahren
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
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
                Nicht sicher, was du brauchst?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Nutze meinen Video-Konfigurator für eine unverbindliche
                Preisschätzung oder kontaktiere mich direkt.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/konfigurator"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
                >
                  Preis berechnen
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-foreground font-medium rounded-lg border border-foreground/30 hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-400"
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
