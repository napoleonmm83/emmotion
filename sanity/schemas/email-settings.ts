import { defineType, defineField } from "sanity";
import { EmailTestButton } from "../components/EmailTestButton";

export default defineType({
  name: "emailSettings",
  title: "E-Mail Einstellungen",
  type: "document",
  icon: () => "✉️",
  initialValue: {
    enabled: false,
    recipientEmail: "hallo@emmotion.ch",
    senderEmail: "noreply@emmotion.ch",
    senderName: "emmotion.ch",
    subjectPrefix: "[emmotion.ch]",
  },
  fields: [
    defineField({
      name: "enabled",
      title: "E-Mail-Versand aktiviert",
      type: "boolean",
      description: "Wenn deaktiviert, werden Anfragen nur in Sanity gespeichert (kein E-Mail-Versand)",
      initialValue: false,
    }),
    defineField({
      name: "recipientEmail",
      title: "Empfänger E-Mail",
      type: "string",
      description: "An diese Adresse werden Kontaktanfragen gesendet",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "senderEmail",
      title: "Absender E-Mail",
      type: "string",
      description: "Diese Adresse wird als Absender angezeigt (muss bei Resend verifiziert sein)",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "senderName",
      title: "Absender-Name",
      type: "string",
      description: "Name der in der E-Mail als Absender angezeigt wird",
    }),
    defineField({
      name: "subjectPrefix",
      title: "Betreff-Präfix",
      type: "string",
      description: "Wird vor den Betreff gesetzt, z.B. '[emmotion.ch]'",
    }),
    defineField({
      name: "testEmail",
      title: "Test-E-Mail",
      type: "object",
      description: "Test-E-Mail senden um die Konfiguration zu prüfen",
      fields: [
        {
          name: "testRecipient",
          title: "Test-Empfänger",
          type: "string",
          description: "E-Mail-Adresse für den Test (leer = Empfänger-E-Mail)",
          validation: (Rule) => Rule.email(),
        },
        {
          name: "testButton",
          title: "Test senden",
          type: "string",
          components: {
            input: EmailTestButton,
          },
        },
        {
          name: "lastTestResult",
          title: "Letztes Testergebnis",
          type: "text",
          readOnly: true,
          description: "Ergebnis des letzten Tests",
        },
        {
          name: "lastTestDate",
          title: "Letzter Test",
          type: "datetime",
          readOnly: true,
        },
      ],
    }),
  ],
  preview: {
    select: {
      enabled: "enabled",
      recipient: "recipientEmail",
    },
    prepare({ enabled, recipient }) {
      return {
        title: "E-Mail Einstellungen",
        subtitle: enabled ? `Aktiv → ${recipient}` : "Deaktiviert",
      };
    },
  },
});
