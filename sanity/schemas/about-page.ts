import { defineType, defineField } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "Über mich",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Untertitel",
      type: "string",
      description: "z.B. 'Videograf mit TV-Erfahrung'",
    }),
    defineField({
      name: "profileImage",
      title: "Profilbild",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "heroText",
      title: "Hero Text",
      type: "text",
      rows: 3,
      description: "Kurzer Einleitungstext im Hero-Bereich",
    }),
    defineField({
      name: "description",
      title: "Ausführliche Beschreibung",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "stats",
      title: "Statistiken",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "value",
              type: "string",
              title: "Wert",
              description: "z.B. '10+' oder '100%'",
            },
            {
              name: "label",
              type: "string",
              title: "Bezeichnung",
              description: "z.B. 'Jahre Erfahrung'",
            },
          ],
          preview: {
            select: {
              title: "value",
              subtitle: "label",
            },
          },
        },
      ],
    }),
    defineField({
      name: "values",
      title: "Was mich auszeichnet",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "icon",
              type: "string",
              title: "Icon",
              description: "Lucide Icon Name (z.B. 'Tv', 'Users', 'MapPin', 'Heart')",
              options: {
                list: [
                  { title: "TV", value: "Tv" },
                  { title: "Users", value: "Users" },
                  { title: "MapPin", value: "MapPin" },
                  { title: "Heart", value: "Heart" },
                  { title: "Award", value: "Award" },
                  { title: "Camera", value: "Camera" },
                  { title: "Star", value: "Star" },
                  { title: "CheckCircle", value: "CheckCircle" },
                ],
              },
            },
            {
              name: "title",
              type: "string",
              title: "Titel",
            },
            {
              name: "description",
              type: "text",
              title: "Beschreibung",
              rows: 3,
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
    }),
    defineField({
      name: "timeline",
      title: "Mein Weg (Timeline)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "year",
              type: "string",
              title: "Jahr/Zeitraum",
              description: "z.B. 'Heute', '2020', 'Anfänge'",
            },
            {
              name: "title",
              type: "string",
              title: "Titel",
            },
            {
              name: "description",
              type: "text",
              title: "Beschreibung",
              rows: 2,
            },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "year",
            },
          },
        },
      ],
    }),
    defineField({
      name: "whyWorkWithMe",
      title: "Warum mit mir arbeiten",
      type: "object",
      fields: [
        {
          name: "title",
          type: "string",
          title: "Überschrift",
        },
        {
          name: "description",
          type: "text",
          title: "Beschreibung",
          rows: 3,
        },
        {
          name: "points",
          type: "array",
          title: "Vorteile",
          of: [{ type: "string" }],
        },
        {
          name: "image",
          type: "image",
          title: "Bild",
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        {
          name: "metaTitle",
          type: "string",
          title: "Meta Title",
        },
        {
          name: "metaDescription",
          type: "text",
          title: "Meta Description",
          rows: 3,
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "profileImage",
    },
    prepare({ title, media }) {
      return {
        title: title || "Über mich",
        subtitle: "Seiteninhalte",
        media,
      };
    },
  },
});
