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
    senderName: "emmotion.ch",
    subjectPrefix: "[emmotion.ch]",
    smtp: {
      host: "",
      port: 587,
      secure: false,
    },
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
      validation: (Rule) => Rule.email(),
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
      name: "smtp",
      title: "SMTP-Einstellungen",
      type: "object",
      description: "Server-Einstellungen für den E-Mail-Versand",
      fields: [
        {
          name: "host",
          title: "SMTP Host",
          type: "string",
          description: "z.B. smtp.gmail.com oder mail.infomaniak.com",
        },
        {
          name: "port",
          title: "SMTP Port",
          type: "number",
          description: "Meist 587 (TLS) oder 465 (SSL)",
          initialValue: 587,
        },
        {
          name: "secure",
          title: "SSL/TLS verwenden",
          type: "boolean",
          description: "Aktivieren für Port 465, deaktivieren für Port 587",
          initialValue: false,
        },
        {
          name: "user",
          title: "SMTP Benutzername",
          type: "string",
          description: "Meist die E-Mail-Adresse",
        },
        {
          name: "password",
          title: "SMTP Passwort",
          type: "string",
          description: "App-Passwort oder SMTP-Passwort",
        },
      ],
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
