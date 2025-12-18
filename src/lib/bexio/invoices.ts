// Bexio Invoices Module

import { getBexioClient } from "./client";
import {
  type BexioInvoice,
  type BexioInvoiceCreate,
  type BexioInvoicePosition,
  type BexioSendEmail,
  BEXIO_CURRENCY_CHF,
  BEXIO_LANGUAGE_GERMAN,
} from "./types";

interface CreateInvoiceParams {
  contactId: number;
  title: string;
  positions: Array<{
    text: string;
    amount: number;
    unitPrice: number;
    taxIncluded?: boolean;
  }>;
  header?: string;
  footer?: string;
  dueInDays?: number; // Default 30 days
  isDeposit?: boolean;
  projectName?: string;
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Create an invoice in Bexio
 */
/**
 * Fetch available tax rates from Bexio
 */
async function fetchTaxRates(): Promise<Array<{ id: number; value: string; name: string }>> {
  const client = getBexioClient();
  try {
    const taxes = await client.get<Array<{ id: number; value: string; name: string; is_active: boolean }>>("/tax");
    console.log("Available Bexio tax rates:", taxes.map(t => `${t.id}: ${t.value}% (${t.name})`).join(", "));
    return taxes.filter(t => t.is_active);
  } catch (error) {
    console.error("Error fetching tax rates:", error);
    return [];
  }
}

/**
 * Get a valid tax ID from Bexio
 */
async function getValidTaxId(): Promise<number | undefined> {
  // First try env var
  if (process.env.BEXIO_TAX_ID) {
    return parseInt(process.env.BEXIO_TAX_ID, 10);
  }

  // Fetch from API and find 0% or lowest rate
  const taxes = await fetchTaxRates();
  if (taxes.length > 0) {
    // Prefer 0% tax rate
    const noTax = taxes.find(t => t.value === "0" || t.value === "0.0" || t.value === "0.00");
    if (noTax) return noTax.id;
    // Otherwise return first active rate
    return taxes[0].id;
  }

  return undefined;
}

export async function createInvoice(
  params: CreateInvoiceParams
): Promise<BexioInvoice> {
  const client = getBexioClient();

  // user_id is REQUIRED by Bexio API
  const userId = parseInt(process.env.BEXIO_USER_ID || "1", 10);

  // Get optional settings from env or use defaults
  const bankAccountId = process.env.BEXIO_BANK_ACCOUNT_ID
    ? parseInt(process.env.BEXIO_BANK_ACCOUNT_ID, 10)
    : undefined;

  // Get valid tax ID (fetch from API if not in env)
  const taxId = await getValidTaxId();

  if (!taxId) {
    console.warn("No valid tax_id found - invoice creation may fail");
  }

  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + (params.dueInDays || 30));

  // Build positions - tax_id is REQUIRED by Bexio API
  const positions: BexioInvoicePosition[] = params.positions.map((pos) => ({
    type: "KbPositionCustom" as const,
    amount: pos.amount.toString(),
    unit_price: pos.unitPrice.toFixed(2),
    text: pos.text,
    tax_id: taxId,
  }));

  // Build header text
  const headerText =
    params.header ||
    (params.isDeposit
      ? `Anzahlung für: ${params.projectName || params.title}`
      : `Vielen Dank für Ihren Auftrag.`);

  // Build footer text
  const footerText =
    params.footer ||
    `Zahlbar innert ${params.dueInDays || 30} Tagen netto.\n\nBei Fragen stehe ich Ihnen gerne zur Verfügung.\n\nFreundliche Grüsse\nMarcus Martini\nemmotion.ch`;

  // Build invoice data
  // Note: kb_item_status_id is NOT allowed as input field (read-only)
  const invoiceData: Record<string, unknown> = {
    title: params.title,
    contact_id: params.contactId,
    user_id: userId,
    language_id: BEXIO_LANGUAGE_GERMAN,
    currency_id: BEXIO_CURRENCY_CHF,
    mwst_type: 0, // inkl. MwSt
    mwst_is_net: false,
    show_position_taxes: true,
    is_valid_from: formatDate(today),
    is_valid_to: formatDate(dueDate),
    header: headerText,
    footer: footerText,
    positions,
  };

  // Only add bank_account_id if explicitly set in env
  if (bankAccountId) {
    invoiceData.bank_account_id = bankAccountId;
  }

  console.log("Creating Bexio invoice with data:", JSON.stringify(invoiceData, null, 2));

  const invoice = await client.post<BexioInvoice>("/kb_invoice", invoiceData);
  return invoice;
}

/**
 * Create a deposit invoice for a project
 */
export async function createDepositInvoice(params: {
  contactId: number;
  projectName: string;
  serviceName: string;
  totalAmount: number;
  depositAmount: number;
  depositPercentage: number;
}): Promise<BexioInvoice> {
  const depositText = `Anzahlung (${params.depositPercentage}%) für ${params.serviceName}`;

  return createInvoice({
    contactId: params.contactId,
    title: `Anzahlung - ${params.projectName}`,
    projectName: params.projectName,
    isDeposit: true,
    positions: [
      {
        text: depositText,
        amount: 1,
        unitPrice: params.depositAmount,
      },
    ],
    header: `Anzahlungsrechnung für Ihr Videoprojekt:\n${params.projectName}\n\nLeistung: ${params.serviceName}\nGesamtbetrag: CHF ${params.totalAmount.toFixed(2)}\nAnzahlung (${params.depositPercentage}%): CHF ${params.depositAmount.toFixed(2)}`,
    footer: `Zahlbar innert 10 Tagen.\n\nDie Restrechnung über CHF ${(params.totalAmount - params.depositAmount).toFixed(2)} erfolgt nach Projektabschluss.\n\nVielen Dank für Ihr Vertrauen.\n\nMarcus Martini\nemmotion.ch`,
    dueInDays: 10,
  });
}

/**
 * Get an invoice by ID
 */
export async function getInvoice(invoiceId: number): Promise<BexioInvoice> {
  const client = getBexioClient();
  return client.get<BexioInvoice>(`/kb_invoice/${invoiceId}`);
}

/**
 * Get invoice PDF URL
 */
export async function getInvoicePdfUrl(
  invoiceId: number
): Promise<{ name: string; size: number; mime: string; content: string }> {
  const client = getBexioClient();
  return client.get(`/kb_invoice/${invoiceId}/pdf`);
}

/**
 * Send invoice by email via Bexio
 * Falls back to marking as issued if email sending fails
 */
export async function sendInvoiceByEmail(
  invoiceId: number,
  params: {
    recipientEmail: string;
    subject?: string;
    message?: string;
  }
): Promise<{ sent: boolean; issued: boolean }> {
  const client = getBexioClient();

  const emailData: BexioSendEmail = {
    recipient_email: params.recipientEmail,
    subject:
      params.subject || `Ihre Rechnung von emmotion.ch`,
    message:
      params.message ||
      `Guten Tag

Anbei erhalten Sie Ihre Rechnung.

Bei Fragen stehe ich Ihnen gerne zur Verfügung.

Freundliche Grüsse
Marcus Martini
emmotion.ch`,
    mark_as_open: true,
  };

  // Try to send via email
  try {
    await client.post(`/kb_invoice/${invoiceId}/send`, emailData);
    console.log(`Invoice ${invoiceId} sent via Bexio email`);
    return { sent: true, issued: true };
  } catch (sendError) {
    console.warn("Bexio /send endpoint failed, trying /issue instead:", sendError);

    // Fall back to just marking as issued
    try {
      await client.post(`/kb_invoice/${invoiceId}/issue`);
      console.log(`Invoice ${invoiceId} marked as issued (email not sent via Bexio)`);
      return { sent: false, issued: true };
    } catch (issueError) {
      console.error("Both /send and /issue failed:", issueError);
      return { sent: false, issued: false };
    }
  }
}

/**
 * Mark invoice as sent (without actually sending email)
 */
export async function markInvoiceAsSent(invoiceId: number): Promise<boolean> {
  const client = getBexioClient();

  try {
    await client.post(`/kb_invoice/${invoiceId}/issue`);
    return true;
  } catch (error) {
    console.error("Error marking invoice as sent:", error);
    return false;
  }
}
