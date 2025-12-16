"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";
import { Container, SectionHeader } from "@/components/shared";
import { ContactForm } from "@/components/forms/contact-form";

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

const contactInfo = [
  {
    icon: Mail,
    label: "E-Mail",
    value: "info@emmotion.ch",
    href: "mailto:info@emmotion.ch",
  },
  {
    icon: Phone,
    label: "Telefon",
    value: "+41 79 723 29 24",
    href: "tel:+41797232924",
  },
  {
    icon: MapPin,
    label: "Region",
    value: "Rheintal, Liechtenstein, Ostschweiz",
  },
  {
    icon: Clock,
    label: "Antwortzeit",
    value: "Innerhalb von 24 Stunden",
  },
];

export function ContactPageContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Starten Sie Ihr
              <span className="text-primary"> Videoprojekt</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Sie haben ein Videoprojekt im Kopf? Ich freue mich darauf, mehr
              darüber zu erfahren. Schreiben Sie mir – unverbindlich und
              unkompliziert.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Contact Form & Info */}
      <section className="pb-24 md:pb-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="card-surface rounded-xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-medium text-foreground">
                    Nachricht senden
                  </h2>
                </div>
                <ContactForm variant="default" />
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2 space-y-6"
            >
              {/* Contact Info Card */}
              <motion.div
                variants={itemVariants}
                className="card-surface rounded-xl p-6 md:p-8"
              >
                <h3 className="text-lg font-medium text-foreground mb-6">
                  Kontaktdaten
                </h3>
                <div className="space-y-5">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="p-2.5 rounded-lg bg-primary/10 flex-shrink-0">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-0.5">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-foreground hover:text-primary transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-foreground">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Why Contact Card */}
              <motion.div
                variants={itemVariants}
                className="card-surface rounded-xl p-6 md:p-8"
              >
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Warum emmotion?
                </h3>
                <ul className="space-y-3">
                  {[
                    "Persönlicher Ansprechpartner statt Agentur",
                    "TV-Erfahrung aus dem Regionalfernsehen",
                    "Regional verwurzelt im Rheintal",
                    "Faire & transparente Preise",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Quick Response Card */}
              <motion.div
                variants={itemVariants}
                className="card-surface rounded-xl p-6 md:p-8 border-primary/20"
              >
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Schnelle Antwort garantiert
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ich melde mich in der Regel innerhalb von 24 Stunden bei
                  Ihnen. Für dringende Anfragen erreichen Sie mich am besten
                  telefonisch.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Map or Region Info (optional) */}
      <section className="py-16 md:py-24 border-t border-border bg-muted/30">
        <Container>
          <SectionHeader
            title="Einsatzgebiet"
            subtitle="Vor Ort für Sie da – in der gesamten Ostschweiz, Liechtenstein und darüber hinaus."
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {[
              "Rheintal",
              "Liechtenstein",
              "St. Gallen",
              "Vorarlberg",
              "Appenzell",
              "Thurgau",
              "Graubünden",
              "Zürich",
            ].map((region) => (
              <div
                key={region}
                className="text-center p-4 rounded-lg bg-card border border-border"
              >
                <span className="text-foreground font-medium">{region}</span>
              </div>
            ))}
          </motion.div>
          <p className="text-center text-muted-foreground mt-8">
            Projekte ausserhalb dieser Region? Kein Problem – sprechen Sie mich
            an!
          </p>
        </Container>
      </section>
    </>
  );
}
