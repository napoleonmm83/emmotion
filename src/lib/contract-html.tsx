import type { OnboardingFormData, PricingResult } from "./onboarding-logic";
import { SERVICE_LABELS, formatPrice, formatDate } from "./onboarding-logic";

export interface ContractHTMLProps {
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

export function generateContractHTML({
  formData,
  pricing,
  signatureDataUrl,
  signedAt,
  contractVersion,
  companyInfo = DEFAULT_COMPANY_INFO,
  clauses = DEFAULT_CLAUSES,
}: ContractHTMLProps): string {
  const today = new Date(signedAt).toLocaleDateString("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const serviceName = SERVICE_LABELS[formData.serviceType] || formData.serviceType;

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Produktionsvertrag - ${formData.projectDetails.projectName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :root {
      --primary: #d41919;
      --primary-dark: #981b1b;
      --dark: #0a0a0a;
      --gray-900: #121212;
      --gray-700: #3a3a3a;
      --gray-500: #6b6b6b;
      --gray-300: #a3a3a3;
      --gray-100: #f5f5f5;
      --white: #ffffff;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 11px;
      line-height: 1.6;
      color: var(--dark);
      background: var(--white);
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm 18mm;
      margin: 0 auto;
      background: var(--white);
      position: relative;
    }

    .page-break {
      page-break-before: always;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 16px;
      border-bottom: 3px solid var(--primary);
      margin-bottom: 24px;
    }

    .logo {
      font-size: 32px;
      font-weight: 700;
      color: var(--primary);
      letter-spacing: 1px;
    }

    .logo-tagline {
      font-size: 10px;
      color: var(--gray-500);
      margin-top: 2px;
    }

    .header-right {
      text-align: right;
      font-size: 10px;
      color: var(--gray-500);
    }

    .header-right strong {
      color: var(--dark);
      display: block;
      margin-bottom: 2px;
    }

    .header-right .uid {
      font-size: 9px;
      margin-top: 4px;
    }

    /* Title */
    .title-section {
      text-align: center;
      margin-bottom: 28px;
    }

    .title {
      font-size: 26px;
      font-weight: 700;
      color: var(--dark);
      margin-bottom: 6px;
    }

    .subtitle {
      font-size: 13px;
      color: var(--gray-500);
    }

    /* Hero Summary - NEW PROMINENT SECTION */
    .hero-summary {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: var(--white);
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 24px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
    }

    .hero-item {
      text-align: center;
    }

    .hero-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.9;
      margin-bottom: 6px;
    }

    .hero-value {
      font-size: 28px;
      font-weight: 700;
    }

    .hero-value.small {
      font-size: 18px;
    }

    .hero-subtext {
      font-size: 10px;
      opacity: 0.8;
      margin-top: 4px;
    }

    /* Section */
    .section {
      margin-bottom: 20px;
    }

    .section-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--white);
      background: var(--primary);
      padding: 8px 12px;
      border-radius: 4px;
      margin-bottom: 12px;
    }

    .section-title.dark {
      background: var(--dark);
    }

    /* Info Grid */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .info-card {
      background: var(--gray-100);
      padding: 16px;
      border-radius: 8px;
      border-left: 4px solid var(--primary);
    }

    .info-card h4 {
      font-size: 11px;
      font-weight: 600;
      color: var(--primary-dark);
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-row {
      display: flex;
      margin-bottom: 6px;
      font-size: 10px;
    }

    .info-label {
      width: 100px;
      color: var(--gray-500);
      flex-shrink: 0;
    }

    .info-value {
      color: var(--dark);
      font-weight: 500;
    }

    /* Price Table - ENHANCED */
    .price-section {
      background: var(--gray-100);
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .price-table {
      width: 100%;
      border-collapse: collapse;
    }

    .price-table th {
      text-align: left;
      font-size: 10px;
      font-weight: 600;
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 8px 0;
      border-bottom: 2px solid var(--gray-300);
    }

    .price-table th:last-child {
      text-align: right;
    }

    .price-table td {
      padding: 10px 0;
      border-bottom: 1px solid #e5e5e5;
      font-size: 11px;
    }

    .price-table td:last-child {
      text-align: right;
      font-weight: 500;
    }

    .price-table .discount td {
      color: #16a34a;
    }

    .price-total {
      background: var(--dark);
      color: var(--white);
      margin-top: 12px;
      padding: 16px 20px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price-total-label {
      font-size: 14px;
      font-weight: 600;
    }

    .price-total-value {
      font-size: 28px;
      font-weight: 700;
    }

    /* Payment Summary - ENHANCED */
    .payment-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 16px;
    }

    .payment-card {
      padding: 20px;
      border-radius: 10px;
      text-align: center;
    }

    .payment-card.deposit {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: var(--white);
    }

    .payment-card.remaining {
      background: var(--gray-100);
      border: 2px solid var(--gray-300);
    }

    .payment-card-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.9;
      margin-bottom: 6px;
    }

    .payment-card-value {
      font-size: 24px;
      font-weight: 700;
    }

    .payment-card-note {
      font-size: 10px;
      margin-top: 6px;
      opacity: 0.8;
    }

    .payment-card.remaining .payment-card-label {
      color: var(--gray-500);
    }

    .payment-card.remaining .payment-card-value {
      color: var(--dark);
    }

    .payment-card.remaining .payment-card-note {
      color: var(--gray-500);
    }

    /* Info Box */
    .info-box {
      background: #fef3cd;
      border-left: 4px solid #f59e0b;
      padding: 14px 16px;
      margin-top: 16px;
      border-radius: 0 8px 8px 0;
    }

    .info-box strong {
      display: block;
      color: #92400e;
      font-size: 11px;
      margin-bottom: 4px;
    }

    .info-box p {
      color: #78350f;
      font-size: 10px;
      line-height: 1.5;
    }

    /* Contract Terms Page */
    .terms-title {
      font-size: 22px;
      font-weight: 700;
      color: var(--dark);
      text-align: center;
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 3px solid var(--primary);
    }

    .clause {
      margin-bottom: 16px;
    }

    .clause-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--dark);
      margin-bottom: 6px;
    }

    .clause-text {
      font-size: 10px;
      color: var(--gray-700);
      line-height: 1.7;
      text-align: justify;
    }

    .clause.highlight {
      background: #fef2f2;
      border-left: 4px solid var(--primary);
      padding: 14px 16px;
      margin: 16px 0;
      border-radius: 0 8px 8px 0;
    }

    .clause.highlight .clause-title {
      color: var(--primary-dark);
    }

    /* Signature Section */
    .signature-section {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid var(--primary);
    }

    .signature-section h3 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .signature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }

    .signature-box {
      text-align: center;
    }

    .signature-label {
      font-size: 10px;
      color: var(--gray-500);
      margin-bottom: 8px;
    }

    .signature-image {
      height: 60px;
      margin-bottom: 8px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .signature-image img {
      max-height: 60px;
      max-width: 200px;
    }

    .signature-line {
      border-bottom: 1px solid var(--dark);
      margin-bottom: 8px;
      padding-bottom: 4px;
      min-height: 50px;
    }

    .signature-name {
      font-size: 10px;
      color: var(--dark);
    }

    /* Footer */
    .footer {
      position: absolute;
      bottom: 15mm;
      left: 18mm;
      right: 18mm;
      text-align: center;
      font-size: 9px;
      color: var(--gray-500);
      padding-top: 12px;
      border-top: 1px solid #e5e5e5;
    }

    /* Print Styles */
    @media print {
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .page {
        margin: 0;
        padding: 15mm;
      }
    }
  </style>
</head>
<body>
  <!-- PAGE 1: Summary & Pricing -->
  <div class="page">
    <!-- Header -->
    <header class="header">
      <div>
        <div class="logo">emmotion</div>
        <div class="logo-tagline">Videoproduktion für Unternehmen</div>
      </div>
      <div class="header-right">
        <strong>${companyInfo.owner}</strong>
        ${companyInfo.address}<br>
        ${companyInfo.email}
        ${companyInfo.phone ? `<br>${companyInfo.phone}` : ""}
        ${companyInfo.uid ? `<div class="uid">${companyInfo.uid}</div>` : ""}
      </div>
    </header>

    <!-- Title -->
    <div class="title-section">
      <h1 class="title">Produktionsvertrag</h1>
      <p class="subtitle">${serviceName} &bull; Version ${contractVersion}</p>
    </div>

    <!-- HERO SUMMARY - Most Important Info -->
    <div class="hero-summary">
      <div class="hero-item">
        <div class="hero-label">Gesamtpreis</div>
        <div class="hero-value">${formatPrice(pricing.totalPrice)}</div>
        <div class="hero-subtext">inkl. aller Leistungen</div>
      </div>
      <div class="hero-item">
        <div class="hero-label">Anzahlung (${pricing.depositPercentage}%)</div>
        <div class="hero-value">${formatPrice(pricing.depositAmount)}</div>
        <div class="hero-subtext">fällig nach Vertragsabschluss</div>
      </div>
      <div class="hero-item">
        <div class="hero-label">Lieferzeit</div>
        <div class="hero-value small">${pricing.estimatedDays} Tage</div>
        <div class="hero-subtext">nach Anzahlung</div>
      </div>
    </div>

    <!-- Parties & Project Info -->
    <div class="info-grid">
      <div class="info-card">
        <h4>Auftraggeber</h4>
        <div class="info-row">
          <span class="info-label">Name:</span>
          <span class="info-value">${formData.clientInfo.name}</span>
        </div>
        ${formData.clientInfo.company ? `
        <div class="info-row">
          <span class="info-label">Firma:</span>
          <span class="info-value">${formData.clientInfo.company}</span>
        </div>` : ""}
        <div class="info-row">
          <span class="info-label">E-Mail:</span>
          <span class="info-value">${formData.clientInfo.email}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Telefon:</span>
          <span class="info-value">${formData.clientInfo.phone}</span>
        </div>
        ${formData.clientInfo.street ? `
        <div class="info-row">
          <span class="info-label">Adresse:</span>
          <span class="info-value">${formData.clientInfo.street}, ${formData.clientInfo.zipCity || ""}</span>
        </div>` : ""}
      </div>

      <div class="info-card">
        <h4>Projektdetails</h4>
        <div class="info-row">
          <span class="info-label">Projekt:</span>
          <span class="info-value">${formData.projectDetails.projectName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Service:</span>
          <span class="info-value">${serviceName}</span>
        </div>
        ${formData.projectDetails.shootingDate ? `
        <div class="info-row">
          <span class="info-label">Drehtermin:</span>
          <span class="info-value">${formatDate(formData.projectDetails.shootingDate)}</span>
        </div>` : ""}
        ${formData.projectDetails.deadline ? `
        <div class="info-row">
          <span class="info-label">Deadline:</span>
          <span class="info-value">${formatDate(formData.projectDetails.deadline)}</span>
        </div>` : ""}
      </div>
    </div>

    <!-- Pricing Section -->
    <div class="section" style="margin-top: 24px;">
      <div class="section-title dark">Preisübersicht</div>
      <div class="price-section">
        <table class="price-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Betrag</th>
            </tr>
          </thead>
          <tbody>
            ${pricing.breakdown
              .map(
                (item) => `
            <tr class="${item.price < 0 ? "discount" : ""}">
              <td>${item.item}</td>
              <td>${formatPrice(item.price)}</td>
            </tr>`
              )
              .join("")}
          </tbody>
        </table>

        <div class="price-total">
          <span class="price-total-label">Gesamtpreis</span>
          <span class="price-total-value">${formatPrice(pricing.totalPrice)}</span>
        </div>

        <!-- Payment Cards -->
        <div class="payment-grid">
          <div class="payment-card deposit">
            <div class="payment-card-label">Anzahlung (${pricing.depositPercentage}%)</div>
            <div class="payment-card-value">${formatPrice(pricing.depositAmount)}</div>
            <div class="payment-card-note">Fällig innerhalb 7 Tagen</div>
          </div>
          <div class="payment-card remaining">
            <div class="payment-card-label">Restzahlung</div>
            <div class="payment-card-value">${formatPrice(pricing.remainingAmount)}</div>
            <div class="payment-card-note">Fällig nach Lieferung</div>
          </div>
        </div>

        <div class="info-box">
          <strong>Hinweis zur Zahlung</strong>
          <p>Die Anzahlungsrechnung mit allen Zahlungsdetails (IBAN, QR-Code) erhalten Sie separat per E-Mail. Die Produktion beginnt nach Eingang der Anzahlung.</p>
        </div>
      </div>
    </div>

    <div class="footer">
      Vertrag erstellt am ${today} &bull; emmotion.ch &bull; Seite 1 von 2
    </div>
  </div>

  <!-- PAGE 2: Contract Terms -->
  <div class="page page-break">
    <h1 class="terms-title">Vertragsbedingungen</h1>

    <div class="clause">
      <h3 class="clause-title">Präambel</h3>
      <p class="clause-text">${clauses.preamble}</p>
    </div>

    <div class="clause">
      <h3 class="clause-title">§1 Leistungsumfang</h3>
      <p class="clause-text">${clauses.scopeOfWork}</p>
    </div>

    <div class="clause">
      <h3 class="clause-title">§2 Anzahlung</h3>
      <p class="clause-text">${clauses.deposit}</p>
    </div>

    <div class="clause highlight">
      <h3 class="clause-title">§3 Stornierungsbedingungen</h3>
      <p class="clause-text">${clauses.cancellation}</p>
    </div>

    <div class="clause highlight">
      <h3 class="clause-title">§4 Mitwirkungspflichten des Auftraggebers</h3>
      <p class="clause-text">${clauses.clientObligations}</p>
    </div>

    <div class="clause">
      <h3 class="clause-title">§5 Höhere Gewalt</h3>
      <p class="clause-text">${clauses.forceMajeure}</p>
    </div>

    <div class="clause">
      <h3 class="clause-title">§6 Zahlungsbedingungen</h3>
      <p class="clause-text">${clauses.paymentTerms}</p>
    </div>

    <div class="clause">
      <h3 class="clause-title">§7 Haftung</h3>
      <p class="clause-text">${clauses.liability}</p>
    </div>

    <div class="clause">
      <h3 class="clause-title">§8 Nutzungsrechte</h3>
      <p class="clause-text">${clauses.usageRights}</p>
    </div>

    <div class="clause">
      <h3 class="clause-title">§9 Gerichtsstand</h3>
      <p class="clause-text">${clauses.jurisdiction}</p>
    </div>

    <!-- Signatures -->
    <div class="signature-section">
      <h3>Unterschriften</h3>
      <div class="signature-grid">
        <div class="signature-box">
          <div class="signature-label">Auftraggeber</div>
          <div class="signature-image">
            ${signatureDataUrl ? `<img src="${signatureDataUrl}" alt="Unterschrift" />` : ""}
          </div>
          <div class="signature-line"></div>
          <div class="signature-name">${formData.clientInfo.name}, ${today}</div>
        </div>
        <div class="signature-box">
          <div class="signature-label">Auftragnehmer</div>
          <div class="signature-image"></div>
          <div class="signature-line"></div>
          <div class="signature-name">${companyInfo.owner}, emmotion.ch</div>
        </div>
      </div>
    </div>

    <div class="footer">
      Vertrag erstellt am ${today} &bull; emmotion.ch &bull; Seite 2 von 2
    </div>
  </div>
</body>
</html>`;
}

export default generateContractHTML;
