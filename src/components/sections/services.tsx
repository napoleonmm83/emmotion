"use client";

import { motion } from "framer-motion";
import {
  Film,
  Video,
  Camera,
  Plane,
  Clapperboard,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Container, SectionHeader } from "@/components/shared";
import { Card } from "@/components/ui/card";

// Icon-Mapping von CMS-Namen zu Lucide-Icons
const iconMap: Record<string, LucideIcon> = {
  film: Film,
  video: Video,
  camera: Camera,
  plane: Plane,
  clapperboard: Clapperboard,
  sparkles: Sparkles,
  // Slug-basiertes Mapping als Fallback
  imagefilm: Film,
  eventvideo: Video,
  "social-media": Camera,
  drohnenaufnahmen: Plane,
  produktvideo: Clapperboard,
  postproduktion: Sparkles,
};

interface Service {
  icon: LucideIcon;
  title: string;
  slug: string;
  description: string;
  features: string[];
}

interface ServiceFromCMS {
  title: string;
  slug: string;
  shortDescription?: string;
  icon?: string;
  idealFor?: string[];
}

// Fallback-Services wenn keine CMS-Daten vorhanden
const fallbackServices: Service[] = [
  {
    icon: Film,
    title: "Imagefilme",
    slug: "imagefilm",
    description:
      "Professionelle Unternehmensvideos, die deine Marke authentisch und überzeugend präsentieren.",
    features: [
      "Storytelling-Konzept",
      "Professionelle Interviews",
      "Hochwertige Postproduktion",
    ],
  },
  {
    icon: Video,
    title: "Eventvideos",
    slug: "eventvideo",
    description:
      "Dynamische Dokumentation deiner Veranstaltungen – von Konferenzen bis zu Firmenfeiern.",
    features: ["Mehrkamera-Setup", "Live-Mitschnitte", "Highlight-Reels"],
  },
  {
    icon: Camera,
    title: "Social Media Content",
    slug: "social-media",
    description:
      "Kurze, wirkungsvolle Videos optimiert für Instagram, LinkedIn, TikTok und YouTube.",
    features: [
      "Vertikale & Horizontale Formate",
      "Motion Graphics",
      "Untertitelung",
    ],
  },
  {
    icon: Plane,
    title: "Drohnenaufnahmen",
    slug: "drohnenaufnahmen",
    description: "Spektakuläre Luftaufnahmen für einzigartige Perspektiven.",
    features: ["4K Aufnahmen", "Lizenzierte Piloten", "Professionelle Planung"],
  },
  {
    icon: Clapperboard,
    title: "Produktvideos",
    slug: "produktvideo",
    description: "Präsentiere deine Produkte im besten Licht.",
    features: [
      "360° Produktansichten",
      "Animations-Integration",
      "E-Commerce optimiert",
    ],
  },
  {
    icon: Sparkles,
    title: "Postproduktion",
    slug: "postproduktion",
    description:
      "Professionelle Nachbearbeitung deiner Videos auf höchstem Niveau.",
    features: ["Color Grading", "Motion Graphics", "Sound Design"],
  },
];

interface ServicesSectionProps {
  data?: ServiceFromCMS[] | null;
}

// CMS-Daten zu Service-Format konvertieren
function mapCMSToService(cmsService: ServiceFromCMS): Service {
  const iconKey = cmsService.icon?.toLowerCase() || cmsService.slug;
  return {
    icon: iconMap[iconKey] || Film,
    title: cmsService.title,
    slug: cmsService.slug,
    description: cmsService.shortDescription || "",
    features: cmsService.idealFor || [],
  };
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

export function ServicesSection({ data }: ServicesSectionProps) {
  // CMS-Daten oder Fallback verwenden
  const services = data && data.length > 0
    ? data.map(mapCMSToService)
    : fallbackServices;

  return (
    <section id="leistungen" className="py-24 md:py-32">
      <Container>
        <SectionHeader
          title="Leistungen"
          subtitle="Von der Konzeption bis zur finalen Produktion – professionelle
            Videoproduktion mit TV-Erfahrung für jeden Bedarf."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={itemVariants}>
              <Card className="p-6 lg:p-8 hover:border-primary/50 group flex flex-col h-full">
                <service.icon className="w-10 h-10 lg:w-12 lg:h-12 text-primary mb-5 group-hover:scale-110 transition-transform duration-400" />
                <h3 className="text-lg lg:text-xl font-medium text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-5 leading-relaxed flex-grow">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/leistungen/${service.slug}`}
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors group/link"
                >
                  Mehr erfahren
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA zur Leistungen-Übersicht */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/leistungen"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Alle Leistungen ansehen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
