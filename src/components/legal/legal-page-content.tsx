"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared";
import { PortableText } from "@sanity/lib/portable-text";
import type { PortableTextBlock } from "@portabletext/types";

interface LegalPageContentProps {
  title: string;
  content: PortableTextBlock[] | null;
  lastUpdated?: string;
  fallbackContent?: React.ReactNode;
}

export function LegalPageContent({
  title,
  content,
  lastUpdated,
  fallbackContent,
}: LegalPageContentProps) {
  return (
    <section className="py-12 md:py-20">
      <Container size="small">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display tracking-wider text-foreground mb-4">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground mb-8">
              Zuletzt aktualisiert:{" "}
              {new Date(lastUpdated).toLocaleDateString("de-CH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {content && content.length > 0 ? (
              <PortableText value={content} />
            ) : (
              fallbackContent
            )}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
