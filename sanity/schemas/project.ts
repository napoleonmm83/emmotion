import { defineType, defineField } from "sanity";

export default defineType({
  name: "project",
  title: "Projekt",
  type: "document",
  icon: () => "🎥",
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
      name: "client",
      title: "Kunde",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Kategorie",
      type: "reference",
      to: [{ type: "service" }],
    }),
    defineField({
      name: "industry",
      title: "Branche",
      type: "string",
      options: {
        list: [
          { title: "Gastronomie", value: "gastronomie" },
          { title: "Industrie", value: "industrie" },
          { title: "Handwerk", value: "handwerk" },
          { title: "Gesundheit", value: "gesundheit" },
          { title: "Dienstleistung", value: "dienstleistung" },
          { title: "Tourismus", value: "tourismus" },
          { title: "Sonstiges", value: "sonstiges" },
        ],
      },
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description: "Vimeo, YouTube oder direkte URL",
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "challenge",
      title: "Herausforderung",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "solution",
      title: "Lösung",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "result",
      title: "Ergebnis",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "testimonial",
      title: "Kundenstimme",
      type: "reference",
      to: [{ type: "testimonial" }],
    }),
    defineField({
      name: "featured",
      title: "Auf Startseite zeigen",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Veröffentlicht am",
      type: "date",
    }),
  ],
  orderings: [
    {
      title: "Neueste zuerst",
      name: "dateDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      client: "client",
      media: "thumbnail",
    },
    prepare({ title, client, media }) {
      return {
        title,
        subtitle: client,
        media,
      };
    },
  },
});
