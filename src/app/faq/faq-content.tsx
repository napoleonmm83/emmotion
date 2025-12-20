"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared";
import { PortableText } from "@sanity/lib/portable-text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { PortableTextBlock } from "@portabletext/types";

interface FAQ {
  _id: string;
  question: string;
  answer: PortableTextBlock[];
  category: string;
}

interface FAQContentProps {
  faqs: FAQ[];
}

const CATEGORY_LABELS: Record<string, string> = {
  kosten: "Kosten & Preise",
  ablauf: "Ablauf & Prozess",
  technik: "Technik & Qualität",
  allgemein: "Allgemein",
};

const CATEGORY_ORDER = ["allgemein", "kosten", "ablauf", "technik"];

export function FAQContent({ faqs }: FAQContentProps) {
  // Group FAQs by category
  const groupedFaqs = faqs.reduce((acc, faq) => {
    const category = faq.category || "allgemein";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  // Sort categories by defined order
  const sortedCategories = CATEGORY_ORDER.filter((cat) => groupedFaqs[cat]?.length > 0);

  return (
    <section className="py-12 md:py-20">
      <Container size="small">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display tracking-wider text-foreground mb-4">
            Häufig gestellte <span className="text-primary">Fragen</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hier findest du Antworten auf die wichtigsten Fragen rund um
            Videoproduktion, Ablauf und Kosten.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-10"
        >
          {sortedCategories.map((category) => (
            <div key={category}>
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 pb-3 border-b-2 border-primary/20">
                {CATEGORY_LABELS[category] || category}
              </h2>
              <div className="card-surface rounded-xl px-5 md:px-6">
                <Accordion type="multiple">
                  {groupedFaqs[category].map((faq) => (
                    <AccordionItem key={faq._id} value={faq._id} className="border-border">
                      <AccordionTrigger className="text-base md:text-lg text-foreground">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="pr-10">
                        <PortableText value={faq.answer} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center p-8 card-surface rounded-xl"
        >
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Deine Frage ist nicht dabei?
          </h3>
          <p className="text-muted-foreground mb-6">
            Kontaktiere mich direkt – ich helfe dir gerne weiter.
          </p>
          <a
            href="/kontakt"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Kontakt aufnehmen
          </a>
        </motion.div>
      </Container>
    </section>
  );
}
