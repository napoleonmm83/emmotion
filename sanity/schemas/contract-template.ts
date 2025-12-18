import { defineType, defineField } from "sanity";

export default defineType({
  name: "contractTemplate",
  title: "Vertragsvorlage",
  type: "document",
  icon: () => "📄",
  fields: [
    defineField({
      name: "version",
      title: "Version",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "z.B. 1.0, 1.1, 2.0",
    }),
    defineField({
      name: "isActive",
      title: "Aktiv",
      type: "boolean",
      initialValue: true,
      description: "Nur eine Vorlage kann aktiv sein",
    }),
    defineField({
      name: "lastUpdated",
      title: "Letzte Aktualisierung",
      type: "date",
    }),

    // Company Info (for contract header)
    defineField({
      name: "companyInfo",
      title: "Unternehmensdaten",
      type: "object",
      fields: [
        { name: "name", type: "string", title: "Firmenname", initialValue: "emmotion.ch" },
        { name: "owner", type: "string", title: "Inhaber" },
        { name: "street", type: "string", title: "Strasse & Nr." },
        { name: "zipCity", type: "string", title: "PLZ & Ort" },
        { name: "email", type: "string", title: "E-Mail" },
        { name: "phone", type: "string", title: "Telefon" },
        { name: "website", type: "string", title: "Website", initialValue: "emmotion.ch" },
        { name: "iban", type: "string", title: "IBAN (für Zahlungen)" },
      ],
    }),

    // Contract Clauses
    defineField({
      name: "clauses",
      title: "Vertragsklauseln",
      type: "object",
      fields: [
        {
          name: "preamble",
          type: "text",
          title: "Präambel",
          rows: 4,
          initialValue:
            "Dieser Vertrag regelt die Zusammenarbeit zwischen dem Auftragnehmer und dem Auftraggeber für die nachfolgend beschriebenen Videoproduktionsleistungen.",
        },
        {
          name: "scopeOfWork",
          type: "text",
          title: "§1 Leistungsumfang",
          rows: 6,
          initialValue:
            "Der Auftragnehmer erbringt die im Projektbriefing definierten Videoproduktionsleistungen. Der genaue Leistungsumfang ergibt sich aus den Angaben des Auftraggebers im Projekt-Onboarding und umfasst die dort spezifizierten Leistungen.",
        },
        {
          name: "deposit",
          type: "text",
          title: "§2 Anzahlung",
          rows: 6,
          initialValue:
            "Die vereinbarte Anzahlung ist innerhalb von 7 Tagen nach Vertragsabschluss auf das angegebene Konto zu überweisen. Die Produktion beginnt erst nach Zahlungseingang der Anzahlung.",
        },
        {
          name: "cancellation",
          type: "text",
          title: "§3 Stornierung",
          rows: 8,
          initialValue: `Bei Stornierung durch den Auftraggeber gelten folgende Regelungen:
- Stornierung bis 14 Tage vor Drehbeginn: Rückerstattung der Anzahlung abzüglich CHF 200.- Bearbeitungsgebühr
- Stornierung innerhalb von 14 Tagen vor Drehbeginn: Anzahlung verfällt vollständig
- Stornierung am Drehtag oder danach: Volle Vergütung geschuldet`,
        },
        {
          name: "clientObligations",
          type: "text",
          title: "§4 Mitwirkungspflichten des Auftraggebers",
          rows: 10,
          initialValue: `Der Auftraggeber verpflichtet sich:
- Rechtzeitige Bereitstellung der vereinbarten Drehorte und Zugänge
- Verfügbarkeit aller vereinbarten Personen zum Drehtermin
- Einholung notwendiger Genehmigungen (Drehgenehmigungen, Persönlichkeitsrechte)
- Bereitstellung von vereinbartem Equipment oder Material

Bei Verzug oder Nichterfüllung durch den Auftraggeber:
- Zusätzliche Drehtage werden nach Aufwand berechnet (Tagessatz)
- Der Auftraggeber trägt alle entstehenden Mehrkosten
- Bei Nichterscheinen (No-Show) am Drehtag: Volle Tagesgage ist geschuldet`,
        },
        {
          name: "forceMajeure",
          type: "text",
          title: "§5 Höhere Gewalt",
          rows: 6,
          initialValue:
            "Bei Ereignissen ausserhalb der Kontrolle beider Parteien (Naturkatastrophen, Pandemien, behördliche Anordnungen) sind beide Parteien von der Leistungspflicht befreit. Bereits erbrachte Leistungen werden anteilig vergütet. Eine Neuterminierung erfolgt in gegenseitigem Einvernehmen.",
        },
        {
          name: "scopeChanges",
          type: "text",
          title: "§6 Änderungen des Leistungsumfangs",
          rows: 5,
          initialValue:
            "Änderungen am Leistungsumfang nach Vertragsabschluss müssen schriftlich vereinbart werden. Änderungen können zu Mehrkosten und/oder Verschiebung des Liefertermins führen. Der Auftragnehmer wird den Auftraggeber über allfällige Auswirkungen informieren.",
        },
        {
          name: "paymentTerms",
          type: "text",
          title: "§7 Zahlungsbedingungen",
          rows: 5,
          initialValue:
            "Der Restbetrag ist bei Lieferung des finalen Videos fällig. Zahlungsfrist: 14 Tage. Bei Zahlungsverzug wird ein Verzugszins von 5% p.a. berechnet. Zahlungen erfolgen per Banküberweisung oder TWINT.",
        },
        {
          name: "usageRights",
          type: "text",
          title: "§8 Nutzungsrechte",
          rows: 6,
          initialValue:
            "Mit vollständiger Bezahlung erhält der Auftraggeber das nicht-exklusive, zeitlich und räumlich unbeschränkte Nutzungsrecht am fertigen Videomaterial für die vereinbarten Zwecke. Der Auftragnehmer behält das Recht, das Material zu Referenz- und Portfoliozwecken zu verwenden, sofern nicht anders vereinbart.",
        },
        {
          name: "liability",
          type: "text",
          title: "§9 Haftung",
          rows: 5,
          initialValue:
            "Die Haftung des Auftragnehmers beschränkt sich auf den Auftragswert. Für indirekte Schäden, entgangenen Gewinn oder Folgeschäden wird keine Haftung übernommen. Dies gilt nicht bei Vorsatz oder grober Fahrlässigkeit.",
        },
        {
          name: "confidentiality",
          type: "text",
          title: "§10 Vertraulichkeit",
          rows: 4,
          initialValue:
            "Beide Parteien verpflichten sich, vertrauliche Informationen der jeweils anderen Partei nicht an Dritte weiterzugeben und nur für die Vertragserfüllung zu verwenden.",
        },
        {
          name: "jurisdiction",
          type: "text",
          title: "§11 Gerichtsstand",
          rows: 3,
          initialValue:
            "Es gilt schweizerisches Recht. Gerichtsstand ist der Sitz des Auftragnehmers im Kanton St. Gallen.",
        },
      ],
    }),

    // Deposit Rules
    defineField({
      name: "depositRules",
      title: "Anzahlungsregeln",
      type: "object",
      fields: [
        {
          name: "minPercentage",
          type: "number",
          title: "Minimum (%)",
          initialValue: 20,
          validation: (Rule) => Rule.min(0).max(100),
        },
        {
          name: "maxPercentage",
          type: "number",
          title: "Maximum (%)",
          initialValue: 50,
          validation: (Rule) => Rule.min(0).max(100),
        },
        {
          name: "thresholds",
          type: "array",
          title: "Schwellenwerte",
          description: "Automatische Anzahlung basierend auf Auftragswert",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "upToAmount",
                  type: "number",
                  title: "Bis Betrag (CHF)",
                },
                {
                  name: "depositPercentage",
                  type: "number",
                  title: "Anzahlung (%)",
                },
              ],
              preview: {
                select: { amount: "upToAmount", percentage: "depositPercentage" },
                prepare({ amount, percentage }) {
                  return {
                    title: `Bis CHF ${amount?.toLocaleString("de-CH") || "?"}: ${percentage || "?"}%`,
                  };
                },
              },
            },
          ],
        },
      ],
    }),

    // Cancellation Settings
    defineField({
      name: "cancellationDays",
      title: "Stornierungsfrist (Tage vor Dreh)",
      type: "number",
      initialValue: 14,
      description: "Anzahl Tage vor dem Dreh, ab der die Anzahlung verfällt",
    }),
    defineField({
      name: "cancellationFee",
      title: "Bearbeitungsgebühr bei früher Stornierung (CHF)",
      type: "number",
      initialValue: 200,
    }),
  ],

  preview: {
    select: {
      version: "version",
      isActive: "isActive",
      lastUpdated: "lastUpdated",
    },
    prepare({ version, isActive, lastUpdated }) {
      return {
        title: `Vertragsvorlage v${version || "?"}`,
        subtitle: `${isActive ? "✅ Aktiv" : "⏸️ Inaktiv"} • ${lastUpdated ? new Date(lastUpdated).toLocaleDateString("de-CH") : ""}`,
      };
    },
  },
});
