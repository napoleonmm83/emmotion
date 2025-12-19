// Bexio Contacts Module

import { getBexioClient } from "./client";
import {
  type BexioContact,
  type BexioContactCreate,
  type BexioSearchCriteria,
  BEXIO_CONTACT_TYPE_PERSON,
  BEXIO_CONTACT_TYPE_COMPANY,
  BEXIO_COUNTRY_SWITZERLAND,
  BEXIO_COUNTRY_LIECHTENSTEIN,
  BEXIO_LANGUAGE_GERMAN,
} from "./types";

/**
 * Search for contacts by email address
 */
export async function searchContactByEmail(
  email: string
): Promise<BexioContact | null> {
  const client = getBexioClient();

  const searchCriteria: BexioSearchCriteria[] = [
    {
      field: "mail",
      value: email,
      criteria: "=",
    },
  ];

  try {
    const results = await client.post<BexioContact[]>(
      "/contact/search",
      searchCriteria
    );

    if (results && results.length > 0) {
      return results[0];
    }

    return null;
  } catch (error) {
    console.error("Error searching contact by email:", error);
    return null;
  }
}

/**
 * Search for contacts by name
 */
export async function searchContactByName(
  name: string
): Promise<BexioContact[]> {
  const client = getBexioClient();

  const searchCriteria: BexioSearchCriteria[] = [
    {
      field: "name_1",
      value: `%${name}%`,
      criteria: "like",
    },
  ];

  try {
    const results = await client.post<BexioContact[]>(
      "/contact/search",
      searchCriteria
    );
    return results || [];
  } catch (error) {
    console.error("Error searching contact by name:", error);
    return [];
  }
}

/**
 * Get a single contact by ID
 */
export async function getContact(contactId: number): Promise<BexioContact> {
  const client = getBexioClient();
  return client.get<BexioContact>(`/contact/${contactId}`);
}

/**
 * Determine country ID from zip code or city
 */
function determineCountryId(zipCity: string): number {
  // Liechtenstein zip codes start with 94
  if (zipCity.match(/^94\d{2}/)) {
    return BEXIO_COUNTRY_LIECHTENSTEIN;
  }
  // Default to Switzerland
  return BEXIO_COUNTRY_SWITZERLAND;
}

/**
 * Parse zip code and city from combined string
 */
function parseZipCity(zipCity: string): { postcode: string; city: string } {
  const match = zipCity.match(/^(\d{4})\s*(.*)$/);
  if (match) {
    return {
      postcode: match[1],
      city: match[2].trim(),
    };
  }
  return {
    postcode: "",
    city: zipCity,
  };
}

interface CreateContactParams {
  name: string;
  company?: string;
  email: string;
  phone: string;
  street?: string;
  zipCity?: string;
}

/**
 * Get the first user in the Bexio account (for user_id/owner_id fields)
 * Uses v3 API as v2 /user returns 404
 */
async function getBexioUserId(): Promise<number | null> {
  const token = process.env.BEXIO_API_TOKEN;
  if (!token) return null;

  try {
    // Use v3 API for users
    const response = await fetch("https://api.bexio.com/3.0/users", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Error fetching Bexio users:", response.status);
      return null;
    }

    const users = await response.json() as Array<{ id: number; email: string }>;
    if (users && users.length > 0) {
      console.log(`Found Bexio user: ${users[0].id} (${users[0].email})`);
      return users[0].id;
    }
    return null;
  } catch (error) {
    console.error("Error fetching Bexio users:", error);
    return null;
  }
}

/**
 * Create a new contact in Bexio
 */
export async function createContact(
  params: CreateContactParams
): Promise<BexioContact> {
  const client = getBexioClient();

  // Try to get user ID from env or fetch from API
  let userId = process.env.BEXIO_USER_ID
    ? parseInt(process.env.BEXIO_USER_ID, 10)
    : null;

  // If env var not set or seems wrong, try to fetch from API
  if (!userId || userId > 1000) {
    const fetchedUserId = await getBexioUserId();
    if (fetchedUserId) {
      userId = fetchedUserId;
    }
  }

  // Parse zip and city
  const { postcode, city } = params.zipCity
    ? parseZipCity(params.zipCity)
    : { postcode: "", city: "" };

  // Determine contact type and name fields
  const hasCompany = params.company && params.company.trim().length > 0;
  const contactTypeId = hasCompany
    ? BEXIO_CONTACT_TYPE_COMPANY
    : BEXIO_CONTACT_TYPE_PERSON;

  // Split name into first and last name for persons
  const nameParts = params.name.trim().split(/\s+/);
  const firstName = nameParts.slice(0, -1).join(" ") || nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  // Parse street into street_name and house_number
  let streetName: string | undefined;
  let houseNumber: string | undefined;
  if (params.street) {
    // Try to extract house number from street (e.g., "Hauptstrasse 42" -> "Hauptstrasse", "42")
    const streetMatch = params.street.match(/^(.+?)\s+(\d+\s*\w*)$/);
    if (streetMatch) {
      streetName = streetMatch[1].trim();
      houseNumber = streetMatch[2].trim();
    } else {
      streetName = params.street;
    }
  }

  // Build contact data - user_id and owner_id are optional for API tokens
  const contactData: Record<string, unknown> = {
    contact_type_id: contactTypeId,
    // For companies: name_1 = company name, name_2 = contact person
    // For persons: name_1 = last name, name_2 = first name
    name_1: hasCompany ? params.company! : lastName || params.name,
    name_2: hasCompany ? params.name : firstName,
    street_name: streetName || undefined,
    house_number: houseNumber || undefined,
    postcode: postcode || undefined,
    city: city || undefined,
    country_id: params.zipCity
      ? determineCountryId(params.zipCity)
      : BEXIO_COUNTRY_SWITZERLAND,
    mail: params.email,
    phone_mobile: params.phone,
    language_id: BEXIO_LANGUAGE_GERMAN,
  };

  // Only add user_id and owner_id if we have a valid one
  if (userId) {
    contactData.user_id = userId;
    contactData.owner_id = userId;
  }

  // Remove undefined values
  const cleanedData = Object.fromEntries(
    Object.entries(contactData).filter(([, v]) => v !== undefined)
  );

  console.log("Creating Bexio contact with data:", JSON.stringify(cleanedData, null, 2));

  const contact = await client.post<BexioContact>("/contact", cleanedData);
  return contact;
}

/**
 * Find or create a contact by email
 * Returns existing contact if found, creates new one if not
 */
export async function findOrCreateContact(
  params: CreateContactParams
): Promise<{ contact: BexioContact; isNew: boolean }> {
  // First, try to find existing contact by email
  const existingContact = await searchContactByEmail(params.email);

  if (existingContact) {
    console.log(`Found existing Bexio contact: ${existingContact.id}`);
    return { contact: existingContact, isNew: false };
  }

  // Create new contact
  console.log(`Creating new Bexio contact for: ${params.email}`);
  const newContact = await createContact(params);
  return { contact: newContact, isNew: true };
}
