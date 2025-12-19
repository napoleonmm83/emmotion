"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, MessageSquare, type LucideIcon } from "lucide-react";
import { Container, SectionHeader } from "@/components/shared";
import { ContactForm } from "@/components/forms/contact-form";

// Fallback Kontaktdaten
const defaultContact = {
  email: "hallo@emmotion.ch",
  phone: "+41 79 723 29 24",
  region: "Rheintal, Liechtenstein, Ostschweiz",
};

// Fallback Hero
const defaultHero = {
  title: "Starten Sie Ihr",
  titleHighlight: "Videoprojekt",
  subtitle: "Sie haben ein Videoprojekt im Kopf? Ich freue mich darauf, mehr darüber zu erfahren. Schreiben Sie mir – unverbindlich und unkompliziert.",
};

// Fallback Sidebar
const defaultSidebar = {
  contactTitle: "Kontaktdaten",
  responseTime: "Innerhalb von 24 Stunden",
  whyTitle: "Warum emmotion?",
  whyPoints: [
    "Persönlicher Ansprechpartner statt Agentur",
    "TV-Erfahrung aus dem Regionalfernsehen",
    "Regional verwurzelt im Rheintal",
    "Faire & transparente Preise",
  ],
  quickResponseTitle: "Schnelle Antwort garantiert",
  quickResponseText: "Ich melde mich in der Regel innerhalb von 24 Stunden bei Ihnen. Für dringende Anfragen erreichen Sie mich am besten telefonisch.",
};

// Fallback Regions
const defaultRegions = {
  title: "Einsatzgebiet",
  subtitle: "Vor Ort für Sie da – in der gesamten Ostschweiz, Liechtenstein und darüber hinaus.",
  regionList: ["Rheintal", "Liechtenstein", "St. Gallen", "Vorarlberg", "Appenzell", "Thurgau", "Graubünden", "Zürich"],
  footerText: "Projekte ausserhalb dieser Region? Kein Problem – sprechen Sie mich an!",
};

interface ContactFormSettings {
  subjectOptions?: Array<{ value: string; label: string }>;
  placeholders?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    message?: string;
  };
  submitButtonText?: string;
  successMessage?: string;
  privacyText?: string;
}

interface ContactPageData {
  hero?: {
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
  };
  form?: ContactFormSettings & {
    title?: string;
  };
  sidebar?: {
    contactTitle?: string;
    responseTime?: string;
    whyTitle?: string;
    whyPoints?: string[];
    quickResponseTitle?: string;
    quickResponseText?: string;
  };
  regions?: {
    title?: string;
    subtitle?: string;
    regionList?: string[];
    footerText?: string;
  };
}

interface ContactPageContentProps {
  settings?: {
    contact?: {
      email?: string;
      phone?: string;
      region?: string;
    };
  } | null;
  pageData?: ContactPageData | null;
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

export function ContactPageContent({ settings, pageData }: ContactPageContentProps) {
  // CMS-Daten oder Fallback verwenden
  const contact = {
    email: settings?.contact?.email || defaultContact.email,
    phone: settings?.contact?.phone || defaultContact.phone,
    region: settings?.contact?.region || defaultContact.region,
  };

  // Hero-Daten
  const hero = {
    title: pageData?.hero?.title || defaultHero.title,
    titleHighlight: pageData?.hero?.titleHighlight || defaultHero.titleHighlight,
    subtitle: pageData?.hero?.subtitle || defaultHero.subtitle,
  };

  // Form-Daten
  const formTitle = pageData?.form?.title || "Nachricht senden";
  const formSettings: ContactFormSettings = {
    subjectOptions: pageData?.form?.subjectOptions,
    placeholders: pageData?.form?.placeholders,
    submitButtonText: pageData?.form?.submitButtonText,
    successMessage: pageData?.form?.successMessage,
    privacyText: pageData?.form?.privacyText,
  };

  // Sidebar-Daten
  const sidebar = {
    contactTitle: pageData?.sidebar?.contactTitle || defaultSidebar.contactTitle,
    responseTime: pageData?.sidebar?.responseTime || defaultSidebar.responseTime,
    whyTitle: pageData?.sidebar?.whyTitle || defaultSidebar.whyTitle,
    whyPoints: pageData?.sidebar?.whyPoints?.length ? pageData.sidebar.whyPoints : defaultSidebar.whyPoints,
    quickResponseTitle: pageData?.sidebar?.quickResponseTitle || defaultSidebar.quickResponseTitle,
    quickResponseText: pageData?.sidebar?.quickResponseText || defaultSidebar.quickResponseText,
  };

  // Regions-Daten
  const regions = {
    title: pageData?.regions?.title || defaultRegions.title,
    subtitle: pageData?.regions?.subtitle || defaultRegions.subtitle,
    regionList: pageData?.regions?.regionList?.length ? pageData.regions.regionList : defaultRegions.regionList,
    footerText: pageData?.regions?.footerText || defaultRegions.footerText,
  };

  // Dynamische Kontaktinfo basierend auf CMS-Daten
  const contactInfo: { icon: LucideIcon; label: string; value: string; href?: string }[] = [
    {
      icon: Mail,
      label: "E-Mail",
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: Phone,
      label: "Telefon",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
    },
    {
      icon: MapPin,
      label: "Region",
      value: contact.region,
    },
    {
      icon: Clock,
      label: "Antwortzeit",
      value: sidebar.responseTime,
    },
  ];
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display tracking-wider text-foreground mb-6">
              {hero.title}
              <span className="text-primary"> {hero.titleHighlight}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {hero.subtitle}
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
                    {formTitle}
                  </h2>
                </div>
                <ContactForm variant="default" settings={formSettings} />
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
                  {sidebar.contactTitle}
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
                  {sidebar.whyTitle}
                </h3>
                <ul className="space-y-3">
                  {sidebar.whyPoints.map((item) => (
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
                  {sidebar.quickResponseTitle}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {sidebar.quickResponseText}
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
            title={regions.title}
            subtitle={regions.subtitle}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {regions.regionList.map((region) => (
              <div
                key={region}
                className="text-center p-4 rounded-lg bg-card border border-border"
              >
                <span className="text-foreground font-medium">{region}</span>
              </div>
            ))}
          </motion.div>
          <p className="text-center text-muted-foreground mt-8">
            {regions.footerText}
          </p>
        </Container>
      </section>
    </>
  );
}
