import { defineType, defineField } from "sanity";

export default defineType({
  name: "portfolioPage",
  title: "Portfolio-Seite",
  type: "document",
  icon: () => "🎬",
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
          description: "z.B. 'Portfolio'",
        },
        {
          name: "subtitle",
          title: "Untertitel",
          type: "text",
          rows: 2,
        },
      ],
    }),
    defineField({
      name: "categories",
      title: "Kategorie-Filter",
      description: "Filter-Buttons für Projekt-Kategorien",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "value",
              title: "Wert (slug)",
              type: "string",
              description: "z.B. 'imagefilm', 'eventvideo' – muss mit Service-Slug übereinstimmen",
            },
            {
              name: "label",
              title: "Anzeigename",
              type: "string",
              description: "z.B. 'Imagefilme', 'Eventvideos'",
            },
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "value",
            },
          },
        },
      ],
    }),
    defineField({
      name: "industries",
      title: "Branchen-Filter",
      description: "Dropdown-Optionen für Branchen",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "value",
              title: "Wert",
              type: "string",
              description: "z.B. 'gastronomie', 'industrie'",
            },
            {
              name: "label",
              title: "Anzeigename",
              type: "string",
              description: "z.B. 'Gastronomie', 'Industrie'",
            },
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "value",
            },
          },
        },
      ],
    }),
    defineField({
      name: "cta",
      title: "CTA-Bereich",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Titel",
          type: "string",
          description: "z.B. 'Ihr Projekt könnte hier sein'",
        },
        {
          name: "description",
          title: "Beschreibung",
          type: "text",
          rows: 2,
        },
        {
          name: "buttonText",
          title: "Button-Text",
          type: "string",
          description: "z.B. 'Projekt anfragen'",
        },
      ],
    }),
    defineField({
      name: "emptyState",
      title: "Leerer Zustand",
      type: "object",
      fields: [
        {
          name: "message",
          title: "Nachricht",
          type: "string",
          description: "z.B. 'Keine Projekte für diese Filter gefunden.'",
        },
        {
          name: "resetText",
          title: "Reset-Button Text",
          type: "string",
          description: "z.B. 'Filter zurücksetzen'",
        },
      ],
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
        title: "Portfolio-Seite",
        subtitle: "Einstellungen für die Portfolio-Seite",
      };
    },
  },
});
