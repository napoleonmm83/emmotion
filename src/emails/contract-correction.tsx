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

interface ContractCorrectionEmailProps {
  clientName: string;
  projectName: string;
  pdfUrl: string;
  companyInfo?: {
    name: string;
    owner: string;
    address: string;
    email: string;
    phone: string;
  };
}

export function ContractCorrectionEmail({
  clientName,
  projectName,
  pdfUrl,
  companyInfo,
}: ContractCorrectionEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Aktualisierter Vertrag - {projectName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Vertrag aktualisiert</Heading>
            <Text style={headerSubtitle}>emmotion.ch</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Hallo {clientName},</Text>
            <Text style={paragraph}>
              Ihr Vertrag für das Projekt <strong>"{projectName}"</strong> wurde
              aktualisiert. Die Änderungen wurden in einem neuen Dokument
              zusammengefasst.
            </Text>

            {/* Download Button */}
            <Section style={{ textAlign: "center" as const, marginTop: 24, marginBottom: 24 }}>
              <Button href={pdfUrl} style={button}>
                Aktualisierten Vertrag herunterladen
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={paragraph}>
              Bitte prüfen Sie die Änderungen. Falls Sie Fragen haben oder
              weitere Anpassungen benötigen, stehe ich Ihnen gerne zur Verfügung.
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

// Styles - matching the main email template
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
  background: "linear-gradient(135deg, #d41919, #981b1b)",
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

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const button = {
  backgroundColor: "#d41919",
  color: "white",
  padding: "14px 28px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "600",
  display: "inline-block",
};

const link = {
  color: "#d41919",
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

export default ContractCorrectionEmail;
