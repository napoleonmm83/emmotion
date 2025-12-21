"use client";

import { motion } from "framer-motion";
import { Tv, Award, Users, MapPin, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container, AnimatedCounter } from "@/components/shared";
import { Card } from "@/components/ui/card";
import { getYearsOfExperience } from "@/lib/utils";

interface StatFromCMS {
  value: string;
  label: string;
}

interface Stat {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
}

// Icon mapping für Stats
const statIcons: LucideIcon[] = [Tv, Award, Users, MapPin];

function getDefaultStats(): Stat[] {
  return [
    { icon: Tv, value: getYearsOfExperience(), suffix: "+", label: "Jahre TV-Erfahrung" },
    { icon: Award, value: 100, suffix: "+", label: "Projekte umgesetzt" },
    { icon: Users, value: 50, suffix: "+", label: "Zufriedene Kunden" },
    { icon: MapPin, value: 3, suffix: "", label: "Regionen abgedeckt" },
  ];
}

// Parse CMS stats (z.B. "10+" -> { value: 10, suffix: "+" })
function parseStatValue(valueStr: string): { value: number; suffix: string } {
  const match = valueStr.match(/^(\d+)(.*)$/);
  if (match) {
    return { value: parseInt(match[1], 10), suffix: match[2] || "" };
  }
  // Fallback für nicht-numerische Werte wie "TV"
  return { value: 0, suffix: valueStr };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.5,
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

interface AboutSectionProps {
  data?: {
    name?: string;
    profileImage?: string;
    heroText?: string;
    description?: string;
    stats?: StatFromCMS[];
  } | null;
}

export function AboutSection({ data }: AboutSectionProps) {
  const name = data?.name || "Über mich";
  const profileImage = data?.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80";

  // Use custom description paragraphs if provided, otherwise use defaults
  const descriptionParagraphs = data?.description
    ? [data.description]
    : [
        "Mit über zehn Jahren Erfahrung in der TV-Branche bringe ich professionelle Produktionsstandards in jedes Projekt. Von der Konzeption bis zur finalen Postproduktion – bei mir bekommst du alles aus einer Hand.",
        "Meine Leidenschaft ist es, Geschichten visuell zu erzählen. Dabei verbinde ich technische Expertise mit kreativem Gespür, um Videos zu produzieren, die nicht nur professionell aussehen, sondern auch emotional berühren.",
        "Als gebürtiger Rheintaler kenne ich die Region und ihre Unternehmen bestens. Ob lokaler Handwerksbetrieb oder internationales Unternehmen in Liechtenstein – ich verstehe die individuellen Bedürfnisse und setze sie gekonnt um.",
      ];

  // Stats aus CMS oder Fallback
  const stats: Stat[] = data?.stats?.length
    ? data.stats.map((stat, index) => {
        const parsed = parseStatValue(stat.value);
        return {
          icon: statIcons[index % statIcons.length],
          value: parsed.value,
          suffix: parsed.suffix,
          label: stat.label,
        };
      })
    : getDefaultStats();

  return (
    <section id="ueber-mich" className="py-24 md:py-32 border-t border-border">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative order-2 lg:order-1"
          >
            <Card className="aspect-[4/5] relative">
              <Image
                src={profileImage}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </Card>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-xl gradient-primary opacity-20 blur-2xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-4xl md:text-5xl font-display text-foreground mb-6 tracking-wide">
              {name === "Über mich" ? name : `Über ${name.split(" ")[0]}`}
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm lg:text-base">
              {descriptionParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <Link
              href="/ueber-mich"
              className="inline-block mt-8 px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
              aria-label="Mehr erfahren über Marcus und emmotion.ch"
            >
              Mehr erfahren
            </Link>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mt-16 lg:mt-24"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <Card className="p-5 lg:p-6 text-center group hover:border-primary/30">
                <stat.icon className="w-7 h-7 lg:w-8 lg:h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform duration-400" />
                {stat.value > 0 ? (
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    className="text-2xl lg:text-3xl font-display text-foreground mb-1 block"
                  />
                ) : (
                  <span className="text-2xl lg:text-3xl font-display text-foreground mb-1 block">
                    {stat.suffix}
                  </span>
                )}
                <p className="text-xs lg:text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
