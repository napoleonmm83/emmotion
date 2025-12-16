// Video-Konfigurator Preisberechnung

export type VideoType = "imagefilm" | "recruiting" | "produkt" | "social" | "event";
export type Duration = "short" | "medium" | "long";
export type Complexity = "simple" | "standard" | "premium";

export interface KonfiguratorExtras {
  drone: boolean;
  music: boolean;
  subtitles: boolean;
  socialCuts: boolean;
  expressDelivery: boolean;
}

export interface KonfiguratorInput {
  videoType: VideoType;
  duration: Duration;
  complexity: Complexity;
  extras: KonfiguratorExtras;
}

export interface PriceBreakdownItem {
  item: string;
  price: number;
}

export interface PriceResult {
  basePrice: number;
  extrasPrice: number;
  totalPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  breakdown: PriceBreakdownItem[];
  estimatedDays: number;
}

// Video-Typ Informationen
export const VIDEO_TYPES: Record<VideoType, { label: string; description: string; icon: string }> = {
  imagefilm: {
    label: "Imagefilm",
    description: "Professionelle Unternehmensdarstellung für Website, Messen und Präsentationen",
    icon: "Film",
  },
  recruiting: {
    label: "Recruiting-Video",
    description: "Authentische Einblicke für die Mitarbeitergewinnung",
    icon: "Users",
  },
  produkt: {
    label: "Produktvideo",
    description: "Ihr Produkt im besten Licht – für Shop und Social Media",
    icon: "Package",
  },
  social: {
    label: "Social Media Content",
    description: "Kurze, wirkungsvolle Clips für Instagram, LinkedIn & Co.",
    icon: "Smartphone",
  },
  event: {
    label: "Eventvideo",
    description: "Professionelle Dokumentation Ihrer Veranstaltung",
    icon: "Calendar",
  },
};

// Dauer Optionen
export const DURATION_OPTIONS: Record<Duration, { label: string; description: string }> = {
  short: {
    label: "Kurz (bis 1 Min)",
    description: "Ideal für Social Media und Teaser",
  },
  medium: {
    label: "Mittel (1-2 Min)",
    description: "Standard für die meisten Unternehmensvideos",
  },
  long: {
    label: "Lang (2-4 Min)",
    description: "Ausführliche Darstellung mit mehreren Themen",
  },
};

// Komplexität Optionen
export const COMPLEXITY_OPTIONS: Record<Complexity, { label: string; description: string }> = {
  simple: {
    label: "Basic",
    description: "1 Drehtag, einfache Schnitte, Standardmusik",
  },
  standard: {
    label: "Standard",
    description: "1-2 Drehtage, Interviews, professionelles Color Grading",
  },
  premium: {
    label: "Premium",
    description: "Mehrere Drehtage, aufwendige Postproduktion, Motion Graphics",
  },
};

// Extras Informationen
export const EXTRAS_INFO: Record<keyof KonfiguratorExtras, { label: string; description: string; price: number }> = {
  drone: {
    label: "Drohnenaufnahmen",
    description: "Spektakuläre Luftaufnahmen für einzigartige Perspektiven",
    price: 400,
  },
  music: {
    label: "Premium Musik",
    description: "Hochwertige lizenzfreie Musik passend zu Ihrer Marke",
    price: 150,
  },
  subtitles: {
    label: "Untertitel",
    description: "Professionelle Untertitelung für bessere Reichweite",
    price: 200,
  },
  socialCuts: {
    label: "Social Media Schnitte",
    description: "Zusätzliche Formate (9:16, 1:1) für alle Plattformen",
    price: 300,
  },
  expressDelivery: {
    label: "Express-Lieferung",
    description: "Fertigstellung innerhalb von 5 Werktagen",
    price: 500,
  },
};

// Basispreise nach Video-Typ und Komplexität
const BASE_PRICES: Record<VideoType, Record<Complexity, number>> = {
  imagefilm: { simple: 2400, standard: 3800, premium: 5500 },
  recruiting: { simple: 1800, standard: 2800, premium: 4200 },
  produkt: { simple: 800, standard: 1500, premium: 2500 },
  social: { simple: 600, standard: 1200, premium: 2000 },
  event: { simple: 1200, standard: 2200, premium: 3500 },
};

// Dauer-Multiplikator
const DURATION_MULTIPLIER: Record<Duration, number> = {
  short: 1,
  medium: 1.4,
  long: 1.8,
};

// Geschätzte Lieferzeit in Tagen
const BASE_DELIVERY_DAYS: Record<Complexity, number> = {
  simple: 10,
  standard: 15,
  premium: 25,
};

export function calculatePrice(input: KonfiguratorInput): PriceResult {
  const basePrice = BASE_PRICES[input.videoType][input.complexity];
  const multipliedPrice = Math.round(basePrice * DURATION_MULTIPLIER[input.duration]);

  const breakdown: PriceBreakdownItem[] = [
    {
      item: `${VIDEO_TYPES[input.videoType].label} (${COMPLEXITY_OPTIONS[input.complexity].label})`,
      price: multipliedPrice,
    },
  ];

  let extrasPrice = 0;

  // Add extras
  (Object.keys(input.extras) as Array<keyof KonfiguratorExtras>).forEach((key) => {
    if (input.extras[key]) {
      const extra = EXTRAS_INFO[key];
      extrasPrice += extra.price;
      breakdown.push({ item: extra.label, price: extra.price });
    }
  });

  const totalPrice = multipliedPrice + extrasPrice;

  // Calculate delivery days
  let estimatedDays = BASE_DELIVERY_DAYS[input.complexity];
  if (input.extras.expressDelivery) {
    estimatedDays = 5;
  }

  return {
    basePrice: multipliedPrice,
    extrasPrice,
    totalPrice,
    priceRange: {
      min: Math.round(totalPrice * 0.9),
      max: Math.round(totalPrice * 1.1),
    },
    breakdown,
    estimatedDays,
  };
}

// Default-Werte für das Formular
export const DEFAULT_KONFIGURATOR_INPUT: KonfiguratorInput = {
  videoType: "imagefilm",
  duration: "medium",
  complexity: "standard",
  extras: {
    drone: false,
    music: false,
    subtitles: false,
    socialCuts: false,
    expressDelivery: false,
  },
};
