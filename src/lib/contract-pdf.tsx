import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import type { OnboardingFormData, PricingResult } from "./onboarding-logic";
import { SERVICE_LABELS, formatPrice, formatDate } from "./onboarding-logic";

// Register fonts (using standard fonts for now)
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "Helvetica" },
    { src: "Helvetica-Bold", fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
  },
  headerRight: {
    textAlign: "right",
    fontSize: 9,
    color: "#666",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 30,
    textAlign: "center",
    color: "#666",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1a1a1a",
    backgroundColor: "#f3f4f6",
    padding: 6,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: 140,
    color: "#666",
  },
  value: {
    flex: 1,
    color: "#1a1a1a",
  },
  clauseTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 10,
    color: "#1a1a1a",
  },
  clauseText: {
    marginBottom: 8,
    color: "#333",
    textAlign: "justify",
  },
  highlightBox: {
    backgroundColor: "#fef3c7",
    padding: 10,
    marginVertical: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#f59e0b",
  },
  priceTable: {
    marginTop: 10,
  },
  priceRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  priceLabel: {
    flex: 1,
    color: "#666",
  },
  priceValue: {
    width: 100,
    textAlign: "right",
    color: "#1a1a1a",
  },
  totalRow: {
    flexDirection: "row",
    paddingVertical: 8,
    marginTop: 4,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
  },
  totalLabel: {
    flex: 1,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  totalValue: {
    width: 100,
    textAlign: "right",
    fontWeight: "bold",
    color: "#2563eb",
  },
  signatureSection: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  signatureBox: {
    width: "45%",
  },
  signatureLabel: {
    fontSize: 9,
    color: "#666",
    marginBottom: 4,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 40,
    marginBottom: 4,
  },
  signatureImage: {
    height: 60,
    marginBottom: 4,
  },
  signatureName: {
    fontSize: 9,
    color: "#333",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#999",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
});

interface ContractPDFProps {
  formData: OnboardingFormData;
  pricing: PricingResult;
  signatureDataUrl: string;
  signedAt: string;
  contractVersion: string;
  companyInfo?: {
    name: string;
    owner: string;
    address: string;
    email: string;
    phone: string;
    uid?: string;
    bank?: {
      name: string;
      iban: string;
      bic?: string;
    };
  };
  clauses?: {
    preamble?: string;
    scopeOfWork?: string;
    deposit?: string;
    cancellation?: string;
    clientObligations?: string;
    forceMajeure?: string;
    paymentTerms?: string;
    liability?: string;
    usageRights?: string;
    jurisdiction?: string;
  };
  cancellationDays?: number;
}

const DEFAULT_COMPANY_INFO = {
  name: "emmotion.ch",
  owner: "Marcus",
  address: "Rheintal, Schweiz",
  email: "hallo@emmotion.ch",
  phone: "",
  bank: {
    name: "Raiffeisenbank",
    iban: "CH00 0000 0000 0000 0000 0",
    bic: "",
  },
};

const DEFAULT_CLAUSES = {
  preamble:
    "Dieser Vertrag regelt die Zusammenarbeit zwischen dem Auftraggeber und emmotion.ch für die Erstellung von Videoinhalten.",
  scopeOfWork:
    "Der Auftragnehmer erstellt das vereinbarte Video gemäss den in diesem Onboarding erfassten Spezifikationen. Änderungen am Leistungsumfang bedürfen der schriftlichen Vereinbarung und können zu Mehrkosten führen.",
  deposit:
    "Die Anzahlung ist innerhalb von 7 Tagen nach Vertragsunterzeichnung fällig. Die Produktion beginnt erst nach Eingang der Anzahlung.",
  cancellation:
    "Bei Stornierung bis 14 Tage vor dem vereinbarten Drehtermin wird die Anzahlung abzüglich einer Bearbeitungsgebühr von CHF 200 erstattet. Bei Stornierung innerhalb von 14 Tagen vor dem Drehtermin verfällt die Anzahlung. Bei Stornierung am Drehtag oder danach ist die volle Vergütung geschuldet.",
  clientObligations:
    "Der Auftraggeber stellt alle für die Produktion notwendigen Zugänge, Personen und Materialien termingerecht zur Verfügung. Bei Verzögerungen oder Ausfall durch den Auftraggeber (z.B. Nichterscheinen am Drehtag, fehlende Locations, technische Probleme auf Kundenseite) ist die volle Tagesgage fällig.",
  forceMajeure:
    "Bei höherer Gewalt (Naturkatastrophen, behördliche Massnahmen, Pandemie etc.) sind beide Parteien von ihren Verpflichtungen befreit. Bereits erbrachte Leistungen werden vergütet.",
  paymentTerms:
    "Die Restzahlung ist innerhalb von 14 Tagen nach Lieferung des fertigen Videos fällig. Bei Zahlungsverzug werden Verzugszinsen von 5% p.a. berechnet.",
  liability:
    "Die Haftung des Auftragnehmers ist auf den Auftragswert begrenzt. Für indirekte Schäden, entgangenen Gewinn oder Folgeschäden wird keine Haftung übernommen.",
  usageRights:
    "Nach vollständiger Bezahlung erhält der Auftraggeber die uneingeschränkten Nutzungsrechte am erstellten Video für alle Medien und Zwecke. Der Auftragnehmer behält das Recht, das Video zu Referenzzwecken zu verwenden.",
  jurisdiction: "Es gilt Schweizer Recht. Gerichtsstand ist der Sitz des Auftragnehmers.",
};

export function ContractPDF({
  formData,
  pricing,
  signatureDataUrl,
  signedAt,
  contractVersion,
  companyInfo = DEFAULT_COMPANY_INFO,
  clauses = DEFAULT_CLAUSES,
  cancellationDays = 14,
}: ContractPDFProps) {
  const today = new Date(signedAt).toLocaleDateString("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>emmotion.ch</Text>
          <View style={styles.headerRight}>
            <Text>{companyInfo.name}</Text>
            <Text>{companyInfo.address}</Text>
            <Text>{companyInfo.email}</Text>
            {companyInfo.phone && <Text>{companyInfo.phone}</Text>}
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Produktionsvertrag</Text>
        <Text style={styles.subtitle}>
          {SERVICE_LABELS[formData.serviceType]} - Version {contractVersion}
        </Text>

        {/* Parties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vertragsparteien</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Auftragnehmer:</Text>
            <Text style={styles.value}>
              {companyInfo.name}, {companyInfo.owner}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Auftraggeber:</Text>
            <Text style={styles.value}>
              {formData.clientInfo.name}
              {formData.clientInfo.company && ` (${formData.clientInfo.company})`}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Adresse:</Text>
            <Text style={styles.value}>
              {formData.clientInfo.street || "-"}, {formData.clientInfo.zipCity || "-"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>E-Mail:</Text>
            <Text style={styles.value}>{formData.clientInfo.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Telefon:</Text>
            <Text style={styles.value}>{formData.clientInfo.phone}</Text>
          </View>
        </View>

        {/* Project Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projektdetails</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Projektname:</Text>
            <Text style={styles.value}>{formData.projectDetails.projectName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Service:</Text>
            <Text style={styles.value}>{SERVICE_LABELS[formData.serviceType]}</Text>
          </View>
          {formData.projectDetails.shootingDate && (
            <View style={styles.row}>
              <Text style={styles.label}>Drehtermin:</Text>
              <Text style={styles.value}>
                {formatDate(formData.projectDetails.shootingDate)}
              </Text>
            </View>
          )}
          {formData.projectDetails.deadline && (
            <View style={styles.row}>
              <Text style={styles.label}>Deadline:</Text>
              <Text style={styles.value}>
                {formatDate(formData.projectDetails.deadline)}
              </Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Lieferzeit:</Text>
            <Text style={styles.value}>{pricing.estimatedDays} Arbeitstage</Text>
          </View>
          {formData.projectDetails.description && (
            <View style={styles.row}>
              <Text style={styles.label}>Beschreibung:</Text>
              <Text style={styles.value}>{formData.projectDetails.description}</Text>
            </View>
          )}
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preisübersicht</Text>
          <View style={styles.priceTable}>
            {pricing.breakdown.map((item, index) => (
              <View key={index} style={styles.priceRow}>
                <Text style={styles.priceLabel}>{item.item}</Text>
                <Text style={styles.priceValue}>{formatPrice(item.price)}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Gesamtpreis</Text>
              <Text style={styles.totalValue}>{formatPrice(pricing.totalPrice)}</Text>
            </View>
          </View>
        </View>

        {/* Payment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zahlungsplan</Text>
          <View style={styles.row}>
            <Text style={styles.label}>
              Anzahlung ({pricing.depositPercentage}%):
            </Text>
            <Text style={styles.value}>{formatPrice(pricing.depositAmount)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Restzahlung:</Text>
            <Text style={styles.value}>{formatPrice(pricing.remainingAmount)}</Text>
          </View>
          {companyInfo.bank && (
            <>
              <View style={{ marginTop: 8 }}>
                <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                  Bankverbindung:
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Bank:</Text>
                <Text style={styles.value}>{companyInfo.bank.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>IBAN:</Text>
                <Text style={styles.value}>{companyInfo.bank.iban}</Text>
              </View>
            </>
          )}
        </View>

        {/* Footer for page 1 */}
        <Text style={styles.footer}>
          Vertrag erstellt am {today} | emmotion.ch | Seite 1 von 2
        </Text>
      </Page>

      {/* Page 2 - Contract Terms */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Vertragsbedingungen</Text>

        <Text style={styles.clauseTitle}>Präambel</Text>
        <Text style={styles.clauseText}>{clauses.preamble}</Text>

        <Text style={styles.clauseTitle}>§1 Leistungsumfang</Text>
        <Text style={styles.clauseText}>{clauses.scopeOfWork}</Text>

        <Text style={styles.clauseTitle}>§2 Anzahlung</Text>
        <Text style={styles.clauseText}>{clauses.deposit}</Text>

        <View style={styles.highlightBox}>
          <Text style={styles.clauseTitle}>§3 Stornierungsbedingungen</Text>
          <Text style={styles.clauseText}>{clauses.cancellation}</Text>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.clauseTitle}>§4 Mitwirkungspflichten des Auftraggebers</Text>
          <Text style={styles.clauseText}>{clauses.clientObligations}</Text>
        </View>

        <Text style={styles.clauseTitle}>§5 Höhere Gewalt</Text>
        <Text style={styles.clauseText}>{clauses.forceMajeure}</Text>

        <Text style={styles.clauseTitle}>§6 Zahlungsbedingungen</Text>
        <Text style={styles.clauseText}>{clauses.paymentTerms}</Text>

        <Text style={styles.clauseTitle}>§7 Haftung</Text>
        <Text style={styles.clauseText}>{clauses.liability}</Text>

        <Text style={styles.clauseTitle}>§8 Nutzungsrechte</Text>
        <Text style={styles.clauseText}>{clauses.usageRights}</Text>

        <Text style={styles.clauseTitle}>§9 Gerichtsstand</Text>
        <Text style={styles.clauseText}>{clauses.jurisdiction}</Text>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Unterschriften</Text>
          <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>Auftraggeber</Text>
              {signatureDataUrl && (
                <Image src={signatureDataUrl} style={styles.signatureImage} />
              )}
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>
                {formData.clientInfo.name}, {today}
              </Text>
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>Auftragnehmer</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>{companyInfo.owner}, emmotion.ch</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          Vertrag erstellt am {today} | emmotion.ch | Seite 2 von 2
        </Text>
      </Page>
    </Document>
  );
}

export default ContractPDF;
