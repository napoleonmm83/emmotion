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
} from "@react-email/components";

interface ContactNotificationEmailProps {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  subjectLabel: string;
  message: string;
}

export function ContactNotificationEmail({
  name,
  email,
  phone,
  company,
  subjectLabel,
  message,
}: ContactNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Neue Kontaktanfrage von {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Neue Kontaktanfrage</Heading>
            <Text style={headerSubtitle}>über emmotion.ch</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            {/* Contact Details */}
            <table style={table}>
              <tbody>
                <tr>
                  <td style={labelCell}>Name:</td>
                  <td style={valueCell}>{name}</td>
                </tr>
                <tr>
                  <td style={labelCell}>E-Mail:</td>
                  <td style={valueCell}>
                    <Link href={`mailto:${email}`} style={link}>
                      {email}
                    </Link>
                  </td>
                </tr>
                {phone && (
                  <tr>
                    <td style={labelCell}>Telefon:</td>
                    <td style={valueCell}>
                      <Link href={`tel:${phone}`} style={link}>
                        {phone}
                      </Link>
                    </td>
                  </tr>
                )}
                {company && (
                  <tr>
                    <td style={labelCell}>Firma:</td>
                    <td style={valueCell}>{company}</td>
                  </tr>
                )}
                <tr>
                  <td style={labelCell}>Betreff:</td>
                  <td style={valueCell}>{subjectLabel}</td>
                </tr>
              </tbody>
            </table>

            <Hr style={hr} />

            {/* Message */}
            <Heading as="h3" style={sectionTitle}>
              Nachricht:
            </Heading>
            <Section style={messageBox}>
              <Text style={messageText}>{message}</Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Diese E-Mail wurde automatisch über das Kontaktformular auf
              emmotion.ch gesendet.
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
  background: "linear-gradient(135deg, #d41919, #ff4444)",
  padding: "30px",
  borderRadius: "12px 12px 0 0",
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
  backgroundColor: "#f9fafb",
  padding: "30px",
  border: "1px solid #e5e7eb",
  borderTop: "none",
};

const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const labelCell = {
  padding: "12px 0",
  borderBottom: "1px solid #e5e7eb",
  fontWeight: "600",
  width: "120px",
  verticalAlign: "top" as const,
  color: "#374151",
};

const valueCell = {
  padding: "12px 0",
  borderBottom: "1px solid #e5e7eb",
  color: "#1f2937",
};

const link = {
  color: "#d41919",
  textDecoration: "none",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const sectionTitle = {
  margin: "0 0 12px 0",
  fontSize: "16px",
  color: "#374151",
  fontWeight: "600",
};

const messageBox = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
};

const messageText = {
  margin: "0",
  whiteSpace: "pre-wrap" as const,
  color: "#1f2937",
  lineHeight: "1.6",
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
};

export default ContactNotificationEmail;
