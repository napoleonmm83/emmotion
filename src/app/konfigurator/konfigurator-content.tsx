"use client";

import { motion } from "framer-motion";
import {
  Calculator,
  Clock,
  CheckCircle,
  Star,
  Heart,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/shared";
import { Konfigurator } from "@/components/konfigurator";

// Icon-Mapping für CMS
const iconMap: Record<string, LucideIcon> = {
  calculator: Calculator,
  clock: Clock,
  check: CheckCircle,
  star: Star,
  heart: Heart,
  shield: Shield,
};

// Fallback-Daten
const defaultHero = {
  title: "Video-Konfigurator",
  subtitle:
    "Konfigurieren Sie Ihr Wunschvideo und erhalten Sie eine unverbindliche Preisschätzung – in nur wenigen Schritten.",
};

const defaultBenefits = [
  {
    icon: "calculator",
    title: "Transparente Preise",
    description: "Erhalten Sie sofort eine realistische Preisschätzung",
  },
  {
    icon: "clock",
    title: "In 2 Minuten",
    description: "Schnell und unkompliziert konfigurieren",
  },
  {
    icon: "check",
    title: "Unverbindlich",
    description: "Keine Verpflichtung, einfach informieren",
  },
];

const defaultInfoSection = {
  title: "Wie funktioniert der Konfigurator?",
  description:
    "Der Konfigurator gibt Ihnen eine erste Orientierung zum Budget. Der finale Preis wird individuell nach einem persönlichen Gespräch festgelegt – basierend auf Ihren genauen Anforderungen.",
};

const defaultSteps = [
  {
    title: "Konfigurieren",
    description: "Wählen Sie Video-Typ, Länge, Umfang und gewünschte Extras.",
  },
  {
    title: "Preisschätzung erhalten",
    description:
      "Sie sehen sofort eine realistische Preisspanne für Ihr Projekt.",
  },
  {
    title: "Unverbindlich anfragen",
    description:
      "Bei Interesse senden Sie eine Anfrage – ich melde mich innerhalb von 24h.",
  },
];

interface KonfiguratorPageContentProps {
  data?: {
    hero?: {
      title?: string;
      subtitle?: string;
    };
    benefits?: Array<{
      icon?: string;
      title?: string;
      description?: string;
    }>;
    infoSection?: {
      title?: string;
      description?: string;
    };
    steps?: Array<{
      title?: string;
      description?: string;
    }>;
  } | null;
}

export function KonfiguratorPageContent({ data }: KonfiguratorPageContentProps) {
  // CMS-Daten oder Fallback verwenden
  const hero = {
    title: data?.hero?.title || defaultHero.title,
    subtitle: data?.hero?.subtitle || defaultHero.subtitle,
  };

  const benefits =
    data?.benefits && data.benefits.length > 0 ? data.benefits : defaultBenefits;

  const infoSection = {
    title: data?.infoSection?.title || defaultInfoSection.title,
    description: data?.infoSection?.description || defaultInfoSection.description,
  };

  const steps =
    data?.steps && data.steps.length > 0 ? data.steps : defaultSteps;
  // Titel aufteilen für Highlight-Effekt
  const titleParts = hero.title.split("-");
  const titleMain = titleParts[0] || "Video";
  const titleHighlight = titleParts.length > 1 ? titleParts[1] : "Konfigurator";

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
              {titleMain}
              {titleParts.length > 1 && "-"}
              <span className="text-primary">{titleHighlight}</span>
            </h1>
            <p className="text-lg text-muted-foreground">{hero.subtitle}</p>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {benefits.map((benefit, index) => {
              const IconComponent = iconMap[benefit.icon || "calculator"] || Calculator;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/50"
                >
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm">
                      {benefit.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </Container>
      </section>

      {/* Konfigurator */}
      <section className="pb-24 md:pb-32">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Konfigurator />
          </motion.div>
        </Container>
      </section>

      {/* Info Section */}
      <section className="py-16 md:py-24 border-t border-border bg-muted/30">
        <Container size="small">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {infoSection.title}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {infoSection.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {steps.map((step, index) => (
                <div key={index}>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mb-3">
                    {index + 1}
                  </div>
                  <h3 className="font-medium text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
