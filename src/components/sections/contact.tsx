"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { Container, SectionHeader } from "@/components/shared";
import { ContactForm } from "@/components/forms/contact-form";
import { Card } from "@/components/ui/card";

// Fallback Kontaktdaten
const defaultContact = {
  email: "hallo@emmotion.ch",
  phone: "+41 79 723 29 24",
  region: "Rheintal, Liechtenstein, Ostschweiz",
};

interface ContactSectionProps {
  settings?: {
    contact?: {
      email?: string;
      phone?: string;
      region?: string;
    };
  } | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.4,
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

export function ContactSection({ settings }: ContactSectionProps) {
  // CMS-Daten oder Fallback verwenden
  const contact = {
    email: settings?.contact?.email || defaultContact.email,
    phone: settings?.contact?.phone || defaultContact.phone,
    region: settings?.contact?.region || defaultContact.region,
  };

  // Subject options für Homepage (Projektarten)
  const homeSubjectOptions = [
    { value: "imagefilm", label: "Imagefilm" },
    { value: "eventvideo", label: "Eventvideo" },
    { value: "social-media", label: "Social Media Content" },
    { value: "drohne", label: "Drohnenaufnahmen" },
    { value: "produktvideo", label: "Produktvideo" },
    { value: "sonstiges", label: "Sonstiges" },
  ];

  return (
    <section id="kontakt" className="py-24 md:py-32 border-t border-border">
      <Container>
        <SectionHeader
          title="Kontakt"
          subtitle="Bereit für dein nächstes Videoprojekt? Schreib mir – ich freue mich auf ein unverbindliches Gespräch."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <ContactForm
              variant="compact"
              settings={{
                subjectOptions: homeSubjectOptions,
                placeholders: {
                  message: "Erzähl mir von deinem Projekt...",
                },
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >
              <motion.div variants={itemVariants}>
                <Card className="p-8">
                  <h3 className="text-xl font-medium text-foreground mb-6">
                    Kontaktdaten
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          E-Mail
                        </p>
                        <a href={`mailto:${contact.email}`} className="text-foreground hover:text-primary transition-colors">
                          {contact.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Telefon
                        </p>
                        <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="text-foreground hover:text-primary transition-colors">
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Region
                        </p>
                        <p className="text-foreground">
                          {contact.region}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card className="p-8">
                  <h3 className="text-xl font-medium text-foreground mb-4">
                    Antwortzeit
                  </h3>
                  <p className="text-muted-foreground">
                    Ich melde mich in der Regel innerhalb von 24 Stunden bei
                    dir. Dringende Anfragen erreichen mich am besten
                    telefonisch.
                  </p>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
