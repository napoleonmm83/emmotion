import { defineType, defineField } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: () => "💬",
  fields: [
    defineField({
      name: "quote",
      title: "Zitat",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "string",
    }),
    defineField({
      name: "company",
      title: "Firma",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Bild",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "project",
      title: "Zugehöriges Projekt",
      type: "reference",
      to: [{ type: "project" }],
    }),
    defineField({
      name: "featured",
      title: "Auf Startseite zeigen",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "author",
      subtitle: "company",
      media: "image",
    },
  },
});
