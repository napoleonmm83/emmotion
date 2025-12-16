"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Container } from "@/components/shared";

interface CTASectionProps {
  variant?: "default" | "konfigurator";
}

export function CTASection({ variant = "default" }: CTASectionProps) {
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
              Was kostet Ihr Video?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Nutzen Sie unseren Video-Konfigurator für eine unverbindliche
              Preisschätzung in weniger als 2 Minuten.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/konfigurator"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
              >
                Preis berechnen
                <ArrowRight className="w-5 h-5" />
              </a>
              <button
                onClick={() => scrollToSection("kontakt")}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-foreground font-medium rounded-lg border border-foreground/30 hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-400"
              >
                Direkt anfragen
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
            Bereit für Ihr Video?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Lassen Sie uns gemeinsam Ihre Geschichte erzählen.
            Kontaktieren Sie mich für ein unverbindliches Erstgespräch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection("kontakt")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
            >
              Projekt starten
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollToSection("portfolio")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-foreground font-medium rounded-lg border border-foreground/30 hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-400"
            >
              <Play className="w-4 h-4" />
              Portfolio ansehen
            </button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
