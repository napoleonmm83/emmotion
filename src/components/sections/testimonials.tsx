"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Container, SectionHeader } from "@/components/shared";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

// Fallback Testimonials wenn keine CMS-Daten vorhanden
const fallbackTestimonials: Testimonial[] = [
  {
    quote:
      "Die Zusammenarbeit war von Anfang an professionell und unkompliziert. Das Ergebnis hat unsere Erwartungen übertroffen.",
    name: "Sarah Müller",
    role: "Marketing Leiterin",
    company: "TechVision AG",
  },
  {
    quote:
      "Endlich ein Videograf, der versteht, was wir brauchen. Die Qualität ist auf TV-Niveau – absolut empfehlenswert.",
    name: "Thomas Brunner",
    role: "Geschäftsführer",
    company: "Brunner Immobilien",
  },
  {
    quote:
      "Unser Imagefilm hat uns bereits mehrere neue Kunden gebracht. Die Investition hat sich mehr als gelohnt.",
    name: "Lisa Oberhauser",
    role: "Inhaberin",
    company: "Oberhauser Design Studio",
  },
];

interface TestimonialsSectionProps {
  data?: Testimonial[] | null;
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function TestimonialsSection({ data }: TestimonialsSectionProps) {
  // CMS-Daten oder Fallback verwenden
  const testimonials = data && data.length > 0 ? data : fallbackTestimonials;

  return (
    <section className="py-24 md:py-32 border-t border-border">
      <Container>
        <SectionHeader
          title="Kundenstimmen"
          subtitle="Was meine Kunden über die Zusammenarbeit sagen."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              variants={itemVariants}
              className="card-surface rounded-xl p-6 lg:p-8 relative group hover:border-primary/30 transition-colors duration-400"
            >
              <div className="absolute -top-3 -left-1 opacity-10 group-hover:opacity-20 transition-opacity duration-400">
                <Quote className="w-12 h-12 lg:w-16 lg:h-16 text-primary" />
              </div>

              <p className="text-foreground/90 leading-relaxed mb-6 relative z-10 italic text-sm lg:text-base">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <span className="text-foreground font-medium text-base lg:text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm lg:text-base">
                    {testimonial.name}
                  </p>
                  <p className="text-muted-foreground text-xs lg:text-sm">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
