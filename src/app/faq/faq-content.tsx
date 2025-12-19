"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/shared";
import { PortableText } from "@sanity/lib/portable-text";
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

function FAQItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border last:border-b-0 px-5 md:px-6">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-start justify-between gap-4 text-left hover:text-primary transition-colors"
      >
        <span className="text-base md:text-lg font-medium text-foreground">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 mt-1"
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-6 pr-10">
              <PortableText value={faq.answer} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQContent({ faqs }: FAQContentProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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
            Hier finden Sie Antworten auf die wichtigsten Fragen rund um
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
              <div className="card-surface rounded-xl">
                {groupedFaqs[category].map((faq) => (
                  <FAQItem
                    key={faq._id}
                    faq={faq}
                    isOpen={openItems.has(faq._id)}
                    onToggle={() => toggleItem(faq._id)}
                  />
                ))}
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
            Ihre Frage ist nicht dabei?
          </h3>
          <p className="text-muted-foreground mb-6">
            Kontaktieren Sie mich direkt – ich helfe Ihnen gerne weiter.
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
