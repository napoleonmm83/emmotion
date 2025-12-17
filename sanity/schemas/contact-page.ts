import { defineType, defineField } from "sanity";

export default defineType({
  name: "contactPage",
  title: "Kontakt-Seite",
  type: "document",
  icon: () => "📬",
  initialValue: {
    hero: {
      title: "Starten Sie Ihr",
      titleHighlight: "Videoprojekt",
      subtitle: "Sie haben ein Videoprojekt im Kopf? Ich freue mich darauf, mehr darüber zu erfahren. Schreiben Sie mir – unverbindlich und unkompliziert.",
    },
    form: {
      title: "Nachricht senden",
      subjectOptions: [
        { value: "general", label: "Allgemeine Anfrage" },
        { value: "project", label: "Projektanfrage" },
        { value: "pricing", label: "Preisanfrage" },
        { value: "collaboration", label: "Zusammenarbeit" },
        { value: "other", label: "Sonstiges" },
      ],
      placeholders: {
        name: "Ihr Name",
        email: "ihre@email.ch",
        phone: "+41 79 123 45 67",
        company: "Ihre Firma",
        message: "Erzählen Sie mir von Ihrem Projekt...",
      },
      submitButtonText: "Nachricht senden",
      successMessage: "Vielen Dank für Ihre Nachricht! Ich melde mich innerhalb von 24 Stunden bei Ihnen.",
      privacyText: "Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäss unserer Datenschutzerklärung zu.",
    },
    sidebar: {
      contactTitle: "Kontaktdaten",
      responseTime: "Innerhalb von 24 Stunden",
      whyTitle: "Warum emmotion?",
      whyPoints: [
        "Persönlicher Ansprechpartner statt Agentur",
        "TV-Erfahrung aus dem Regionalfernsehen",
        "Regional verwurzelt im Rheintal",
        "Faire & transparente Preise",
      ],
      quickResponseTitle: "Schnelle Antwort garantiert",
      quickResponseText: "Ich melde mich in der Regel innerhalb von 24 Stunden bei Ihnen. Für dringende Anfragen erreichen Sie mich am besten telefonisch.",
    },
    regions: {
      title: "Einsatzgebiet",
      subtitle: "Vor Ort für Sie da – in der gesamten Ostschweiz, Liechtenstein und darüber hinaus.",
      regionList: [
        "Rheintal",
        "Liechtenstein",
        "St. Gallen",
        "Vorarlberg",
        "Appenzell",
        "Thurgau",
        "Graubünden",
        "Zürich",
      ],
      footerText: "Projekte ausserhalb dieser Region? Kein Problem – sprechen Sie mich an!",
    },
    seo: {
      metaTitle: "Kontakt | emmotion.ch",
      metaDescription: "Nehmen Sie Kontakt auf für Ihr nächstes Videoprojekt. Videoproduktion im Rheintal, Liechtenstein und der Ostschweiz.",
    },
  },
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
          description: "z.B. 'Starten Sie Ihr'",
        },
        {
          name: "titleHighlight",
          title: "Titel Highlight",
          type: "string",
          description: "Farbig hervorgehobener Teil, z.B. 'Videoprojekt'",
        },
        {
          name: "subtitle",
          title: "Untertitel",
          type: "text",
          rows: 3,
        },
      ],
    }),
    defineField({
      name: "form",
      title: "Kontaktformular",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Formular-Titel",
          type: "string",
          description: "z.B. 'Nachricht senden'",
        },
        {
          name: "subjectOptions",
          title: "Betreff-Optionen",
          type: "array",
          description: "Auswahlmöglichkeiten im Betreff-Dropdown",
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
          title: "Platzhalter-Texte",
          type: "object",
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
          title: "Button-Text",
          type: "string",
          initialValue: "Nachricht senden",
        },
        {
          name: "successMessage",
          title: "Erfolgsmeldung",
          type: "text",
          rows: 2,
          description: "Wird nach erfolgreicher Absendung angezeigt",
          initialValue: "Vielen Dank für Ihre Nachricht! Ich melde mich innerhalb von 24 Stunden bei Ihnen.",
        },
        {
          name: "privacyText",
          title: "Datenschutz-Hinweis",
          type: "text",
          rows: 2,
          description: "Text unter dem Formular (Link zur Datenschutzerklärung wird automatisch eingefügt)",
          initialValue: "Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäss unserer Datenschutzerklärung zu.",
        },
      ],
    }),
    defineField({
      name: "sidebar",
      title: "Sidebar",
      type: "object",
      fields: [
        {
          name: "contactTitle",
          title: "Kontaktdaten Titel",
          type: "string",
          initialValue: "Kontaktdaten",
        },
        {
          name: "responseTime",
          title: "Antwortzeit-Text",
          type: "string",
          initialValue: "Innerhalb von 24 Stunden",
        },
        {
          name: "whyTitle",
          title: "'Warum emmotion' Titel",
          type: "string",
          initialValue: "Warum emmotion?",
        },
        {
          name: "whyPoints",
          title: "'Warum emmotion' Punkte",
          type: "array",
          of: [{ type: "string" }],
        },
        {
          name: "quickResponseTitle",
          title: "Schnelle Antwort Titel",
          type: "string",
          initialValue: "Schnelle Antwort garantiert",
        },
        {
          name: "quickResponseText",
          title: "Schnelle Antwort Text",
          type: "text",
          rows: 2,
        },
      ],
    }),
    defineField({
      name: "regions",
      title: "Einsatzgebiet",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Titel",
          type: "string",
          initialValue: "Einsatzgebiet",
        },
        {
          name: "subtitle",
          title: "Untertitel",
          type: "text",
          rows: 2,
        },
        {
          name: "regionList",
          title: "Regionen",
          type: "array",
          of: [{ type: "string" }],
          description: "Liste der Regionen, z.B. Rheintal, Liechtenstein, etc.",
        },
        {
          name: "footerText",
          title: "Fussnote",
          type: "string",
          description: "Text unter den Regionen",
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
        title: "Kontakt-Seite",
        subtitle: "Einstellungen für die Kontakt-Seite",
      };
    },
  },
});
