"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Tv,
  Users,
  MapPin,
  Award,
  Camera,
  Heart,
  Star,
  ArrowRight,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/shared";
import { Card } from "@/components/ui/card";
import { urlFor } from "@sanity/lib/image";
import { PortableText } from "@sanity/lib/portable-text";
import type { PortableTextBlock } from "@portabletext/types";
import { getYearsOfExperience } from "@/lib/utils";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Tv,
  Users,
  MapPin,
  Award,
  Camera,
  Heart,
  Star,
  CheckCircle,
};

// Fallback data
function getFallbackStats() {
  return [
    { value: `${getYearsOfExperience()}+`, label: "Jahre Erfahrung" },
    { value: "100+", label: "Projekte" },
    { value: "TV", label: "Qualitätsstandard" },
    { value: "100%", label: "Persönlich" },
  ];
}

const FALLBACK_VALUES = [
  {
    icon: "Tv",
    title: "TV-Erfahrung",
    description:
      "Jahre im Regionalfernsehen haben mich gelehrt, Geschichten packend zu erzählen und auch unter Zeitdruck höchste Qualität zu liefern.",
  },
  {
    icon: "Users",
    title: "Persönlich statt Agentur",
    description:
      "Bei mir arbeitest du direkt mit dem Produzenten. Keine Umwege, keine Missverständnisse – persönliche Betreuung von A bis Z.",
  },
  {
    icon: "MapPin",
    title: "Regional verwurzelt",
    description:
      "Im Rheintal aufgewachsen, kenne ich die Region und ihre Menschen. Das schafft Vertrauen und authentische Ergebnisse.",
  },
  {
    icon: "Heart",
    title: "Mit Leidenschaft",
    description:
      "Video ist nicht nur mein Beruf, sondern meine Leidenschaft. Diese Begeisterung fliesst in jedes Projekt ein.",
  },
];

const FALLBACK_TIMELINE = [
  {
    year: "Heute",
    title: "emmotion.ch",
    description:
      "Selbstständiger Videograf für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz.",
  },
  {
    year: "Vorher",
    title: "Regionalfernsehen",
    description:
      "Kameramann und Editor beim Regionalfernsehen. Täglich Beiträge produziert, live gesendet, Geschichten erzählt.",
  },
  {
    year: "Anfänge",
    title: "Die Leidenschaft entdeckt",
    description:
      "Schon früh die Kamera in der Hand. Was als Hobby begann, wurde zur Berufung.",
  },
];

const FALLBACK_WHY_WORK = {
  title: "Warum mit mir arbeiten?",
  description:
    "Bei einer grossen Agentur bist du einer von vielen. Bei mir bist du mein Fokus. Ich nehme mir Zeit für dein Projekt und liefere Qualität, die überzeugt.",
  points: [
    "Direkte Kommunikation ohne Umwege",
    "Fixpreise statt böser Überraschungen",
    "Schnelle Reaktionszeiten",
    "Lokale Präsenz – persönliche Treffen möglich",
    "TV-Qualität zu fairen Preisen",
  ],
};

interface ImageWithMetadata {
  asset?: {
    _id?: string;
    _ref?: string;
    url?: string;
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
      };
    };
  };
  hotspot?: {
    x: number;
    y: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

interface AboutData {
  name?: string;
  subtitle?: string;
  profileImage?: ImageWithMetadata;
  heroText?: string;
  description?: PortableTextBlock[];
  stats?: Array<{ value: string; label: string }>;
  values?: Array<{ icon: string; title: string; description: string }>;
  timeline?: Array<{ year: string; title: string; description: string }>;
  whyWorkWithMe?: {
    title?: string;
    description?: string;
    points?: string[];
    image?: ImageWithMetadata;
  };
}

interface UeberMichContentProps {
  data?: AboutData | null;
  settings?: {
    siteName?: string;
    contact?: {
      email?: string;
      phone?: string;
      street?: string;
      city?: string;
    };
    social?: {
      instagram?: string;
      linkedin?: string;
      youtube?: string;
    };
    footer?: {
      tagline?: string;
      ctaText?: string;
      copyrightName?: string;
    };
  } | null;
}

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

export function UeberMichContent({ data, settings }: UeberMichContentProps) {
  // Use Sanity data or fallbacks
  const name = data?.name || "Marcus Martini";
  const subtitle = data?.subtitle || "Videograf mit TV-Erfahrung";
  const heroText =
    data?.heroText ||
    "Videograf mit TV-Erfahrung, spezialisiert auf authentische Unternehmensvideos. Ich bringe Ihre Geschichte auf den Punkt – professionell, persönlich und mit Leidenschaft.";
  const stats = data?.stats?.length ? data.stats : getFallbackStats();
  const values = data?.values?.length ? data.values : FALLBACK_VALUES;
  const timeline = data?.timeline?.length ? data.timeline : FALLBACK_TIMELINE;
  const whyWork = data?.whyWorkWithMe || FALLBACK_WHY_WORK;

  const profileImageUrl = data?.profileImage?.asset
    ? urlFor(data.profileImage).width(800).height(1000).url()
    : "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=800&q=80";

  // Get image dimensions for dynamic aspect ratio
  const whyWorkImageDimensions = data?.whyWorkWithMe?.image?.asset?.metadata?.dimensions;
  const isWhyWorkImagePortrait = whyWorkImageDimensions
    ? whyWorkImageDimensions.aspectRatio < 1
    : false;

  const whyWorkImageUrl = data?.whyWorkWithMe?.image?.asset
    ? urlFor(data.whyWorkWithMe.image)
        .width(isWhyWorkImagePortrait ? 800 : 1200)
        .height(isWhyWorkImagePortrait ? 1200 : 800)
        .url()
    : "https://images.unsplash.com/photo-1579965342575-16428a7c8881?auto=format&fit=crop&w=1200&q=80";

  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <p className="text-primary font-medium mb-4">Über mich</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground mb-6 tracking-wide">
                  {name}
                </h1>
                <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                  {heroText}
                </p>
                {data?.description ? (
                  <div className="text-muted-foreground leading-relaxed mb-8">
                    <PortableText value={data.description} />
                  </div>
                ) : (
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    Nach Jahren beim Regionalfernsehen weiss ich, wie man
                    Geschichten erzählt, die berühren. Diese Erfahrung bringe ich
                    jetzt für Unternehmen im Rheintal, Liechtenstein und der
                    Ostschweiz ein. Bei mir bekommst du keine anonyme Agentur,
                    sondern einen persönlichen Partner für dein Videoprojekt.
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/kontakt"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
                  >
                    Kontakt aufnehmen
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/portfolio"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-foreground font-medium rounded-lg border border-foreground/30 hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-400"
                  >
                    Portfolio ansehen
                  </Link>
                </div>
              </motion.div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <Image
                    src={profileImageUrl}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                </div>
                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="absolute -bottom-6 -left-6 bg-primary text-foreground px-6 py-4 rounded-xl shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <Camera className="w-8 h-8" />
                    <div>
                      <p className="font-bold text-lg">{subtitle}</p>
                      <p className="text-sm opacity-90">Regionalfernsehen</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y border-border">
          <Container>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="text-center"
                >
                  <p className="text-4xl md:text-5xl font-display text-primary mb-2">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4 tracking-wide">
                Was mich auszeichnet
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Diese Werte prägen meine Arbeit und machen den Unterschied für
                Ihr Projekt.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {values.map((value) => {
                const IconComponent = iconMap[value.icon] || Heart;
                return (
                  <motion.div key={value.title} variants={itemVariants}>
                    <Card className="p-6 md:p-8 h-full">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            {value.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </Container>
        </section>

        {/* Timeline Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <Container size="small">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4 tracking-wide">
                Mein Weg
              </h2>
              <p className="text-muted-foreground text-lg">
                Von der Leidenschaft zum Beruf.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  variants={itemVariants}
                  className="flex gap-6"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <span className="text-primary font-medium text-sm">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-semibold text-foreground mt-1 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </section>

        {/* Why Work With Me Section */}
        <section className="py-16 md:py-24">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-3xl md:text-4xl font-display text-foreground mb-6 tracking-wide">
                  {whyWork.title || "Warum mit mir arbeiten?"}
                </h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  {whyWork.description}
                </p>
                <ul className="space-y-4">
                  {(whyWork.points || FALLBACK_WHY_WORK.points).map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative"
              >
                <div
                  className={`relative rounded-xl overflow-hidden ${
                    isWhyWorkImagePortrait ? "aspect-[3/4]" : "aspect-video"
                  }`}
                >
                  <Image
                    src={whyWorkImageUrl}
                    alt="Videoproduktion im Einsatz"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </motion.div>
            </div>
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
                Lern mich kennen
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Hast du ein Videoprojekt im Kopf? Ich freue mich auf ein
                unverbindliches Gespräch, um deine Ideen zu besprechen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
                >
                  Kontakt aufnehmen
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
          </Container>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
