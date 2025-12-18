// Bexio API Types

export interface BexioContact {
  id: number;
  nr: string;
  contact_type_id: number; // 1 = Firma, 2 = Person
  name_1: string; // Firmenname oder Nachname
  name_2?: string; // Zusatz oder Vorname
  salutation_id?: number;
  salutation_form?: number;
  title_id?: number;
  birthday?: string;
  address?: string;
  postcode?: string;
  city?: string;
  country_id?: number;
  mail?: string;
  mail_second?: string;
  phone_fixed?: string;
  phone_fixed_second?: string;
  phone_mobile?: string;
  fax?: string;
  url?: string;
  skype_name?: string;
  remarks?: string;
  language_id?: number;
  contact_group_ids?: number[];
  contact_branch_ids?: number[];
  user_id: number;
  owner_id: number;
  updated_at?: string;
}

export interface BexioContactCreate {
  contact_type_id: number; // 1 = Firma, 2 = Person
  name_1: string;
  name_2?: string;
  salutation_id?: number;
  address?: string;
  postcode?: string;
  city?: string;
  country_id?: number; // 1 = Schweiz
  mail?: string;
  phone_fixed?: string;
  phone_mobile?: string;
  language_id?: number; // 1 = Deutsch
  user_id: number;
  owner_id: number;
}

export interface BexioSearchCriteria {
  field: string;
  value: string | number;
  criteria?: "=" | "!=" | ">" | "<" | ">=" | "<=" | "like" | "not_like" | "is_null" | "not_null";
}

export interface BexioInvoicePosition {
  type: "KbPositionCustom" | "KbPositionArticle" | "KbPositionText" | "KbPositionSubtotal" | "KbPositionPagebreak" | "KbPositionDiscount";
  amount?: string; // Menge als String
  unit_id?: number;
  account_id?: number;
  tax_id?: number; // MwSt ID
  text?: string;
  unit_price?: string; // Preis als String
  discount_in_percent?: string;
  position_total?: string;
  article_id?: number;
}

export interface BexioInvoiceCreate {
  title?: string;
  contact_id: number;
  contact_sub_id?: number;
  user_id: number;
  project_id?: number;
  language_id?: number; // 1 = Deutsch
  bank_account_id?: number;
  currency_id?: number; // 1 = CHF
  payment_type_id?: number;
  header?: string;
  footer?: string;
  mwst_type?: number; // 0 = inkl., 1 = exkl., 2 = Netto
  mwst_is_net?: boolean;
  show_position_taxes?: boolean;
  is_valid_from?: string; // YYYY-MM-DD
  is_valid_to?: string; // YYYY-MM-DD (Fälligkeitsdatum)
  api_reference?: string;
  viewed_by_client_at?: string;
  kb_item_status_id?: number; // 7 = Entwurf, 8 = Offen
  template_slug?: string;
  taxs?: Array<{ percentage: string; value: string }>;
  positions: BexioInvoicePosition[];
}

export interface BexioInvoice {
  id: number;
  document_nr: string;
  title?: string;
  contact_id: number;
  contact_sub_id?: number;
  user_id: number;
  project_id?: number;
  language_id: number;
  bank_account_id: number;
  currency_id: number;
  payment_type_id: number;
  header?: string;
  footer?: string;
  total_gross: string;
  total_net: string;
  total_taxes: string;
  total: string;
  total_rounding_difference?: number;
  mwst_type: number;
  mwst_is_net: boolean;
  show_position_taxes: boolean;
  is_valid_from: string;
  is_valid_to: string;
  contact_address: string;
  kb_item_status_id: number;
  api_reference?: string;
  viewed_by_client_at?: string;
  updated_at: string;
  template_slug?: string;
  taxs: Array<{ percentage: string; value: string }>;
  network_link?: string;
  positions?: BexioInvoicePosition[];
}

export interface BexioSendEmail {
  recipient_email: string;
  subject: string;
  message: string;
  mark_as_open?: boolean;
}

// Country IDs
export const BEXIO_COUNTRY_SWITZERLAND = 1;
export const BEXIO_COUNTRY_LIECHTENSTEIN = 2;
export const BEXIO_COUNTRY_GERMANY = 4;
export const BEXIO_COUNTRY_AUSTRIA = 5;

// Language IDs
export const BEXIO_LANGUAGE_GERMAN = 1;
export const BEXIO_LANGUAGE_FRENCH = 2;
export const BEXIO_LANGUAGE_ITALIAN = 3;
export const BEXIO_LANGUAGE_ENGLISH = 4;

// Currency IDs
export const BEXIO_CURRENCY_CHF = 1;
export const BEXIO_CURRENCY_EUR = 2;

// Contact Type IDs
export const BEXIO_CONTACT_TYPE_COMPANY = 1;
export const BEXIO_CONTACT_TYPE_PERSON = 2;

// Invoice Status IDs
export const BEXIO_INVOICE_STATUS_DRAFT = 7;
export const BEXIO_INVOICE_STATUS_OPEN = 8;
export const BEXIO_INVOICE_STATUS_PAID = 9;
export const BEXIO_INVOICE_STATUS_CANCELLED = 19;

// Tax IDs (Standard Swiss VAT)
export const BEXIO_TAX_NONE = 17; // 0%
export const BEXIO_TAX_STANDARD = 1; // 8.1% (current Swiss standard rate)
export const BEXIO_TAX_REDUCED = 2; // 2.6% (reduced rate)
