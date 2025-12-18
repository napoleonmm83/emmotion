import { defineType, defineField } from "sanity";

export default defineType({
  name: "projectOnboarding",
  title: "Projektanfragen",
  type: "document",
  icon: () => "📋",
  groups: [
    { name: "client", title: "Kundendaten" },
    { name: "project", title: "Projektdetails" },
    { name: "pricing", title: "Preisgestaltung" },
    { name: "contract", title: "Vertrag" },
    { name: "admin", title: "Verwaltung" },
  ],
  fields: [
    // Client Information
    defineField({
      name: "clientInfo",
      title: "Kundendaten",
      type: "object",
      group: "client",
      fields: [
        {
          name: "name",
          type: "string",
          title: "Name",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "company",
          type: "string",
          title: "Firma",
        },
        {
          name: "email",
          type: "string",
          title: "E-Mail",
          validation: (Rule) => Rule.required().email(),
        },
        {
          name: "phone",
          type: "string",
          title: "Telefon",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "street",
          type: "string",
          title: "Strasse & Nr.",
        },
        {
          name: "zipCity",
          type: "string",
          title: "PLZ & Ort",
        },
      ],
    }),

    // Service Selection
    defineField({
      name: "serviceType",
      title: "Leistungsart",
      type: "string",
      group: "project",
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

    // Project Details
    defineField({
      name: "projectDetails",
      title: "Projektdetails",
      type: "object",
      group: "project",
      fields: [
        {
          name: "projectName",
          type: "string",
          title: "Projektname",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "description",
          type: "text",
          title: "Projektbeschreibung",
          rows: 4,
        },
        {
          name: "deadline",
          type: "date",
          title: "Gewünschter Liefertermin",
        },
        {
          name: "shootingDate",
          type: "date",
          title: "Gewünschter Drehtermin",
        },
        {
          name: "budget",
          type: "string",
          title: "Budget-Rahmen",
          options: {
            list: [
              { title: "Bis CHF 2'000", value: "bis-2000" },
              { title: "CHF 2'000 - 5'000", value: "2000-5000" },
              { title: "CHF 5'000 - 10'000", value: "5000-10000" },
              { title: "Über CHF 10'000", value: "ueber-10000" },
            ],
          },
        },
        {
          name: "locations",
          type: "array",
          title: "Drehorte",
          of: [{ type: "string" }],
        },
      ],
    }),

    // Service-Specific Answers (stored as JSON for flexibility)
    defineField({
      name: "serviceSpecificData",
      title: "Service-spezifische Angaben",
      type: "text",
      group: "project",
      description: "JSON-Daten mit service-spezifischen Antworten",
      readOnly: true,
    }),

    // Extras Selection
    defineField({
      name: "extras",
      title: "Zusatzleistungen",
      type: "object",
      group: "project",
      fields: [
        { name: "drone", type: "boolean", title: "Drohnenaufnahmen", initialValue: false },
        { name: "expressDelivery", type: "boolean", title: "Express-Lieferung", initialValue: false },
        { name: "socialCuts", type: "boolean", title: "Social Media Schnitte", initialValue: false },
        { name: "subtitles", type: "boolean", title: "Untertitel", initialValue: false },
        { name: "music", type: "boolean", title: "Premium Musik", initialValue: false },
      ],
    }),

    // Pricing
    defineField({
      name: "pricing",
      title: "Preisgestaltung",
      type: "object",
      group: "pricing",
      fields: [
        {
          name: "estimatedTotal",
          type: "number",
          title: "Geschätzter Gesamtpreis (CHF)",
        },
        {
          name: "depositPercentage",
          type: "number",
          title: "Anzahlung (%)",
        },
        {
          name: "depositAmount",
          type: "number",
          title: "Anzahlung (CHF)",
        },
        {
          name: "remainingAmount",
          type: "number",
          title: "Restbetrag (CHF)",
        },
      ],
    }),

    // Contract
    defineField({
      name: "contract",
      title: "Vertrag",
      type: "object",
      group: "contract",
      fields: [
        {
          name: "signatureDataUrl",
          type: "text",
          title: "Unterschrift (Base64)",
          description: "Canvas-Signatur als Base64 Data-URL",
          readOnly: true,
        },
        {
          name: "signedAt",
          type: "datetime",
          title: "Unterschrieben am",
          readOnly: true,
        },
        {
          name: "ipAddress",
          type: "string",
          title: "IP-Adresse",
          readOnly: true,
        },
        {
          name: "userAgent",
          type: "string",
          title: "Browser/User Agent",
          readOnly: true,
        },
        {
          name: "contractPdfUrl",
          type: "url",
          title: "PDF URL",
          description: "Link zum signierten Vertrag (Vercel Blob)",
          readOnly: true,
        },
        {
          name: "contractVersion",
          type: "string",
          title: "Vertragsversion",
          readOnly: true,
        },
        {
          name: "termsAccepted",
          type: "boolean",
          title: "AGB akzeptiert",
          readOnly: true,
        },
      ],
    }),

    // Status
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "admin",
      options: {
        list: [
          { title: "Entwurf", value: "draft" },
          { title: "Unterschrieben", value: "signed" },
          { title: "Anzahlung ausstehend", value: "pending_deposit" },
          { title: "Anzahlung erhalten", value: "deposit_received" },
          { title: "In Bearbeitung", value: "in_progress" },
          { title: "Abgeschlossen", value: "completed" },
          { title: "Storniert", value: "cancelled" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
    }),

    // Metadata
    defineField({
      name: "submittedAt",
      title: "Eingereicht am",
      type: "datetime",
      group: "admin",
      readOnly: true,
    }),
    defineField({
      name: "emailsSent",
      title: "E-Mails gesendet",
      type: "boolean",
      group: "admin",
      initialValue: false,
      readOnly: true,
    }),
    defineField({
      name: "notes",
      title: "Interne Notizen",
      type: "text",
      group: "admin",
      rows: 4,
    }),

    // Bexio Integration
    defineField({
      name: "bexio",
      title: "Bexio",
      type: "object",
      group: "admin",
      fields: [
        {
          name: "contactId",
          type: "number",
          title: "Kontakt-ID",
          readOnly: true,
        },
        {
          name: "contactIsNew",
          type: "boolean",
          title: "Neuer Kontakt erstellt",
          readOnly: true,
        },
        {
          name: "invoiceId",
          type: "number",
          title: "Rechnungs-ID",
          readOnly: true,
        },
        {
          name: "invoiceNr",
          type: "string",
          title: "Rechnungsnummer",
          readOnly: true,
        },
        {
          name: "invoiceSent",
          type: "boolean",
          title: "Rechnung per E-Mail versendet",
          readOnly: true,
        },
        {
          name: "invoiceIssued",
          type: "boolean",
          title: "Rechnung ausgestellt",
          description: "Rechnung wurde in Bexio als ausgestellt markiert",
          readOnly: true,
        },
      ],
    }),

    // Contract Corrections & Adjustments
    defineField({
      name: "contractAdjustments",
      title: "Vertragsanpassungen",
      type: "object",
      group: "contract",
      description: "Manuelle Anpassungen am Vertrag",
      fields: [
        {
          name: "customPriceItems",
          type: "array",
          title: "Zusätzliche Preispositionen",
          of: [
            {
              type: "object",
              fields: [
                { name: "name", type: "string", title: "Bezeichnung" },
                { name: "price", type: "number", title: "Preis (CHF)" },
                { name: "quantity", type: "number", title: "Menge", initialValue: 1 },
              ],
              preview: {
                select: { name: "name", price: "price", quantity: "quantity" },
                prepare({ name, price, quantity }) {
                  const total = (price || 0) * (quantity || 1);
                  return {
                    title: name || "Position",
                    subtitle: `${quantity || 1}x CHF ${price || 0} = CHF ${total}`,
                  };
                },
              },
            },
          ],
        },
        {
          name: "discount",
          type: "object",
          title: "Rabatt",
          fields: [
            { name: "type", type: "string", title: "Art", options: {
              list: [
                { title: "Prozent", value: "percentage" },
                { title: "Betrag (CHF)", value: "fixed" },
              ],
            }},
            { name: "value", type: "number", title: "Wert" },
            { name: "reason", type: "string", title: "Grund" },
          ],
        },
        {
          name: "enabledOptionalClauses",
          type: "array",
          title: "Aktivierte optionale Klauseln",
          description: "IDs der aktivierten optionalen Klauseln aus der Vertragsvorlage",
          of: [{ type: "string" }],
        },
        {
          name: "customNotes",
          type: "text",
          title: "Zusätzliche Vertragsnotizen",
          rows: 3,
          description: "Erscheint im Vertrag unter 'Besondere Vereinbarungen'",
        },
      ],
    }),

    // Contract Correction History
    defineField({
      name: "corrections",
      title: "Korrekturen",
      type: "array",
      group: "contract",
      description: "Verlauf aller Vertragskorrekturen",
      of: [
        {
          type: "object",
          fields: [
            { name: "correctedAt", type: "datetime", title: "Korrigiert am", readOnly: true },
            { name: "reason", type: "string", title: "Grund der Korrektur" },
            { name: "previousPdfUrl", type: "url", title: "Vorheriges PDF", readOnly: true },
            { name: "newPdfUrl", type: "url", title: "Neues PDF", readOnly: true },
            { name: "correctedBy", type: "string", title: "Korrigiert von" },
            { name: "changesSummary", type: "text", title: "Zusammenfassung der Änderungen", rows: 2 },
          ],
          preview: {
            select: { correctedAt: "correctedAt", reason: "reason", correctedBy: "correctedBy" },
            prepare({ correctedAt, reason, correctedBy }) {
              const date = correctedAt
                ? new Date(correctedAt).toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
                : "";
              return {
                title: reason || "Korrektur",
                subtitle: `${date}${correctedBy ? ` • ${correctedBy}` : ""}`,
              };
            },
          },
        },
      ],
    }),

    // Trigger for contract regeneration
    defineField({
      name: "regenerateContract",
      title: "🔄 Vertrag neu generieren",
      type: "boolean",
      group: "contract",
      description: "Aktivieren um einen neuen Vertrag mit den aktuellen Anpassungen zu generieren. Wird automatisch zurückgesetzt.",
      initialValue: false,
    }),
  ],

  orderings: [
    {
      title: "Neueste zuerst",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
    {
      title: "Nach Status",
      name: "statusAsc",
      by: [{ field: "status", direction: "asc" }],
    },
  ],

  preview: {
    select: {
      clientName: "clientInfo.name",
      company: "clientInfo.company",
      service: "serviceType",
      status: "status",
      submittedAt: "submittedAt",
      projectName: "projectDetails.projectName",
    },
    prepare({ clientName, company, service, status, submittedAt, projectName }) {
      const statusEmoji: Record<string, string> = {
        draft: "📝",
        signed: "✍️",
        pending_deposit: "💳",
        deposit_received: "✅",
        in_progress: "🎬",
        completed: "🏁",
        cancelled: "❌",
      };

      const serviceLabels: Record<string, string> = {
        imagefilm: "Imagefilm",
        eventvideo: "Eventvideo",
        "social-media": "Social Media",
        drohnenaufnahmen: "Drohnen",
        produktvideo: "Produktvideo",
        postproduktion: "Postproduktion",
      };

      const emoji = statusEmoji[status as string] || "📋";
      const serviceLabel = serviceLabels[service as string] || service;
      const dateStr = submittedAt
        ? new Date(submittedAt as string).toLocaleDateString("de-CH")
        : "";

      return {
        title: `${emoji} ${clientName || "Unbekannt"}${company ? ` (${company})` : ""}`,
        subtitle: `${serviceLabel} • ${projectName || "Kein Projektname"} • ${dateStr}`,
      };
    },
  },
});
