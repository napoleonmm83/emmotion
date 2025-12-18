import { defineType, defineField } from "sanity";

export default defineType({
  name: "onboardingQuestionnaire",
  title: "Onboarding-Fragebögen",
  type: "document",
  icon: () => "❓",
  fields: [
    defineField({
      name: "serviceSlug",
      title: "Service",
      type: "string",
      options: {
        list: [
          { title: "Imagefilm", value: "imagefilm" },
          { title: "Eventvideo", value: "eventvideo" },
          { title: "Social Media Content", value: "social-media" },
          { title: "Drohnenaufnahmen", value: "drohnenaufnahmen" },
          { title: "Produktvideo", value: "produktvideo" },
          { title: "Postproduktion", value: "postproduktion" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Fragebogen-Titel",
      type: "string",
      description: "z.B. 'Fragen zu Ihrem Imagefilm'",
    }),
    defineField({
      name: "description",
      title: "Beschreibung",
      type: "text",
      rows: 2,
      description: "Einleitungstext vor den Fragen",
    }),
    defineField({
      name: "questions",
      title: "Fragen",
      type: "array",
      of: [
        {
          type: "object",
          name: "question",
          fields: [
            {
              name: "id",
              type: "string",
              title: "Frage-ID",
              description: "Technische ID (z.B. 'video_length', 'interview_count')",
              validation: (Rule) =>
                Rule.required().regex(/^[a-z_]+$/, {
                  name: "lowercase_underscore",
                  invert: false,
                }),
            },
            {
              name: "question",
              type: "string",
              title: "Frage",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "type",
              type: "string",
              title: "Feldtyp",
              options: {
                list: [
                  { title: "Textfeld (einzeilig)", value: "text" },
                  { title: "Textfeld (mehrzeilig)", value: "textarea" },
                  { title: "Dropdown (Einzelauswahl)", value: "select" },
                  { title: "Checkboxen (Mehrfachauswahl)", value: "multiselect" },
                  { title: "Zahl", value: "number" },
                  { title: "Datum", value: "date" },
                  { title: "Ja/Nein", value: "checkbox" },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: "required",
              type: "boolean",
              title: "Pflichtfeld",
              initialValue: false,
            },
            {
              name: "options",
              type: "array",
              title: "Optionen",
              description: "Nur für Dropdown und Mehrfachauswahl",
              of: [{ type: "string" }],
              hidden: ({ parent }) =>
                parent?.type !== "select" && parent?.type !== "multiselect",
            },
            {
              name: "placeholder",
              type: "string",
              title: "Platzhalter",
              description: "Hinweistext im leeren Feld",
            },
            {
              name: "helpText",
              type: "string",
              title: "Hilfetext",
              description: "Zusätzliche Erklärung unter dem Feld",
            },
            {
              name: "conditionalOn",
              type: "object",
              title: "Bedingte Anzeige",
              description: "Nur anzeigen wenn eine andere Frage bestimmten Wert hat",
              fields: [
                {
                  name: "questionId",
                  type: "string",
                  title: "Abhängig von Frage-ID",
                },
                {
                  name: "value",
                  type: "string",
                  title: "Wenn Wert gleich",
                },
              ],
            },
          ],
          preview: {
            select: {
              question: "question",
              type: "type",
              required: "required",
            },
            prepare({ question, type, required }) {
              const typeLabels: Record<string, string> = {
                text: "📝 Text",
                textarea: "📄 Textarea",
                select: "📋 Dropdown",
                multiselect: "☑️ Multi",
                number: "🔢 Zahl",
                date: "📅 Datum",
                checkbox: "✅ Ja/Nein",
              };
              return {
                title: question || "Neue Frage",
                subtitle: `${typeLabels[type as string] || type}${required ? " • Pflicht" : ""}`,
              };
            },
          },
        },
      ],
    }),
  ],

  preview: {
    select: {
      service: "serviceSlug",
      title: "title",
      questions: "questions",
    },
    prepare({ service, title, questions }) {
      const serviceLabels: Record<string, string> = {
        imagefilm: "Imagefilm",
        eventvideo: "Eventvideo",
        "social-media": "Social Media",
        drohnenaufnahmen: "Drohnen",
        produktvideo: "Produktvideo",
        postproduktion: "Postproduktion",
      };
      const count = questions?.length || 0;
      return {
        title: title || `Fragebogen: ${serviceLabels[service as string] || service}`,
        subtitle: `${serviceLabels[service as string] || service} • ${count} Frage${count !== 1 ? "n" : ""}`,
      };
    },
  },
});
