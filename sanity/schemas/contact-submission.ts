import { defineType, defineField } from "sanity";

export default defineType({
  name: "contactSubmission",
  title: "Kontaktanfragen",
  type: "document",
  icon: () => "📬",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "E-Mail",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Telefon",
      type: "string",
    }),
    defineField({
      name: "company",
      title: "Firma",
      type: "string",
    }),
    defineField({
      name: "subject",
      title: "Betreff",
      type: "string",
      options: {
        list: [
          { title: "Allgemeine Anfrage", value: "general" },
          { title: "Projektanfrage", value: "project" },
          { title: "Preisanfrage", value: "pricing" },
          { title: "Zusammenarbeit", value: "collaboration" },
          { title: "Sonstiges", value: "other" },
        ],
      },
    }),
    defineField({
      name: "message",
      title: "Nachricht",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Neu", value: "new" },
          { title: "Gelesen", value: "read" },
          { title: "Beantwortet", value: "answered" },
          { title: "Archiviert", value: "archived" },
        ],
      },
      initialValue: "new",
    }),
    defineField({
      name: "notes",
      title: "Interne Notizen",
      type: "text",
      description: "Nur für interne Verwendung",
    }),
    defineField({
      name: "submittedAt",
      title: "Eingegangen am",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "emailSent",
      title: "E-Mail gesendet",
      type: "boolean",
      readOnly: true,
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Neueste zuerst",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      name: "name",
      email: "email",
      subject: "subject",
      status: "status",
      submittedAt: "submittedAt",
    },
    prepare({ name, email, subject, status, submittedAt }) {
      const statusEmoji = {
        new: "🆕",
        read: "👁️",
        answered: "✅",
        archived: "📁",
      }[status as string] || "📬";

      const date = submittedAt
        ? new Date(submittedAt).toLocaleDateString("de-CH")
        : "";

      return {
        title: `${statusEmoji} ${name}`,
        subtitle: `${email} • ${date}`,
      };
    },
  },
});
