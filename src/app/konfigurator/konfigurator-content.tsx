"use client";

import { motion } from "framer-motion";
import { Calculator, Clock, CheckCircle } from "lucide-react";
import { Container } from "@/components/shared";
import { Konfigurator } from "@/components/konfigurator";

const benefits = [
  {
    icon: Calculator,
    title: "Transparente Preise",
    description: "Erhalten Sie sofort eine realistische Preisschätzung",
  },
  {
    icon: Clock,
    title: "In 2 Minuten",
    description: "Schnell und unkompliziert konfigurieren",
  },
  {
    icon: CheckCircle,
    title: "Unverbindlich",
    description: "Keine Verpflichtung, einfach informieren",
  },
];

export function KonfiguratorPageContent() {
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
              Video-
              <span className="text-primary">Konfigurator</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Konfigurieren Sie Ihr Wunschvideo und erhalten Sie eine
              unverbindliche Preisschätzung – in nur wenigen Schritten.
            </p>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50"
              >
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <benefit.icon className="w-5 h-5 text-primary" />
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
            ))}
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
              Wie funktioniert der Konfigurator?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Der Konfigurator gibt Ihnen eine erste Orientierung zum Budget.
              Der finale Preis wird individuell nach einem persönlichen Gespräch
              festgelegt – basierend auf Ihren genauen Anforderungen.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mb-3">
                  1
                </div>
                <h3 className="font-medium text-foreground mb-2">
                  Konfigurieren
                </h3>
                <p className="text-sm text-muted-foreground">
                  Wählen Sie Video-Typ, Länge, Umfang und gewünschte Extras.
                </p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mb-3">
                  2
                </div>
                <h3 className="font-medium text-foreground mb-2">
                  Preisschätzung erhalten
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sie sehen sofort eine realistische Preisspanne für Ihr
                  Projekt.
                </p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mb-3">
                  3
                </div>
                <h3 className="font-medium text-foreground mb-2">
                  Unverbindlich anfragen
                </h3>
                <p className="text-sm text-muted-foreground">
                  Bei Interesse senden Sie eine Anfrage – ich melde mich
                  innerhalb von 24h.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
