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
import {
  SERVICE_LABELS,
  formatPrice,
  formatDate,
  type OnboardingFormData,
  type PricingResult,
} from "@/lib/onboarding-logic";

interface ContractOwnerEmailProps {
  formData: OnboardingFormData;
  pricing: PricingResult;
  pdfUrl?: string;
  sanityDocId?: string;
  signedAt: string;
}

export function ContractOwnerEmail({
  formData,
  pricing,
  pdfUrl,
  signedAt,
}: ContractOwnerEmailProps) {
  const serviceLabel = SERVICE_LABELS[formData.serviceType];

  return (
    <Html>
      <Head />
      <Preview>
        Neue Projektanfrage: {formData.projectDetails.projectName} (
        {formatPrice(pricing.totalPrice)})
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Neue Projektanfrage!</Heading>
            <Text style={headerSubtitle}>
              {serviceLabel} - {formatPrice(pricing.totalPrice)}
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            {/* Quick Summary */}
            <Section style={highlightBox}>
              <table style={table}>
                <tbody>
                  <tr>
                    <td style={highlightLabel}>Kunde:</td>
                    <td style={highlightValue}>
                      {formData.clientInfo.name}
                      {formData.clientInfo.company &&
                        ` (${formData.clientInfo.company})`}
                    </td>
                  </tr>
                  <tr>
                    <td style={highlightLabel}>Projekt:</td>
                    <td style={highlightValue}>
                      {formData.projectDetails.projectName}
                    </td>
                  </tr>
                  <tr>
                    <td style={highlightLabel}>Gesamtpreis:</td>
                    <td style={highlightValue}>
                      <strong style={{ color: "#b91c1c" }}>
                        {formatPrice(pricing.totalPrice)}
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td style={highlightLabel}>Anzahlung:</td>
                    <td style={highlightValue}>
                      {formatPrice(pricing.depositAmount)} (
                      {pricing.depositPercentage}%)
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Action Buttons */}
            {pdfUrl && (
              <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
                <Button href={pdfUrl} style={buttonPrimary}>
                  Vertrag herunterladen
                </Button>
              </Section>
            )}

            <Hr style={hr} />

            {/* Client Info */}
            <Heading as="h3" style={sectionTitle}>
              Kundendaten
            </Heading>
            <table style={table}>
              <tbody>
                <tr>
                  <td style={labelCell}>Name:</td>
                  <td style={valueCell}>{formData.clientInfo.name}</td>
                </tr>
                {formData.clientInfo.company && (
                  <tr>
                    <td style={labelCell}>Firma:</td>
                    <td style={valueCell}>{formData.clientInfo.company}</td>
                  </tr>
                )}
                <tr>
                  <td style={labelCell}>E-Mail:</td>
                  <td style={valueCell}>
                    <Link
                      href={`mailto:${formData.clientInfo.email}`}
                      style={link}
                    >
                      {formData.clientInfo.email}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td style={labelCell}>Telefon:</td>
                  <td style={valueCell}>
                    <Link
                      href={`tel:${formData.clientInfo.phone}`}
                      style={link}
                    >
                      {formData.clientInfo.phone}
                    </Link>
                  </td>
                </tr>
                {formData.clientInfo.street && (
                  <tr>
                    <td style={labelCell}>Adresse:</td>
                    <td style={valueCell}>
                      {formData.clientInfo.street},{" "}
                      {formData.clientInfo.zipCity}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <Hr style={hr} />

            {/* Project Details */}
            <Heading as="h3" style={sectionTitle}>
              Projektdetails
            </Heading>
            <table style={table}>
              <tbody>
                <tr>
                  <td style={labelCell}>Service:</td>
                  <td style={valueCell}>{serviceLabel}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Projektname:</td>
                  <td style={valueCell}>
                    {formData.projectDetails.projectName}
                  </td>
                </tr>
                {formData.projectDetails.shootingDate && (
                  <tr>
                    <td style={labelCell}>Drehtermin:</td>
                    <td style={valueCell}>
                      {formatDate(formData.projectDetails.shootingDate)}
                    </td>
                  </tr>
                )}
                {formData.projectDetails.deadline && (
                  <tr>
                    <td style={labelCell}>Deadline:</td>
                    <td style={valueCell}>
                      {formatDate(formData.projectDetails.deadline)}
                    </td>
                  </tr>
                )}
                {formData.projectDetails.locations &&
                  formData.projectDetails.locations.length > 0 && (
                    <tr>
                      <td style={labelCell}>Drehorte:</td>
                      <td style={valueCell}>
                        {formData.projectDetails.locations.join(", ")}
                      </td>
                    </tr>
                  )}
                <tr>
                  <td style={labelCell}>Lieferzeit:</td>
                  <td style={valueCell}>{pricing.estimatedDays} Arbeitstage</td>
                </tr>
              </tbody>
            </table>

            {formData.projectDetails.description && (
              <Section style={descriptionBox}>
                <Text style={descriptionLabel}>Projektbeschreibung:</Text>
                <Text style={descriptionText}>
                  {formData.projectDetails.description}
                </Text>
              </Section>
            )}

            <Hr style={hr} />

            {/* Pricing Breakdown */}
            <Heading as="h3" style={sectionTitle}>
              Preisaufstellung
            </Heading>
            <table style={priceTable}>
              <tbody>
                {pricing.breakdown.map((item, index) => (
                  <tr key={index}>
                    <td style={priceLabel}>{item.item}</td>
                    <td style={priceValue}>{formatPrice(item.price)}</td>
                  </tr>
                ))}
                <tr style={totalRow}>
                  <td style={totalLabel}>Gesamtpreis</td>
                  <td style={totalValue}>{formatPrice(pricing.totalPrice)}</td>
                </tr>
              </tbody>
            </table>

            {/* Extras */}
            {Object.entries(formData.extras).some(([, v]) => v) && (
              <>
                <Hr style={hr} />
                <Heading as="h3" style={sectionTitle}>
                  Gewählte Extras
                </Heading>
                <ul style={extrasList}>
                  {formData.extras.drone && <li>Drohnenaufnahmen</li>}
                  {formData.extras.expressDelivery && <li>Express-Lieferung</li>}
                  {formData.extras.socialCuts && <li>Social Media Schnitte</li>}
                  {formData.extras.subtitles && <li>Untertitel</li>}
                  {formData.extras.music && <li>Premium Musik</li>}
                </ul>
              </>
            )}

            <Hr style={hr} />

            {/* Meta Info */}
            <Text style={metaText}>
              Unterzeichnet am:{" "}
              {new Date(signedAt).toLocaleString("de-CH", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Diese E-Mail wurde automatisch generiert.
              <br />
              Projekt-Onboarding auf emmotion.ch
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
  fontSize: "16px",
};

const content = {
  backgroundColor: "#ffffff",
  padding: "30px",
  border: "1px solid #e5e7eb",
  borderTop: "none",
};

const highlightBox = {
  backgroundColor: "#fef2f2",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #dc2626",
};

const highlightLabel = {
  padding: "6px 0",
  color: "#7f1d1d",
  width: "100px",
};

const highlightValue = {
  padding: "6px 0",
  color: "#1f2937",
  fontWeight: "500",
};

const buttonPrimary = {
  backgroundColor: "#b91c1c",
  color: "white",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "600",
  display: "inline-block",
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
  borderBottom: "1px solid #f3f4f6",
  color: "#6b7280",
  width: "120px",
  verticalAlign: "top" as const,
};

const valueCell = {
  padding: "8px 0",
  borderBottom: "1px solid #f3f4f6",
  color: "#1f2937",
};

const link = {
  color: "#b91c1c",
  textDecoration: "none",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const descriptionBox = {
  backgroundColor: "#f9fafb",
  padding: "16px",
  borderRadius: "8px",
  marginTop: "16px",
};

const descriptionLabel = {
  margin: "0 0 8px 0",
  color: "#6b7280",
  fontSize: "14px",
};

const descriptionText = {
  margin: "0",
  color: "#1f2937",
  whiteSpace: "pre-wrap" as const,
  lineHeight: "1.5",
};

const priceTable = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const priceLabel = {
  padding: "8px 0",
  borderBottom: "1px solid #f3f4f6",
  color: "#6b7280",
};

const priceValue = {
  padding: "8px 0",
  borderBottom: "1px solid #f3f4f6",
  color: "#1f2937",
  textAlign: "right" as const,
  width: "100px",
};

const totalRow = {
  backgroundColor: "#f3f4f6",
};

const totalLabel = {
  padding: "12px 8px",
  fontWeight: "600",
  color: "#1f2937",
};

const totalValue = {
  padding: "12px 8px",
  fontWeight: "600",
  color: "#b91c1c",
  textAlign: "right" as const,
};

const extrasList = {
  margin: "0",
  padding: "0 0 0 20px",
  color: "#4b5563",
};

const metaText = {
  color: "#9ca3af",
  fontSize: "12px",
  margin: "0",
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

export default ContractOwnerEmail;
