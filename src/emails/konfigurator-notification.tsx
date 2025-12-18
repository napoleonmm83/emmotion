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

interface KonfiguratorNotificationEmailProps {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  videoType: string;
  duration: string;
  complexity: string;
  extras: string[];
  priceMin: number;
  priceMax: number;
  estimatedDays: number;
}

export function KonfiguratorNotificationEmail({
  name,
  email,
  phone,
  message,
  videoType,
  duration,
  complexity,
  extras,
  priceMin,
  priceMax,
  estimatedDays,
}: KonfiguratorNotificationEmailProps) {
  const formatPrice = (price: number) =>
    price.toLocaleString("de-CH", { minimumFractionDigits: 0 });

  return (
    <Html>
      <Head />
      <Preview>Neue Konfigurator-Anfrage von {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Neue Konfigurator-Anfrage</Heading>
            <Text style={headerSubtitle}>über emmotion.ch</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            {/* Contact Details */}
            <Heading as="h2" style={sectionHeading}>
              Kontaktdaten
            </Heading>
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
              </tbody>
            </table>

            <Hr style={hr} />

            {/* Configuration */}
            <Heading as="h2" style={sectionHeading}>
              Konfiguration
            </Heading>
            <Section style={configBox}>
              <table style={table}>
                <tbody>
                  <tr>
                    <td style={configLabel}>Video-Typ:</td>
                    <td style={configValue}>{videoType}</td>
                  </tr>
                  <tr>
                    <td style={configLabel}>Länge:</td>
                    <td style={configValue}>{duration}</td>
                  </tr>
                  <tr>
                    <td style={configLabel}>Umfang:</td>
                    <td style={configValue}>{complexity}</td>
                  </tr>
                </tbody>
              </table>
              {extras.length > 0 && (
                <Section style={extrasSection}>
                  <Text style={extrasTitle}>Extras:</Text>
                  <ul style={extrasList}>
                    {extras.map((extra, index) => (
                      <li key={index} style={extrasItem}>
                        {extra}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
            </Section>

            <Hr style={hr} />

            {/* Price */}
            <Heading as="h2" style={sectionHeading}>
              Preisschätzung
            </Heading>
            <Section style={priceBox}>
              <Text style={priceLabel}>Geschätzter Preis</Text>
              <Text style={priceValue}>
                CHF {formatPrice(priceMin)} – {formatPrice(priceMax)}
              </Text>
              <Text style={deliveryText}>
                Lieferzeit: ca. {estimatedDays} Werktage
              </Text>
            </Section>

            {/* Message */}
            {message && (
              <>
                <Hr style={hr} />
                <Heading as="h2" style={sectionHeading}>
                  Nachricht
                </Heading>
                <Section style={messageBox}>
                  <Text style={messageText}>{message}</Text>
                </Section>
              </>
            )}
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Diese Anfrage wurde über den Video-Konfigurator auf emmotion.ch
              gesendet.
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

const sectionHeading = {
  fontSize: "18px",
  margin: "0 0 15px 0",
  color: "#374151",
  fontWeight: "600",
};

const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const labelCell = {
  padding: "8px 0",
  fontWeight: "600",
  width: "100px",
  color: "#374151",
};

const valueCell = {
  padding: "8px 0",
  color: "#1f2937",
};

const link = {
  color: "#d41919",
  textDecoration: "none",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "25px 0",
};

const configBox = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
};

const configLabel = {
  padding: "8px 0",
  fontWeight: "600",
  color: "#374151",
};

const configValue = {
  padding: "8px 0",
  color: "#1f2937",
};

const extrasSection = {
  marginTop: "15px",
  paddingTop: "15px",
  borderTop: "1px solid #e5e7eb",
};

const extrasTitle = {
  fontWeight: "600",
  margin: "0 0 10px 0",
  color: "#374151",
};

const extrasList = {
  margin: "0",
  paddingLeft: "20px",
};

const extrasItem = {
  color: "#1f2937",
  marginBottom: "5px",
};

const priceBox = {
  background: "linear-gradient(135deg, #d41919, #ff4444)",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center" as const,
};

const priceLabel = {
  color: "rgba(255,255,255,0.9)",
  margin: "0 0 5px 0",
  fontSize: "14px",
};

const priceValue = {
  color: "white",
  margin: "0",
  fontSize: "32px",
  fontWeight: "bold",
};

const deliveryText = {
  color: "rgba(255,255,255,0.9)",
  margin: "10px 0 0 0",
  fontSize: "14px",
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

export default KonfiguratorNotificationEmail;
