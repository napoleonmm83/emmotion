/**
 * Zentrale Data-Fetch Layer mit Next.js 16 "use cache" Direktive
 *
 * Vorteile:
 * - Explizites, opt-in Caching (nicht mehr implizit)
 * - Granulare Cache-Kontrolle via cacheLife() und cacheTag()
 * - Einfache Revalidierung einzelner Datentypen
 * - Konsistentes Caching über alle Pages hinweg
 */

import { cacheLife, cacheTag } from "next/cache";
import { client } from "./client";
import {
  servicesQuery,
  serviceBySlugQuery,
  projectsQuery,
  projectBySlugQuery,
  featuredProjectsQuery,
  testimonialsQuery,
  featuredTestimonialsQuery,
  faqsQuery,
  settingsQuery,
  seoSettingsQuery,
  homePageQuery,
  aboutPageQuery,
  contactPageQuery,
  portfolioPageQuery,
  konfiguratorPageQuery,
  legalPageBySlugQuery,
  tvProductionsQuery,
  contractTemplateQuery,
  onboardingQuestionnaireQuery,
} from "./queries";

// =============================================================================
// SERVICES
// =============================================================================

/**
 * Alle Services laden - Cache: 1 Stunde
 * Services ändern sich selten, daher längeres Caching
 */
export async function getServices() {
  "use cache";
  cacheLife("hours");
  cacheTag("services");

  return client.fetch(servicesQuery);
}

/**
 * Service by Slug laden - Cache: 1 Stunde
 */
export async function getServiceBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("services", `service-${slug}`);

  return client.fetch(serviceBySlugQuery, { slug });
}

// =============================================================================
// PROJECTS
// =============================================================================

/**
 * Alle Projekte laden - Cache: 30 Minuten
 * Portfolio wird öfter aktualisiert
 */
export async function getProjects() {
  "use cache";
  cacheLife({
    stale: 60, // 1 Minute stale
    revalidate: 1800, // 30 Minuten revalidate
    expire: 3600, // 1 Stunde expire
  });
  cacheTag("projects");

  return client.fetch(projectsQuery);
}

/**
 * Featured Projekte für Homepage - Cache: 30 Minuten
 */
export async function getFeaturedProjects() {
  "use cache";
  cacheLife({
    stale: 60,
    revalidate: 1800,
    expire: 3600,
  });
  cacheTag("projects", "featured-projects");

  return client.fetch(featuredProjectsQuery);
}

/**
 * Projekt by Slug laden - Cache: 30 Minuten
 */
export async function getProjectBySlug(slug: string) {
  "use cache";
  cacheLife({
    stale: 60,
    revalidate: 1800,
    expire: 3600,
  });
  cacheTag("projects", `project-${slug}`);

  return client.fetch(projectBySlugQuery, { slug });
}

// =============================================================================
// TESTIMONIALS
// =============================================================================

/**
 * Alle Testimonials laden - Cache: 1 Tag
 * Testimonials ändern sich sehr selten
 */
export async function getTestimonials() {
  "use cache";
  cacheLife("days");
  cacheTag("testimonials");

  return client.fetch(testimonialsQuery);
}

/**
 * Featured Testimonials für Homepage - Cache: 1 Tag
 */
export async function getFeaturedTestimonials() {
  "use cache";
  cacheLife("days");
  cacheTag("testimonials", "featured-testimonials");

  return client.fetch(featuredTestimonialsQuery);
}

// =============================================================================
// FAQS
// =============================================================================

/**
 * Alle FAQs laden - Cache: 1 Tag
 */
export async function getFaqs() {
  "use cache";
  cacheLife("days");
  cacheTag("faqs");

  return client.fetch(faqsQuery);
}

// =============================================================================
// SETTINGS & SINGLETONS
// =============================================================================

/**
 * Site Settings laden - Cache: 1 Stunde
 * Settings können sich ändern (Kontaktdaten, etc.)
 */
export async function getSettings() {
  "use cache";
  cacheLife("hours");
  cacheTag("settings");

  return client.fetch(settingsQuery);
}

/**
 * SEO Settings für Root Layout laden - Cache: 1 Stunde
 * Enthält erweiterte SEO-Daten wie OG-Image Dimensionen
 */
export async function getSeoSettings() {
  "use cache";
  cacheLife("hours");
  cacheTag("seo-settings");

  return client.fetch(seoSettingsQuery);
}

/**
 * Homepage Daten laden - Cache: 1 Stunde
 */
export async function getHomePage() {
  "use cache";
  cacheLife("hours");
  cacheTag("home-page");

  return client.fetch(homePageQuery);
}

/**
 * About Page Daten laden - Cache: 1 Tag
 */
export async function getAboutPage() {
  "use cache";
  cacheLife("days");
  cacheTag("about-page");

  return client.fetch(aboutPageQuery);
}

/**
 * Contact Page Daten laden - Cache: 1 Stunde
 */
export async function getContactPage() {
  "use cache";
  cacheLife("hours");
  cacheTag("contact-page");

  return client.fetch(contactPageQuery);
}

/**
 * Portfolio Page Daten laden - Cache: 1 Stunde
 */
export async function getPortfolioPage() {
  "use cache";
  cacheLife("hours");
  cacheTag("portfolio-page");

  return client.fetch(portfolioPageQuery);
}

/**
 * Konfigurator Page Daten laden - Cache: 1 Tag
 */
export async function getKonfiguratorPage() {
  "use cache";
  cacheLife("days");
  cacheTag("konfigurator-page");

  return client.fetch(konfiguratorPageQuery);
}

/**
 * Legal Page by Slug laden - Cache: 1 Woche
 * Impressum/Datenschutz ändern sich sehr selten
 */
export async function getLegalPage(slug: string) {
  "use cache";
  cacheLife({
    stale: 3600, // 1 Stunde stale
    revalidate: 86400, // 1 Tag revalidate
    expire: 604800, // 1 Woche expire
  });
  cacheTag("legal", `legal-${slug}`);

  return client.fetch(legalPageBySlugQuery, { slug });
}

// =============================================================================
// TV PRODUCTIONS
// =============================================================================

/**
 * TV Productions Daten laden - Cache: 6 Stunden
 * YouTube Daten werden via Cron synchronisiert
 */
export async function getTvProductions() {
  "use cache";
  cacheLife({
    stale: 300, // 5 Minuten stale
    revalidate: 21600, // 6 Stunden revalidate
    expire: 43200, // 12 Stunden expire
  });
  cacheTag("tv-productions");

  return client.fetch(tvProductionsQuery);
}

// =============================================================================
// CONTRACT & ONBOARDING
// =============================================================================

/**
 * Contract Template laden - Cache: 1 Stunde
 */
export async function getContractTemplate() {
  "use cache";
  cacheLife("hours");
  cacheTag("contract-template");

  return client.fetch(contractTemplateQuery);
}

/**
 * Onboarding Questionnaire by Service Slug laden - Cache: 1 Tag
 */
export async function getOnboardingQuestionnaire(serviceSlug: string) {
  "use cache";
  cacheLife("days");
  cacheTag("onboarding", `questionnaire-${serviceSlug}`);

  return client.fetch(onboardingQuestionnaireQuery, { serviceSlug });
}
