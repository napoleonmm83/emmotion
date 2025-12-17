import { defineType, defineField } from "sanity";

export default defineType({
  name: "konfiguratorPage",
  title: "Konfigurator-Seite",
  type: "document",
  icon: () => "🧮",
  initialValue: {
    hero: {
      title: "Video-Konfigurator",
      subtitle: "Konfigurieren Sie Ihr Wunschvideo und erhalten Sie eine unverbindliche Preisschätzung – in nur wenigen Schritten.",
    },
    benefits: [
      {
        icon: "calculator",
        title: "Transparente Preise",
        description: "Erhalten Sie sofort eine realistische Preisschätzung",
      },
      {
        icon: "clock",
        title: "In 2 Minuten",
        description: "Schnell und unkompliziert konfigurieren",
      },
      {
        icon: "check",
        title: "Unverbindlich",
        description: "Keine Verpflichtung, einfach informieren",
      },
    ],
    infoSection: {
      title: "Wie funktioniert der Konfigurator?",
      description: "Der Konfigurator gibt Ihnen eine erste Orientierung zum Budget. Der finale Preis wird individuell nach einem persönlichen Gespräch festgelegt – basierend auf Ihren genauen Anforderungen.",
    },
    steps: [
      {
        title: "Konfigurieren",
        description: "Wählen Sie Video-Typ, Länge, Umfang und gewünschte Extras.",
      },
      {
        title: "Preisschätzung erhalten",
        description: "Sie sehen sofort eine realistische Preisspanne für Ihr Projekt.",
      },
      {
        title: "Unverbindlich anfragen",
        description: "Bei Interesse senden Sie eine Anfrage – ich melde mich innerhalb von 24h.",
      },
    ],
    seo: {
      metaTitle: "Video-Konfigurator | emmotion.ch",
      metaDescription: "Konfigurieren Sie Ihr Wunschvideo und erhalten Sie eine unverbindliche Preisschätzung für Ihre Videoproduktion.",
    },
  },
  fields: [
    defineField({
      name: "hero",
      title: "Hero-Bereich",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Titel",
          type: "string",
          description: "z.B. 'Video-Konfigurator'",
        },
        {
          name: "subtitle",
          title: "Untertitel",
          type: "text",
          rows: 2,
          description: "Kurze Beschreibung unter dem Titel",
        },
      ],
    }),
    defineField({
      name: "benefits",
      title: "Vorteile (3 Stück)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Rechner", value: "calculator" },
                  { title: "Uhr", value: "clock" },
                  { title: "Haken", value: "check" },
                  { title: "Stern", value: "star" },
                  { title: "Herz", value: "heart" },
                  { title: "Schild", value: "shield" },
                ],
              },
            },
            {
              name: "title",
              title: "Titel",
              type: "string",
            },
            {
              name: "description",
              title: "Beschreibung",
              type: "string",
            },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: "infoSection",
      title: "Info-Bereich",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Titel",
          type: "string",
          description: "z.B. 'Wie funktioniert der Konfigurator?'",
        },
        {
          name: "description",
          title: "Beschreibung",
          type: "text",
          rows: 3,
        },
      ],
    }),
    defineField({
      name: "steps",
      title: "Schritte (3 Stück)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Titel",
              type: "string",
            },
            {
              name: "description",
              title: "Beschreibung",
              type: "text",
              rows: 2,
            },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "metaTitle", type: "string", title: "Meta Title" },
        { name: "metaDescription", type: "text", title: "Meta Description", rows: 2 },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Konfigurator-Seite",
        subtitle: "Einstellungen für die Konfigurator-Seite",
      };
    },
  },
});
