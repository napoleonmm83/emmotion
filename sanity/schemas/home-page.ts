import { defineType, defineField } from "sanity";

export default defineType({
  name: "homePage",
  title: "Startseite",
  type: "document",
  icon: () => "🏠",
  fields: [
    // ===== HERO SECTION =====
    defineField({
      name: "hero",
      title: "Hero Bereich",
      type: "object",
      fields: [
        {
          name: "titleLine1",
          title: "Titel Zeile 1",
          type: "string",
          description: "z.B. 'Videos, die'",
          initialValue: "Videos, die",
        },
        {
          name: "titleHighlight",
          title: "Titel Highlight (mit Gradient)",
          type: "string",
          description: "z.B. 'wirken.'",
          initialValue: "wirken.",
        },
        {
          name: "subtitle",
          title: "Untertitel",
          type: "text",
          rows: 2,
          description: "Kurze Beschreibung unter dem Titel",
          initialValue:
            "Videoproduktion mit TV-Erfahrung – für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz.",
        },
        {
          name: "ctaPrimaryText",
          title: "Primärer Button Text",
          type: "string",
          initialValue: "Projekt anfragen",
        },
        {
          name: "ctaPrimaryLink",
          title: "Primärer Button Link",
          type: "string",
          description: "z.B. '#kontakt' oder '/kontakt'",
          initialValue: "#kontakt",
        },
        {
          name: "ctaSecondaryText",
          title: "Sekundärer Button Text",
          type: "string",
          initialValue: "Portfolio ansehen",
        },
        {
          name: "ctaSecondaryLink",
          title: "Sekundärer Button Link",
          type: "string",
          initialValue: "#portfolio",
        },
        {
          name: "backgroundVideo",
          title: "Hintergrund Video URL",
          type: "url",
          description: "MP4 Video URL für den Hintergrund",
        },
        {
          name: "backgroundImage",
          title: "Hintergrund Bild (Fallback/Poster)",
          type: "image",
          options: { hotspot: true },
          description: "Wird angezeigt während Video lädt oder als Fallback",
        },
      ],
    }),

    // ===== SECTIONS VISIBILITY =====
    defineField({
      name: "sections",
      title: "Sektionen anzeigen",
      type: "object",
      description: "Aktiviere/deaktiviere einzelne Sektionen auf der Startseite",
      fields: [
        {
          name: "showServices",
          title: "Leistungen anzeigen",
          type: "boolean",
          initialValue: true,
        },
        {
          name: "showPortfolio",
          title: "Portfolio anzeigen",
          type: "boolean",
          initialValue: true,
        },
        {
          name: "showTestimonials",
          title: "Kundenstimmen anzeigen",
          type: "boolean",
          initialValue: true,
        },
        {
          name: "showCTA",
          title: "Konfigurator CTA anzeigen",
          type: "boolean",
          initialValue: true,
        },
        {
          name: "showAbout",
          title: "Über mich anzeigen",
          type: "boolean",
          initialValue: true,
        },
        {
          name: "showContact",
          title: "Kontakt anzeigen",
          type: "boolean",
          initialValue: true,
        },
      ],
    }),

    // ===== SEO =====
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        {
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
          description: "Überschreibt den Standard-Titel",
        },
        {
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.max(160).warning("Max. 160 Zeichen empfohlen"),
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Startseite",
        subtitle: "Hero, Sektionen & SEO",
      };
    },
  },
});
