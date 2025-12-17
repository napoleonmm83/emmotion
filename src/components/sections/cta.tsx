"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Container } from "@/components/shared";

// Fallback CTA-Texte
const defaultTexts = {
  konfigurator: {
    title: "Was kostet Ihr Video?",
    description: "Nutzen Sie meinen Video-Konfigurator für eine unverbindliche Preisschätzung in weniger als 2 Minuten.",
    primaryButton: "Preis berechnen",
    secondaryButton: "Direkt anfragen",
  },
  default: {
    title: "Bereit für Ihr Video?",
    description: "Ich freue mich darauf, Ihre Geschichte zu erzählen. Kontaktieren Sie mich für ein unverbindliches Erstgespräch.",
    primaryButton: "Projekt starten",
    secondaryButton: "Portfolio ansehen",
  },
};

interface CTASectionProps {
  variant?: "default" | "konfigurator";
  data?: {
    title?: string;
    description?: string;
    primaryButton?: string;
    secondaryButton?: string;
  } | null;
}

export function CTASection({ variant = "default", data }: CTASectionProps) {
  // CMS-Daten oder Fallback verwenden
  const texts = {
    title: data?.title || defaultTexts[variant].title,
    description: data?.description || defaultTexts[variant].description,
    primaryButton: data?.primaryButton || defaultTexts[variant].primaryButton,
    secondaryButton: data?.secondaryButton || defaultTexts[variant].secondaryButton,
  };
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (variant === "konfigurator") {
    return (
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-foreground mb-6 tracking-wide">
              {texts.title}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {texts.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/konfigurator"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
              >
                {texts.primaryButton}
                <ArrowRight className="w-5 h-5" />
              </a>
              <button
                onClick={() => scrollToSection("kontakt")}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-foreground font-medium rounded-lg border border-foreground/30 hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-400"
              >
                {texts.secondaryButton}
              </button>
            </div>
          </motion.div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-foreground mb-6 tracking-wide">
            {texts.title}
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            {texts.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection("kontakt")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
            >
              {texts.primaryButton}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollToSection("portfolio")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-foreground font-medium rounded-lg border border-foreground/30 hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-400"
            >
              <Play className="w-4 h-4" />
              {texts.secondaryButton}
            </button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
