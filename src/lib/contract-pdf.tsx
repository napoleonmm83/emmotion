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
  darkGray: "#1f1f1f", // Card background
  mediumGray: "#4b4b4b", // Muted text
  lightGray: "#6b6b6b", // Secondary text
  white: "#ffffff", // White
  offWhite: "#f5f5f5", // Light background
  border: "#e5e5e5", // Border color
};

const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
    backgroundColor: "#ffffff",
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  headerLeft: {
    flexDirection: "column",
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
  // Title
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
    color: colors.dark,
  },
  subtitle: {
    fontSize: 11,
    marginBottom: 20,
    textAlign: "center",
    color: colors.lightGray,
  },
  // Hero Summary - NEW PROMINENT SECTION
  heroSummary: {
    backgroundColor: colors.primary,
    padding: 18,
    marginBottom: 20,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroItem: {
    flex: 1,
    alignItems: "center",
  },
  heroLabel: {
    fontSize: 8,
    color: "#ffffff",
    opacity: 0.9,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  heroValueSmall: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  heroSubtext: {
    fontSize: 8,
    color: "#ffffff",
    opacity: 0.8,
    marginTop: 2,
  },
  // Section
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#ffffff",
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 3,
  },
  sectionTitleDark: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#ffffff",
    backgroundColor: colors.dark,
    padding: 8,
    borderRadius: 3,
  },
  // Info Cards
  infoGrid: {
    flexDirection: "row",
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.offWhite,
    padding: 12,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  infoCardTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.primaryDark,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: 70,
    color: colors.lightGray,
    fontSize: 9,
  },
  value: {
    flex: 1,
    color: colors.dark,
    fontSize: 9,
    fontWeight: "bold",
  },
  // Price Section
  priceSection: {
    backgroundColor: colors.offWhite,
    padding: 14,
    borderRadius: 6,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  priceLabel: {
    flex: 1,
    color: colors.mediumGray,
    fontSize: 10,
  },
  priceValue: {
    width: 90,
    textAlign: "right",
    color: colors.dark,
    fontSize: 10,
  },
  discountRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  discountLabel: {
    flex: 1,
    color: "#16a34a",
    fontSize: 10,
  },
  discountValue: {
    width: 90,
    textAlign: "right",
    color: "#16a34a",
    fontSize: 10,
  },
  // Total Row
  totalRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 10,
    backgroundColor: colors.dark,
    borderRadius: 4,
  },
  totalLabel: {
    flex: 1,
    fontWeight: "bold",
    color: "#ffffff",
    fontSize: 12,
  },
  totalValue: {
    width: 100,
    textAlign: "right",
    fontWeight: "bold",
    color: "#ffffff",
    fontSize: 18,
  },
  // Payment Cards
  paymentGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  paymentCard: {
    flex: 1,
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  paymentCardDeposit: {
    backgroundColor: colors.primary,
  },
  paymentCardRemaining: {
    backgroundColor: colors.offWhite,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentCardLabel: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  paymentCardValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  paymentCardNote: {
    fontSize: 8,
    marginTop: 4,
  },
  // Info Box
  infoBox: {
    backgroundColor: "#fef3cd",
    borderLeftWidth: 3,
    borderLeftColor: "#f59e0b",
    padding: 12,
    marginTop: 12,
    borderRadius: 3,
  },
  infoBoxTitle: {
    fontWeight: "bold",
    color: "#92400e",
    fontSize: 10,
    marginBottom: 4,
  },
  infoBoxText: {
    color: "#78350f",
    fontSize: 9,
    lineHeight: 1.5,
  },
  // Contract Terms
  termsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.dark,
    textAlign: "center",
    marginBottom: 18,
    paddingBottom: 10,
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
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
    backgroundColor: "#fef2f2",
    padding: 12,
    marginVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderRadius: 3,
  },
  // Signature Section
  signatureSection: {
    marginTop: 30,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  signatureTitle: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 16,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
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
    height: 50,
    marginBottom: 4,
  },
  signatureName: {
    fontSize: 9,
    color: colors.dark,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 25,
    left: 35,
    right: 35,
    fontSize: 8,
    color: colors.lightGray,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
}: ContractPDFProps) {
  const today = new Date(signedAt).toLocaleDateString("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const serviceName = SERVICE_LABELS[formData.serviceType] || formData.serviceType;

  return (
    <Document>
      {/* Page 1 - Summary & Pricing */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
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
          {serviceName} • Version {contractVersion}
        </Text>

        {/* HERO SUMMARY - Most Important Info */}
        <View style={styles.heroSummary}>
          <View style={styles.heroItem}>
            <Text style={styles.heroLabel}>Gesamtpreis</Text>
            <Text style={styles.heroValue}>{formatPrice(pricing.totalPrice)}</Text>
            <Text style={styles.heroSubtext}>inkl. aller Leistungen</Text>
          </View>
          <View style={styles.heroItem}>
            <Text style={styles.heroLabel}>Anzahlung ({pricing.depositPercentage}%)</Text>
            <Text style={styles.heroValue}>{formatPrice(pricing.depositAmount)}</Text>
            <Text style={styles.heroSubtext}>fällig nach Vertragsabschluss</Text>
          </View>
          <View style={styles.heroItem}>
            <Text style={styles.heroLabel}>Lieferzeit</Text>
            <Text style={styles.heroValueSmall}>{pricing.estimatedDays} Tage</Text>
            <Text style={styles.heroSubtext}>nach Anzahlung</Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.infoGrid}>
          {/* Client Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Auftraggeber</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{formData.clientInfo.name}</Text>
            </View>
            {formData.clientInfo.company && (
              <View style={styles.row}>
                <Text style={styles.label}>Firma:</Text>
                <Text style={styles.value}>{formData.clientInfo.company}</Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={styles.label}>E-Mail:</Text>
              <Text style={styles.value}>{formData.clientInfo.email}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Telefon:</Text>
              <Text style={styles.value}>{formData.clientInfo.phone}</Text>
            </View>
          </View>

          {/* Project Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Projektdetails</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Projekt:</Text>
              <Text style={styles.value}>{formData.projectDetails.projectName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Service:</Text>
              <Text style={styles.value}>{serviceName}</Text>
            </View>
            {formData.projectDetails.shootingDate && (
              <View style={styles.row}>
                <Text style={styles.label}>Drehtermin:</Text>
                <Text style={styles.value}>{formatDate(formData.projectDetails.shootingDate)}</Text>
              </View>
            )}
            {formData.projectDetails.deadline && (
              <View style={styles.row}>
                <Text style={styles.label}>Deadline:</Text>
                <Text style={styles.value}>{formatDate(formData.projectDetails.deadline)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Pricing Section */}
        <View style={[styles.section, { marginTop: 18 }]}>
          <Text style={styles.sectionTitleDark}>Preisübersicht</Text>
          <View style={styles.priceSection}>
            {/* Price Breakdown */}
            {pricing.breakdown.map((item, index) => (
              <View
                key={index}
                style={item.price < 0 ? styles.discountRow : styles.priceRow}
              >
                <Text style={item.price < 0 ? styles.discountLabel : styles.priceLabel}>
                  {item.item}
                </Text>
                <Text style={item.price < 0 ? styles.discountValue : styles.priceValue}>
                  {formatPrice(item.price)}
                </Text>
              </View>
            ))}

            {/* Total */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Gesamtpreis</Text>
              <Text style={styles.totalValue}>{formatPrice(pricing.totalPrice)}</Text>
            </View>

            {/* Payment Cards */}
            <View style={styles.paymentGrid}>
              <View style={[styles.paymentCard, styles.paymentCardDeposit]}>
                <Text style={[styles.paymentCardLabel, { color: "#ffffff", opacity: 0.9 }]}>
                  Anzahlung ({pricing.depositPercentage}%)
                </Text>
                <Text style={[styles.paymentCardValue, { color: "#ffffff" }]}>
                  {formatPrice(pricing.depositAmount)}
                </Text>
                <Text style={[styles.paymentCardNote, { color: "#ffffff", opacity: 0.8 }]}>
                  Fällig innerhalb 7 Tagen
                </Text>
              </View>
              <View style={[styles.paymentCard, styles.paymentCardRemaining]}>
                <Text style={[styles.paymentCardLabel, { color: colors.lightGray }]}>
                  Restzahlung
                </Text>
                <Text style={[styles.paymentCardValue, { color: colors.dark }]}>
                  {formatPrice(pricing.remainingAmount)}
                </Text>
                <Text style={[styles.paymentCardNote, { color: colors.lightGray }]}>
                  Fällig nach Lieferung
                </Text>
              </View>
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Hinweis zur Zahlung</Text>
              <Text style={styles.infoBoxText}>
                Die Anzahlungsrechnung mit allen Zahlungsdetails (IBAN, QR-Code) erhalten Sie separat per E-Mail. Die Produktion beginnt nach Eingang der Anzahlung.
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          Vertrag erstellt am {today} • emmotion.ch • Seite 1 von 2
        </Text>
      </Page>

      {/* Page 2 - Contract Terms */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.termsTitle}>Vertragsbedingungen</Text>

        <Text style={styles.clauseTitle}>Präambel</Text>
        <Text style={styles.clauseText}>{clauses.preamble}</Text>

        <Text style={styles.clauseTitle}>§1 Leistungsumfang</Text>
        <Text style={styles.clauseText}>{clauses.scopeOfWork}</Text>

        <Text style={styles.clauseTitle}>§2 Anzahlung</Text>
        <Text style={styles.clauseText}>{clauses.deposit}</Text>

        <View style={styles.highlightBox}>
          <Text style={[styles.clauseTitle, { color: colors.primaryDark, marginTop: 0 }]}>
            §3 Stornierungsbedingungen
          </Text>
          <Text style={styles.clauseText}>{clauses.cancellation}</Text>
        </View>

        <View style={styles.highlightBox}>
          <Text style={[styles.clauseTitle, { color: colors.primaryDark, marginTop: 0 }]}>
            §4 Mitwirkungspflichten des Auftraggebers
          </Text>
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
          <Text style={styles.signatureTitle}>Unterschriften</Text>
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
          Vertrag erstellt am {today} • emmotion.ch • Seite 2 von 2
        </Text>
      </Page>
    </Document>
  );
}

export default ContractPDF;
