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

// Use Helvetica (built-in) - reliable across all environments
// Note: Custom fonts like Inter require TTF files hosted locally

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

// Spacing scale for consistent rhythm
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// Font size scale
const fontSize = {
  xs: 8,
  sm: 9,
  base: 10,
  md: 11,
  lg: 12,
  xl: 16,
  xxl: 20,
  hero: 24,
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: fontSize.base,
    fontFamily: "Helvetica",
    lineHeight: 1.6,
    backgroundColor: "#ffffff",
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  headerLeft: {
    flexDirection: "column",
    maxWidth: "55%",
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  logoTagline: {
    fontSize: fontSize.base,
    color: colors.dark,
    fontWeight: "bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  headerRight: {
    textAlign: "right",
    fontSize: fontSize.sm,
    color: colors.mediumGray,
    lineHeight: 1.6,
    maxWidth: "40%",
  },
  // Title
  title: {
    fontSize: fontSize.hero,
    fontWeight: "bold",
    marginBottom: spacing.sm,
    textAlign: "center",
    color: colors.dark,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: fontSize.md,
    marginBottom: spacing.xl,
    textAlign: "center",
    color: colors.lightGray,
  },
  // Hero Summary - Prominent pricing overview
  heroSummary: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroItem: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: spacing.sm,
  },
  heroLabel: {
    fontSize: fontSize.xs,
    color: "#ffffff",
    opacity: 0.9,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
  },
  heroValue: {
    fontSize: fontSize.xxl,
    fontWeight: "bold",
    color: "#ffffff",
  },
  heroValueSmall: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    color: "#ffffff",
  },
  heroSubtext: {
    fontSize: fontSize.xs,
    color: "#ffffff",
    opacity: 0.85,
    marginTop: spacing.sm,
  },
  // Section
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: "bold",
    marginBottom: spacing.md,
    color: "#ffffff",
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: 3,
  },
  sectionTitleDark: {
    fontSize: fontSize.md,
    fontWeight: "bold",
    marginBottom: spacing.md,
    color: "#ffffff",
    backgroundColor: colors.dark,
    padding: spacing.sm,
    borderRadius: 3,
  },
  // Info Cards
  infoGrid: {
    flexDirection: "row",
    gap: spacing.md,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.offWhite,
    padding: spacing.md,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  infoCardTitle: {
    fontSize: fontSize.sm,
    fontWeight: "bold",
    color: colors.primaryDark,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    marginBottom: spacing.xs,
  },
  label: {
    width: 65,
    color: colors.lightGray,
    fontSize: fontSize.sm,
  },
  value: {
    flex: 1,
    color: colors.dark,
    fontSize: fontSize.sm,
    fontWeight: "bold",
  },
  // Price Section
  priceSection: {
    backgroundColor: colors.offWhite,
    padding: spacing.lg,
    borderRadius: 6,
    marginBottom: spacing.md,
  },
  priceRow: {
    flexDirection: "row",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  priceLabel: {
    flex: 1,
    color: colors.mediumGray,
    fontSize: fontSize.base,
  },
  priceValue: {
    width: 90,
    textAlign: "right",
    color: colors.dark,
    fontSize: fontSize.base,
  },
  discountRow: {
    flexDirection: "row",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  discountLabel: {
    flex: 1,
    color: "#16a34a",
    fontSize: fontSize.base,
  },
  discountValue: {
    width: 90,
    textAlign: "right",
    color: "#16a34a",
    fontSize: fontSize.base,
  },
  // Total Row
  totalRow: {
    flexDirection: "row",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.dark,
    borderRadius: 4,
  },
  totalLabel: {
    flex: 1,
    fontWeight: "bold",
    color: "#ffffff",
    fontSize: fontSize.lg,
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
    gap: spacing.md,
    marginTop: spacing.md,
  },
  paymentCard: {
    flex: 1,
    padding: spacing.lg,
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
    fontSize: fontSize.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  paymentCardValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  paymentCardNote: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  // Info Box
  infoBox: {
    backgroundColor: "#fef3cd",
    borderLeftWidth: 3,
    borderLeftColor: "#f59e0b",
    padding: spacing.md,
    marginTop: spacing.md,
    borderRadius: 3,
  },
  infoBoxTitle: {
    fontWeight: "bold",
    color: "#92400e",
    fontSize: fontSize.base,
    marginBottom: spacing.xs,
  },
  infoBoxText: {
    color: "#78350f",
    fontSize: fontSize.sm,
    lineHeight: 1.5,
  },
  // Contract Terms
  termsTitle: {
    fontSize: fontSize.xxl,
    fontWeight: "bold",
    color: colors.dark,
    textAlign: "center",
    marginBottom: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  clauseTitle: {
    fontSize: fontSize.md,
    fontWeight: "bold",
    marginBottom: spacing.xs,
    marginTop: spacing.md,
    color: colors.dark,
  },
  clauseText: {
    marginBottom: spacing.sm,
    color: colors.mediumGray,
    textAlign: "justify",
    fontSize: fontSize.sm,
    lineHeight: 1.6,
  },
  highlightBox: {
    backgroundColor: "#fef2f2",
    padding: spacing.md,
    marginVertical: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderRadius: 3,
  },
  // Signature Section
  signatureSection: {
    marginTop: spacing.xxl,
    paddingTop: spacing.lg,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  signatureTitle: {
    fontWeight: "bold",
    fontSize: fontSize.lg,
    marginBottom: spacing.lg,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg,
  },
  signatureBox: {
    width: "45%",
  },
  signatureLabel: {
    fontSize: fontSize.sm,
    color: colors.lightGray,
    marginBottom: spacing.xs,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.dark,
    paddingBottom: 40,
    marginBottom: spacing.xs,
  },
  signatureImage: {
    height: 50,
    marginBottom: spacing.xs,
  },
  signatureName: {
    fontSize: fontSize.sm,
    color: colors.dark,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: spacing.xl,
    left: 35,
    right: 35,
    fontSize: fontSize.xs,
    color: colors.lightGray,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
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
    tagline?: string;
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
  tagline: "Videoproduktion für Unternehmen",
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
            <Text style={styles.logo}>{companyInfo.name?.replace(".ch", "") || "emmotion"}</Text>
            <Text style={styles.logoTagline}>{companyInfo.tagline || "Videoproduktion für Unternehmen"}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={{ fontWeight: "bold", color: colors.dark }}>{companyInfo.owner}</Text>
            <Text>{companyInfo.address}</Text>
            <Text>{companyInfo.email}</Text>
            {companyInfo.phone && <Text>{companyInfo.phone}</Text>}
            {companyInfo.uid && <Text style={{ fontSize: fontSize.xs, marginTop: spacing.xs }}>{companyInfo.uid}</Text>}
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
        <View style={[styles.section, { marginTop: spacing.xl }]}>
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

            {/* Total Row */}
            <View style={[styles.priceRow, { borderBottomWidth: 0, marginTop: spacing.xs }]}>
              <Text style={[styles.priceLabel, { fontWeight: "bold", color: colors.dark }]}>
                Gesamtpreis
              </Text>
              <Text style={[styles.priceValue, { fontWeight: "bold", fontSize: fontSize.lg }]}>
                {formatPrice(pricing.totalPrice)}
              </Text>
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
