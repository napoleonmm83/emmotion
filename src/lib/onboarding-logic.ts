// Onboarding Logic for Project Requests
// Includes pricing calculation, deposit rules, and type definitions

// ============================================================================
// TYPES
// ============================================================================

export type ServiceType =
  | "imagefilm"
  | "eventvideo"
  | "social-media"
  | "drohnenaufnahmen"
  | "produktvideo"
  | "postproduktion";

export type Duration = "short" | "medium" | "long";
export type Complexity = "simple" | "standard" | "premium";
export type BudgetRange = "bis-2000" | "2000-5000" | "5000-10000" | "ueber-10000";

export interface ClientInfo {
  name: string;
  company?: string;
  email: string;
  phone: string;
  street?: string;
  zipCity?: string;
}

export interface ProjectDetails {
  projectName: string;
  description?: string;
  deadline?: string;
  shootingDate?: string;
  budget?: BudgetRange;
  locations?: string[];
}

export interface Extras {
  drone: boolean;
  expressDelivery: boolean;
  socialCuts: boolean;
  subtitles: boolean;
  music: boolean;
}

export interface OnboardingFormData {
  serviceType: ServiceType;
  projectDetails: ProjectDetails;
  serviceSpecificData: Record<string, unknown>;
  extras: Extras;
  clientInfo: ClientInfo;
  termsAccepted: boolean;
}

export interface PricingResult {
  basePrice: number;
  extrasPrice: number;
  totalPrice: number;
  depositPercentage: number;
  depositAmount: number;
  remainingAmount: number;
  breakdown: Array<{ item: string; price: number }>;
  estimatedDays: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const SERVICE_LABELS: Record<ServiceType, string> = {
  imagefilm: "Imagefilm",
  eventvideo: "Eventvideo",
  "social-media": "Social Media Content",
  drohnenaufnahmen: "Drohnenaufnahmen",
  produktvideo: "Produktvideo",
  postproduktion: "Postproduktion",
};

export const BUDGET_LABELS: Record<BudgetRange, string> = {
  "bis-2000": "Bis CHF 2'000",
  "2000-5000": "CHF 2'000 - 5'000",
  "5000-10000": "CHF 5'000 - 10'000",
  "ueber-10000": "Über CHF 10'000",
};

// Base prices by service type and complexity
const BASE_PRICES: Record<ServiceType, Record<Complexity, number>> = {
  imagefilm: { simple: 2400, standard: 3800, premium: 5500 },
  eventvideo: { simple: 1800, standard: 2800, premium: 4200 },
  "social-media": { simple: 600, standard: 1200, premium: 2000 },
  drohnenaufnahmen: { simple: 400, standard: 700, premium: 1200 },
  produktvideo: { simple: 800, standard: 1500, premium: 2500 },
  postproduktion: { simple: 500, standard: 1000, premium: 2000 },
};

// Duration multipliers
const DURATION_MULTIPLIER: Record<Duration, number> = {
  short: 1.0, // bis 1 Min
  medium: 1.4, // 1-2 Min
  long: 1.8, // 2-4 Min
};

// Extras pricing
const EXTRAS_PRICES = {
  drone: 400,
  expressDelivery: 500,
  socialCuts: 300,
  subtitles: 200,
  music: 150,
};

// Estimated delivery days by service
const BASE_DELIVERY_DAYS: Record<ServiceType, number> = {
  imagefilm: 21,
  eventvideo: 14,
  "social-media": 7,
  drohnenaufnahmen: 5,
  produktvideo: 10,
  postproduktion: 14,
};

// ============================================================================
// PRICING CALCULATION
// ============================================================================

/**
 * Calculate deposit percentage based on total price
 * Higher deposit for smaller projects, lower for larger ones
 */
export function calculateDepositPercentage(totalPrice: number): number {
  if (totalPrice <= 2000) return 50;
  if (totalPrice <= 5000) return 40;
  if (totalPrice <= 10000) return 30;
  return 20;
}

/**
 * Calculate full pricing based on form data
 */
export function calculatePricing(
  serviceType: ServiceType,
  complexity: Complexity = "standard",
  duration: Duration = "medium",
  extras: Extras = {
    drone: false,
    expressDelivery: false,
    socialCuts: false,
    subtitles: false,
    music: false,
  }
): PricingResult {
  const breakdown: Array<{ item: string; price: number }> = [];

  // Base price
  const basePrice = BASE_PRICES[serviceType][complexity];
  const multipliedBase = Math.round(basePrice * DURATION_MULTIPLIER[duration]);
  breakdown.push({ item: `${SERVICE_LABELS[serviceType]} (${complexity})`, price: multipliedBase });

  // Extras
  let extrasPrice = 0;

  if (extras.drone && serviceType !== "drohnenaufnahmen") {
    extrasPrice += EXTRAS_PRICES.drone;
    breakdown.push({ item: "Drohnenaufnahmen", price: EXTRAS_PRICES.drone });
  }
  if (extras.expressDelivery) {
    extrasPrice += EXTRAS_PRICES.expressDelivery;
    breakdown.push({ item: "Express-Lieferung", price: EXTRAS_PRICES.expressDelivery });
  }
  if (extras.socialCuts) {
    extrasPrice += EXTRAS_PRICES.socialCuts;
    breakdown.push({ item: "Social Media Schnitte", price: EXTRAS_PRICES.socialCuts });
  }
  if (extras.subtitles) {
    extrasPrice += EXTRAS_PRICES.subtitles;
    breakdown.push({ item: "Untertitel", price: EXTRAS_PRICES.subtitles });
  }
  if (extras.music) {
    extrasPrice += EXTRAS_PRICES.music;
    breakdown.push({ item: "Premium Musik", price: EXTRAS_PRICES.music });
  }

  const totalPrice = multipliedBase + extrasPrice;
  const depositPercentage = calculateDepositPercentage(totalPrice);
  const depositAmount = Math.round(totalPrice * (depositPercentage / 100));
  const remainingAmount = totalPrice - depositAmount;

  // Delivery days
  let estimatedDays = BASE_DELIVERY_DAYS[serviceType];
  if (extras.expressDelivery) {
    estimatedDays = Math.min(5, Math.round(estimatedDays / 2));
  }

  return {
    basePrice: multipliedBase,
    extrasPrice,
    totalPrice,
    depositPercentage,
    depositAmount,
    remainingAmount,
    breakdown,
    estimatedDays,
  };
}

/**
 * Get price estimate from budget range
 */
export function getPriceFromBudget(budget: BudgetRange): { min: number; max: number } {
  switch (budget) {
    case "bis-2000":
      return { min: 0, max: 2000 };
    case "2000-5000":
      return { min: 2000, max: 5000 };
    case "5000-10000":
      return { min: 5000, max: 10000 };
    case "ueber-10000":
      return { min: 10000, max: 50000 };
    default:
      return { min: 0, max: 10000 };
  }
}

// ============================================================================
// FORM DATA DEFAULTS
// ============================================================================

export const DEFAULT_EXTRAS: Extras = {
  drone: false,
  expressDelivery: false,
  socialCuts: false,
  subtitles: false,
  music: false,
};

export const DEFAULT_CLIENT_INFO: ClientInfo = {
  name: "",
  company: "",
  email: "",
  phone: "",
  street: "",
  zipCity: "",
};

export const DEFAULT_PROJECT_DETAILS: ProjectDetails = {
  projectName: "",
  description: "",
  deadline: "",
  shootingDate: "",
  budget: undefined,
  locations: [],
};

export const DEFAULT_ONBOARDING_DATA: OnboardingFormData = {
  serviceType: "imagefilm",
  projectDetails: DEFAULT_PROJECT_DETAILS,
  serviceSpecificData: {},
  extras: DEFAULT_EXTRAS,
  clientInfo: DEFAULT_CLIENT_INFO,
  termsAccepted: false,
};

// ============================================================================
// VALIDATION
// ============================================================================

export function validateClientInfo(info: ClientInfo): string[] {
  const errors: string[] = [];

  if (!info.name || info.name.trim().length < 2) {
    errors.push("Bitte gib deinen Namen an");
  }
  if (!info.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
    errors.push("Bitte gib eine gültige E-Mail-Adresse an");
  }
  if (!info.phone || info.phone.trim().length < 5) {
    errors.push("Bitte gib deine Telefonnummer an");
  }

  return errors;
}

export function validateProjectDetails(details: ProjectDetails): string[] {
  const errors: string[] = [];

  if (!details.projectName || details.projectName.trim().length < 3) {
    errors.push("Bitte gib einen Projektnamen an");
  }

  return errors;
}

// ============================================================================
// FORMATTING
// ============================================================================

export function formatPrice(price: number): string {
  return `CHF ${price.toLocaleString("de-CH")}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
