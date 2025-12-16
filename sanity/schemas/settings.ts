import { defineType, defineField } from "sanity";

export default defineType({
  name: "settings",
  title: "Site Settings",
  type: "document",
  icon: () => "⚙️",
  fields: [
    defineField({
      name: "siteName",
      title: "Website Name",
      type: "string",
    }),
    defineField({
      name: "siteDescription",
      title: "Website Beschreibung",
      type: "text",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
    }),
    defineField({
      name: "contact",
      title: "Kontakt",
      type: "object",
      fields: [
        { name: "email", type: "string", title: "E-Mail" },
        { name: "phone", type: "string", title: "Telefon" },
        { name: "address", type: "text", title: "Adresse" },
      ],
    }),
    defineField({
      name: "contactForm",
      title: "Kontaktformular Einstellungen",
      type: "object",
      fields: [
        {
          name: "recipientEmail",
          type: "string",
          title: "Empfänger E-Mail",
          description: "An diese Adresse werden Kontaktanfragen gesendet",
        },
        {
          name: "emailSubjectPrefix",
          type: "string",
          title: "Betreff-Präfix",
          description: "z.B. '[emmotion.ch]' - wird vor den Betreff gesetzt",
          initialValue: "[emmotion.ch]",
        },
        {
          name: "successMessage",
          type: "text",
          title: "Erfolgsmeldung",
          description: "Wird nach erfolgreicher Absendung angezeigt",
          initialValue:
            "Vielen Dank für Ihre Nachricht! Ich melde mich innerhalb von 24 Stunden bei Ihnen.",
        },
        {
          name: "enableEmailNotification",
          type: "boolean",
          title: "E-Mail-Benachrichtigung aktivieren",
          description:
            "Wenn deaktiviert, werden Anfragen nur in Sanity gespeichert",
          initialValue: false,
        },
      ],
    }),
    defineField({
      name: "social",
      title: "Social Media",
      type: "object",
      fields: [
        { name: "linkedin", type: "url", title: "LinkedIn" },
        { name: "instagram", type: "url", title: "Instagram" },
        { name: "youtube", type: "url", title: "YouTube" },
      ],
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "object",
      fields: [
        { name: "metaTitle", type: "string", title: "Default Meta Title" },
        {
          name: "metaDescription",
          type: "text",
          title: "Default Meta Description",
        },
        { name: "ogImage", type: "image", title: "Default OG Image" },
      ],
    }),
  ],
  preview: {
    select: {
      title: "siteName",
    },
    prepare({ title }) {
      return {
        title: title || "Site Settings",
      };
    },
  },
});
