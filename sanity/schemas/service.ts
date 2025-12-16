import { defineType, defineField } from "sanity";

export default defineType({
  name: "service",
  title: "Leistung",
  type: "document",
  icon: () => "🎬",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Lucide Icon Name",
      options: {
        list: [
          { title: "Film", value: "Film" },
          { title: "Video", value: "Video" },
          { title: "Camera", value: "Camera" },
          { title: "Plane (Drohne)", value: "Plane" },
          { title: "Clapperboard", value: "Clapperboard" },
          { title: "Sparkles", value: "Sparkles" },
        ],
      },
    }),
    defineField({
      name: "shortDescription",
      title: "Kurzbeschreibung",
      type: "text",
      rows: 3,
      description: "Für Übersichtsseiten und Cards (max 200 Zeichen)",
    }),
    defineField({
      name: "description",
      title: "Ausführliche Beschreibung",
      type: "text",
      rows: 5,
      description: "Detaillierte Beschreibung für die Detailseite",
    }),
    defineField({
      name: "featuredImage",
      title: "Vorschaubild",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "priceFrom",
      title: "Preis ab (CHF)",
      type: "number",
    }),
    defineField({
      name: "idealFor",
      title: "Ideal für",
      type: "array",
      of: [{ type: "string" }],
      description: "z.B. 'Unternehmenspräsentation', 'Recruiting', 'Website'",
    }),
    defineField({
      name: "benefits",
      title: "Vorteile",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Titel" },
            { name: "description", type: "text", title: "Beschreibung", rows: 2 },
          ],
          preview: {
            select: { title: "title" },
          },
        },
      ],
    }),
    defineField({
      name: "process",
      title: "Ablauf / Prozess",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "step", type: "number", title: "Schritt Nr." },
            { name: "title", type: "string", title: "Titel" },
            { name: "description", type: "text", title: "Beschreibung", rows: 2 },
          ],
          preview: {
            select: { title: "title", step: "step" },
            prepare({ title, step }) {
              return { title: `${step}. ${title}` };
            },
          },
        },
      ],
    }),
    defineField({
      name: "faq",
      title: "Häufige Fragen",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", type: "string", title: "Frage" },
            { name: "answer", type: "text", title: "Antwort", rows: 3 },
          ],
          preview: {
            select: { title: "question" },
          },
        },
      ],
    }),
    defineField({
      name: "exampleVideos",
      title: "Beispielvideos",
      type: "array",
      description: "YouTube-Videos als Referenzbeispiele",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Titel" },
            { name: "youtubeUrl", type: "url", title: "YouTube URL" },
            { name: "description", type: "text", title: "Kurzbeschreibung", rows: 2 },
          ],
          preview: {
            select: { title: "title", url: "youtubeUrl" },
            prepare({ title, url }) {
              return {
                title: title || "Video",
                subtitle: url
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "relatedProjects",
      title: "Verwandte Projekte",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "metaTitle", type: "string", title: "Meta Title" },
        { name: "metaDescription", type: "text", title: "Meta Description", rows: 3 },
      ],
    }),
    defineField({
      name: "order",
      title: "Reihenfolge",
      type: "number",
      description: "Niedrigere Zahlen werden zuerst angezeigt",
    }),
  ],
  orderings: [
    {
      title: "Reihenfolge",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "shortDescription",
      media: "featuredImage",
    },
  },
});
