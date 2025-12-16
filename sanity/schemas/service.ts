import { defineType, defineField } from "sanity";
import { Film } from "lucide-react";

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
      name: "shortDescription",
      title: "Kurzbeschreibung",
      type: "text",
      rows: 3,
      description: "Für Übersichtsseiten und Cards",
    }),
    defineField({
      name: "description",
      title: "Ausführliche Beschreibung",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "icon",
      title: "Icon Name",
      type: "string",
      description: "Lucide Icon Name (z.B. 'video', 'users', 'package')",
    }),
    defineField({
      name: "idealFor",
      title: "Ideal für",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "priceFrom",
      title: "Preis ab (CHF)",
      type: "number",
    }),
    defineField({
      name: "featuredVideo",
      title: "Beispiel-Video URL",
      type: "url",
    }),
    defineField({
      name: "featuredImage",
      title: "Vorschaubild",
      type: "image",
      options: { hotspot: true },
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
            { name: "description", type: "text", title: "Beschreibung" },
          ],
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "metaTitle", type: "string", title: "Meta Title" },
        { name: "metaDescription", type: "text", title: "Meta Description" },
      ],
    }),
    defineField({
      name: "order",
      title: "Reihenfolge",
      type: "number",
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
