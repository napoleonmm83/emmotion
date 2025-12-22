// Bexio Settings Module
// Fetch account settings like bank accounts, payment types, tax rates

import { getBexioClient } from "./client";

export interface BexioBankAccount {
  id: number;
  name: string;
  owner: string;
  iban?: string;
  account_no?: string;
  bc_nr?: string;
  currency_id: number;
  is_active: boolean;
  remarks?: string;
}

export interface BexioPaymentType {
  id: number;
  name: string;
}

export interface BexioTax {
  id: number;
  uuid: string;
  name: string;
  code?: string;
  digit?: string;
  type?: string;
  account_id?: number;
  tax_settlement_type?: string;
  value: string; // percentage as string like "8.1"
  net_tax_value?: string;
  start_year?: number;
  end_year?: number;
  is_active: boolean;
}

/**
 * Get all bank accounts
 */
export async function getBankAccounts(): Promise<BexioBankAccount[]> {
  const client = getBexioClient();
  return client.get<BexioBankAccount[]>("/banking/accounts");
}

/**
 * Get the first active bank account (default)
 */
export async function getDefaultBankAccount(): Promise<BexioBankAccount | null> {
  try {
    const accounts = await getBankAccounts();
    const activeAccount = accounts.find((a) => a.is_active);
    return activeAccount || accounts[0] || null;
  } catch {
    return null;
  }
}

/**
 * Get all payment types
 */
export async function getPaymentTypes(): Promise<BexioPaymentType[]> {
  const client = getBexioClient();
  return client.get<BexioPaymentType[]>("/payment_type");
}

/**
 * Get the first payment type (default, usually "Überweisung")
 */
export async function getDefaultPaymentType(): Promise<BexioPaymentType | null> {
  try {
    const types = await getPaymentTypes();
    return types[0] || null;
  } catch {
    return null;
  }
}

/**
 * Get all tax rates
 */
export async function getTaxRates(): Promise<BexioTax[]> {
  const client = getBexioClient();
  return client.get<BexioTax[]>("/tax");
}

/**
 * Get active Swiss standard VAT rate (8.1%)
 */
export async function getStandardTaxRate(): Promise<BexioTax | null> {
  try {
    const taxes = await getTaxRates();
    // Look for active 8.1% rate
    const standardRate = taxes.find(
      (t) => t.is_active && t.value === "8.1"
    );
    return standardRate || taxes.find((t) => t.is_active) || null;
  } catch {
    return null;
  }
}

// Cache for settings to avoid repeated API calls
let cachedSettings: {
  bankAccountId: number | null;
  paymentTypeId: number | null;
  taxId: number | null;
  fetchedAt: number;
} | null = null;

const CACHE_TTL = 1000 * 60 * 60; // 1 hour

/**
 * Get default settings for invoice creation (cached)
 */
export async function getInvoiceDefaults(): Promise<{
  bankAccountId: number | null;
  paymentTypeId: number | null;
  taxId: number | null;
}> {
  // Return cached values if still valid
  if (cachedSettings && Date.now() - cachedSettings.fetchedAt < CACHE_TTL) {
    return {
      bankAccountId: cachedSettings.bankAccountId,
      paymentTypeId: cachedSettings.paymentTypeId,
      taxId: cachedSettings.taxId,
    };
  }

  // Fetch all settings in parallel
  const [bankAccount, paymentType, taxRate] = await Promise.all([
    getDefaultBankAccount(),
    getDefaultPaymentType(),
    getStandardTaxRate(),
  ]);

  cachedSettings = {
    bankAccountId: bankAccount?.id || null,
    paymentTypeId: paymentType?.id || null,
    taxId: taxRate?.id || null,
    fetchedAt: Date.now(),
  };

  return {
    bankAccountId: cachedSettings.bankAccountId,
    paymentTypeId: cachedSettings.paymentTypeId,
    taxId: cachedSettings.taxId,
  };
}
