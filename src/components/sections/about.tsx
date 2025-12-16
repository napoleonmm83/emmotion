"use client";

import { motion } from "framer-motion";
import { Tv, Award, Users, MapPin, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { Container, AnimatedCounter } from "@/components/shared";

interface Stat {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { icon: Tv, value: 10, suffix: "+", label: "Jahre TV-Erfahrung" },
  { icon: Award, value: 100, suffix: "+", label: "Projekte umgesetzt" },
  { icon: Users, value: 50, suffix: "+", label: "Zufriedene Kunden" },
  { icon: MapPin, value: 3, suffix: "", label: "Regionen abgedeckt" },
];

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

export function AboutSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

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
            <div className="aspect-[4/5] rounded-xl overflow-hidden card-surface relative">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
                alt="Portrait"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
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
              Über mich
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm lg:text-base">
              <p>
                Mit über zehn Jahren Erfahrung in der TV-Branche bringe ich
                professionelle Produktionsstandards in jedes Projekt. Von der
                Konzeption bis zur finalen Postproduktion – bei mir bekommen Sie
                alles aus einer Hand.
              </p>
              <p>
                Meine Leidenschaft ist es, Geschichten visuell zu erzählen.
                Dabei verbinde ich technische Expertise mit kreativem Gespür, um
                Videos zu produzieren, die nicht nur professionell aussehen,
                sondern auch emotional berühren.
              </p>
              <p>
                Als gebürtiger Rheintaler kenne ich die Region und ihre
                Unternehmen bestens. Ob lokaler Handwerksbetrieb oder
                internationales Unternehmen in Liechtenstein – ich verstehe die
                individuellen Bedürfnisse und setze sie gekonnt um.
              </p>
            </div>
            <button
              onClick={() => scrollToSection("kontakt")}
              className="inline-block mt-8 px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
            >
              Kontakt aufnehmen
            </button>
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
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="card-surface rounded-xl p-5 lg:p-6 text-center group hover:border-primary/30 transition-all duration-400"
            >
              <stat.icon className="w-7 h-7 lg:w-8 lg:h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform duration-400" />
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                className="text-2xl lg:text-3xl font-display text-foreground mb-1 block"
              />
              <p className="text-xs lg:text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
