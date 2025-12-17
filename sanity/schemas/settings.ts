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
        { name: "street", type: "string", title: "Strasse" },
        { name: "city", type: "string", title: "PLZ & Ort" },
        { name: "uid", type: "string", title: "UID-Nummer", description: "z.B. CHE-387.768.205" },
        { name: "region", type: "string", title: "Region / Einsatzgebiet", description: "z.B. Rheintal, Liechtenstein, Ostschweiz" },
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
        {
          name: "subjectOptions",
          type: "array",
          title: "Betreff-Optionen",
          description: "Auswahlmöglichkeiten im Dropdown",
          of: [
            {
              type: "object",
              fields: [
                { name: "value", type: "string", title: "Wert (intern)" },
                { name: "label", type: "string", title: "Anzeigename" },
              ],
              preview: {
                select: { title: "label", subtitle: "value" },
              },
            },
          ],
        },
        {
          name: "placeholders",
          type: "object",
          title: "Platzhalter-Texte",
          fields: [
            { name: "name", type: "string", title: "Name", initialValue: "Ihr Name" },
            { name: "email", type: "string", title: "E-Mail", initialValue: "ihre@email.ch" },
            { name: "phone", type: "string", title: "Telefon", initialValue: "+41 79 123 45 67" },
            { name: "company", type: "string", title: "Firma", initialValue: "Ihre Firma" },
            { name: "message", type: "string", title: "Nachricht", initialValue: "Erzählen Sie mir von Ihrem Projekt..." },
          ],
        },
        {
          name: "submitButtonText",
          type: "string",
          title: "Button-Text",
          initialValue: "Nachricht senden",
        },
        {
          name: "privacyText",
          type: "text",
          title: "Datenschutz-Hinweis",
          description: "Text unter dem Formular",
          initialValue: "Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäss unserer Datenschutzerklärung zu.",
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
      name: "footer",
      title: "Footer",
      type: "object",
      fields: [
        {
          name: "tagline",
          type: "text",
          title: "Tagline",
          description: "Kurzer Text unter dem Logo im Footer",
        },
        {
          name: "ctaText",
          type: "text",
          title: "CTA Text",
          description: "Call-to-Action Text im Footer",
        },
        {
          name: "copyrightName",
          type: "string",
          title: "Copyright Name",
          description: "z.B. emmotion",
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO Einstellungen",
      type: "object",
      fields: [
        {
          name: "allowIndexing",
          type: "boolean",
          title: "Suchmaschinen-Indexierung erlauben",
          description:
            "Wenn deaktiviert, wird die Website nicht von Google & Co. indexiert. Für Go-Live aktivieren!",
          initialValue: false,
        },
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
