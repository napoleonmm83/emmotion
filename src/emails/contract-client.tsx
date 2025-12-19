import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";
import { SERVICE_LABELS, formatPrice, type ServiceType } from "@/lib/onboarding-logic";

interface ContractClientEmailProps {
  clientName: string;
  projectName: string;
  serviceType: ServiceType;
  totalPrice: number;
  depositAmount: number;
  depositPercentage: number;
  pdfUrl?: string;
  companyInfo?: {
    name: string;
    owner: string;
    address: string;
    email: string;
    phone: string;
  };
}

export function ContractClientEmail({
  clientName,
  projectName,
  serviceType,
  totalPrice,
  depositAmount,
  depositPercentage,
  pdfUrl,
  companyInfo,
}: ContractClientEmailProps) {
  const serviceLabel = SERVICE_LABELS[serviceType];

  return (
    <Html>
      <Head />
      <Preview>
        Vielen Dank für deine Projektanfrage - {projectName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Vielen Dank für deinen Auftrag!</Heading>
            <Text style={headerSubtitle}>emmotion.ch</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Hallo {clientName},</Text>
            <Text style={paragraph}>
              vielen Dank für dein Vertrauen! Dein Produktionsvertrag wurde
              erfolgreich unterzeichnet. Hier findest du alle wichtigen
              Informationen zu deinem Projekt.
            </Text>

            {/* Project Summary */}
            <Section style={summaryBox}>
              <Heading as="h3" style={sectionTitle}>
                Projektübersicht
              </Heading>
              <table style={table}>
                <tbody>
                  <tr>
                    <td style={labelCell}>Projekt:</td>
                    <td style={valueCell}>{projectName}</td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Service:</td>
                    <td style={valueCell}>{serviceLabel}</td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Gesamtpreis:</td>
                    <td style={valueCell}>{formatPrice(totalPrice)}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Hr style={hr} />

            {/* Payment Info */}
            <Section style={paymentBox}>
              <Heading as="h3" style={sectionTitle}>
                Nächster Schritt: Anzahlung
              </Heading>
              <Text style={paragraph}>
                Um die Produktion zu starten, ist eine Anzahlung von{" "}
                <strong>{formatPrice(depositAmount)}</strong> ({depositPercentage}
                %) erforderlich.
              </Text>
              <Text style={infoText}>
                Die Anzahlungsrechnung mit allen Zahlungsdetails erhältst du
                in Kürze in einer separaten E-Mail. Die Produktion beginnt nach
                Eingang der Anzahlung.
              </Text>
            </Section>

            {/* PDF Download */}
            {pdfUrl && (
              <>
                <Hr style={hr} />
                <Section style={{ textAlign: "center" as const }}>
                  <Text style={paragraph}>
                    Deinen signierten Vertrag kannst du hier herunterladen:
                  </Text>
                  <Button href={pdfUrl} style={button}>
                    Vertrag herunterladen (PDF)
                  </Button>
                </Section>
              </>
            )}

            <Hr style={hr} />

            {/* Next Steps */}
            <Heading as="h3" style={sectionTitle}>
              Wie geht es weiter?
            </Heading>
            <ol style={stepsList}>
              <li style={stepsItem}>
                <strong>Anzahlung überweisen</strong> - Innerhalb von 7 Tagen
              </li>
              <li style={stepsItem}>
                <strong>Zahlungseingang bestätigen</strong> - Ich melde mich bei
                dir
              </li>
              <li style={stepsItem}>
                <strong>Detailplanung</strong> - Wir besprechen Drehtermin und
                Details
              </li>
              <li style={stepsItem}>
                <strong>Produktion</strong> - Der Dreh findet statt
              </li>
              <li style={stepsItem}>
                <strong>Postproduktion</strong> - Schnitt, Farbkorrektur,
                Vertonung
              </li>
              <li style={stepsItem}>
                <strong>Lieferung</strong> - Du erhältst dein fertiges Video
              </li>
            </ol>

            <Hr style={hr} />

            <Text style={paragraph}>
              Bei Fragen stehe ich dir jederzeit zur Verfügung.
            </Text>
            <Text style={paragraph}>
              Herzliche Grüsse,
              <br />
              {companyInfo?.owner || "Marcus"}
              <br />
              <Link href={`mailto:${companyInfo?.email || "marcus@emmotion.ch"}`} style={link}>
                {companyInfo?.email || "marcus@emmotion.ch"}
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              emmotion.ch - Videoproduktion
              <br />
              {companyInfo?.address || "Rheintal, Schweiz"}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0",
  maxWidth: "600px",
};

const header = {
  background: "linear-gradient(135deg, #b91c1c, #dc2626)",
  padding: "30px",
  borderRadius: "12px 12px 0 0",
  textAlign: "center" as const,
};

const headerTitle = {
  color: "white",
  margin: "0",
  fontSize: "24px",
  fontWeight: "bold",
};

const headerSubtitle = {
  color: "rgba(255,255,255,0.9)",
  margin: "10px 0 0 0",
  fontSize: "14px",
};

const content = {
  backgroundColor: "#ffffff",
  padding: "30px",
  border: "1px solid #e5e7eb",
  borderTop: "none",
};

const greeting = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1f2937",
  margin: "0 0 16px 0",
};

const paragraph = {
  color: "#4b5563",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
};

const summaryBox = {
  backgroundColor: "#f3f4f6",
  padding: "20px",
  borderRadius: "8px",
  marginTop: "20px",
};

const paymentBox = {
  backgroundColor: "#fef3c7",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #f59e0b",
};

const sectionTitle = {
  margin: "0 0 12px 0",
  fontSize: "16px",
  color: "#1f2937",
  fontWeight: "600",
};

const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const labelCell = {
  padding: "8px 0",
  color: "#6b7280",
  width: "120px",
  verticalAlign: "top" as const,
};

const valueCell = {
  padding: "8px 0",
  color: "#1f2937",
  fontWeight: "500",
};

const infoText = {
  color: "#92400e",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
  fontStyle: "italic" as const,
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const button = {
  backgroundColor: "#b91c1c",
  color: "white",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "600",
  display: "inline-block",
};

const stepsList = {
  margin: "0",
  padding: "0 0 0 20px",
  color: "#4b5563",
};

const stepsItem = {
  marginBottom: "8px",
  lineHeight: "1.5",
};

const link = {
  color: "#b91c1c",
  textDecoration: "none",
};

const footer = {
  backgroundColor: "#1f2937",
  padding: "20px 30px",
  borderRadius: "0 0 12px 12px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#9ca3af",
  margin: "0",
  fontSize: "14px",
  lineHeight: "1.5",
};

export default ContractClientEmail;
