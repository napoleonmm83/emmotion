"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Container, SectionHeader } from "@/components/shared";

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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="kontakt" className="py-24 md:py-32 border-t border-border">
      <Container>
        <SectionHeader
          title="Kontakt"
          subtitle="Bereit für Ihr nächstes Videoprojekt? Schreiben Sie mir – ich freue mich auf ein unverbindliches Gespräch."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-400"
                  placeholder="Ihr Name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  E-Mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-400"
                  placeholder="ihre@email.ch"
                />
              </div>
              <div>
                <label
                  htmlFor="projectType"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Projektart
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-primary transition-colors duration-400"
                >
                  <option value="">Bitte auswählen</option>
                  <option value="imagefilm">Imagefilm</option>
                  <option value="eventvideo">Eventvideo</option>
                  <option value="social-media">Social Media Content</option>
                  <option value="drohne">Drohnenaufnahmen</option>
                  <option value="produktvideo">Produktvideo</option>
                  <option value="sonstiges">Sonstiges</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Nachricht
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-400 resize-none"
                  placeholder="Erzählen Sie mir von Ihrem Projekt..."
                />
              </div>
              <button
                type="submit"
                className="w-full px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Nachricht senden
              </button>
            </form>
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
              <motion.div
                variants={itemVariants}
                className="card-surface rounded-xl p-8"
              >
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
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="card-surface rounded-xl p-8"
              >
                <h3 className="text-xl font-medium text-foreground mb-4">
                  Antwortzeit
                </h3>
                <p className="text-muted-foreground">
                  Ich melde mich in der Regel innerhalb von 24 Stunden bei
                  Ihnen. Dringende Anfragen erreichen mich am besten
                  telefonisch.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
