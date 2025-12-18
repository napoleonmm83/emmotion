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

// Website colors - Cinematic Red Theme
const colors = {
  primary: "#d41919", // Cinematic red (hsl 0 85% 45%)
  primaryDark: "#981b1b", // Darker red (hsl 0 70% 35%)
  dark: "#0a0a0a", // Near black background
  darkGray: "#121212", // Card background
  mediumGray: "#3a3a3a", // Muted text
  lightGray: "#8c8c8c", // Secondary text
  white: "#f2f2f2", // Foreground text
  border: "#1f1f1f", // Border color
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    letterSpacing: 1,
  },
  logoTagline: {
    fontSize: 9,
    color: colors.lightGray,
    marginTop: 2,
  },
  headerRight: {
    textAlign: "right",
    fontSize: 9,
    color: colors.lightGray,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: colors.dark,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 25,
    textAlign: "center",
    color: colors.lightGray,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#ffffff",
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 2,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
    paddingVertical: 2,
  },
  label: {
    width: 140,
    color: colors.lightGray,
    fontSize: 10,
  },
  value: {
    flex: 1,
    color: colors.dark,
    fontSize: 10,
  },
  clauseTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 12,
    color: colors.dark,
  },
  clauseText: {
    marginBottom: 8,
    color: colors.mediumGray,
    textAlign: "justify",
    fontSize: 9,
    lineHeight: 1.6,
  },
  highlightBox: {
    backgroundColor: "#fef2f2", // Light red tint
    padding: 12,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoBox: {
    backgroundColor: "#f5f5f5", // Neutral light gray
    padding: 12,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.primaryDark,
  },
  priceTable: {
    marginTop: 10,
  },
  priceRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  priceLabel: {
    flex: 1,
    color: colors.lightGray,
  },
  priceValue: {
    width: 100,
    textAlign: "right",
    color: colors.dark,
  },
  totalRow: {
    flexDirection: "row",
    paddingVertical: 10,
    marginTop: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    borderRadius: 2,
  },
  totalLabel: {
    flex: 1,
    fontWeight: "bold",
    color: "#ffffff",
  },
  totalValue: {
    width: 100,
    textAlign: "right",
    fontWeight: "bold",
    color: "#ffffff",
  },
  signatureSection: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
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
    color: colors.lightGray,
    marginBottom: 4,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.dark,
    paddingBottom: 40,
    marginBottom: 4,
  },
  signatureImage: {
    height: 60,
    marginBottom: 4,
  },
  signatureName: {
    fontSize: 9,
    color: colors.dark,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: colors.lightGray,
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
  owner: "Marcus Martini",
  address: "Rheintal, Schweiz",
  email: "marcus@emmotion.ch",
  phone: "",
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
          <View>
            <Text style={styles.logo}>emmotion</Text>
            <Text style={styles.logoTagline}>Videoproduktion für Unternehmen</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={{ fontWeight: "bold", color: colors.dark }}>{companyInfo.owner}</Text>
            <Text>{companyInfo.address}</Text>
            <Text>{companyInfo.email}</Text>
            {companyInfo.phone && <Text>{companyInfo.phone}</Text>}
            {companyInfo.uid && <Text style={{ fontSize: 8, marginTop: 4 }}>{companyInfo.uid}</Text>}
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
          <View style={styles.infoBox}>
            <Text style={{ fontWeight: "bold", marginBottom: 4, color: colors.primaryDark }}>
              Hinweis zur Zahlung
            </Text>
            <Text style={{ fontSize: 9, color: colors.mediumGray, lineHeight: 1.5 }}>
              Die Anzahlungsrechnung mit allen Zahlungsdetails erhalten Sie separat per E-Mail.
              Die Produktion beginnt nach Eingang der Anzahlung.
            </Text>
          </View>
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
