import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { BackToTop, CustomCursor, CookieConsent } from "@/components/shared";
import { client } from "@sanity/lib/client";
import { seoSettingsQuery } from "@sanity/lib/queries";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

// Fallback SEO-Werte
const defaultSeo = {
  siteName: "emmotion.ch",
  metaTitle: "emmotion.ch | Videoproduktion mit TV-Erfahrung",
  metaDescription:
    "Professionelle Videoproduktion für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz. Imagefilme, Eventvideos, Social Media Content und mehr.",
};

export async function generateMetadata(): Promise<Metadata> {
  // Hole SEO-Einstellungen aus Sanity
  let settings;
  try {
    settings = await client.fetch(seoSettingsQuery);
  } catch {
    settings = null;
  }

  const allowIndexing = settings?.seo?.allowIndexing ?? false;
  const siteName = settings?.siteName || defaultSeo.siteName;
  const metaTitle = settings?.seo?.metaTitle || defaultSeo.metaTitle;
  const metaDescription =
    settings?.seo?.metaDescription ||
    settings?.siteDescription ||
    defaultSeo.metaDescription;
  const ogImageUrl = settings?.seo?.ogImage?.asset?.url;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://emmotion.ch";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: metaTitle,
      template: `%s | ${siteName}`,
    },
    description: metaDescription,
    keywords: [
      "Videoproduktion",
      "Imagefilm",
      "Rheintal",
      "Liechtenstein",
      "Ostschweiz",
      "Unternehmensfilm",
      "Eventvideo",
      "Social Media",
      "St. Gallen",
      "Vorarlberg",
    ],
    authors: [{ name: siteName }],
    creator: siteName,
    openGraph: {
      type: "website",
      locale: "de_CH",
      url: baseUrl,
      siteName: siteName,
      title: metaTitle,
      description: metaDescription,
      ...(ogImageUrl && {
        images: [
          {
            url: ogImageUrl,
            width: settings?.seo?.ogImage?.asset?.metadata?.dimensions?.width || 1200,
            height: settings?.seo?.ogImage?.asset?.metadata?.dimensions?.height || 630,
            alt: metaTitle,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
      googleBot: {
        index: allowIndexing,
        follow: allowIndexing,
      },
    },
    alternates: {
      canonical: baseUrl,
    },
  };
}

// Fallback Kontaktdaten
const defaultContact = {
  email: "hallo@emmotion.ch",
  phone: "+41 79 723 29 24",
  region: "Rheintal, Liechtenstein, Ostschweiz",
};

const defaultSocial = {
  instagram: "https://www.instagram.com/emmotion.ch",
  linkedin: "https://www.linkedin.com/in/emmotion",
};

// Structured Data für LocalBusiness
interface StructuredDataSettings {
  siteName?: string;
  siteDescription?: string;
  contact?: {
    email?: string;
    phone?: string;
    street?: string;
    city?: string;
    region?: string;
  };
  social?: {
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
}

function getStructuredData(settings: StructuredDataSettings | null) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://emmotion.ch";

  const contact = {
    email: settings?.contact?.email || defaultContact.email,
    phone: settings?.contact?.phone || defaultContact.phone,
    region: settings?.contact?.region || defaultContact.region,
  };

  const social = {
    instagram: settings?.social?.instagram || defaultSocial.instagram,
    linkedin: settings?.social?.linkedin || defaultSocial.linkedin,
  };

  const siteName = settings?.siteName || "emmotion.ch";
  const description = settings?.siteDescription ||
    "Professionelle Videoproduktion für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz. Imagefilme, Eventvideos, Social Media Content und mehr.";

  // Parse regions from contact.region string
  const regions = contact.region.split(",").map(r => r.trim());

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#business`,
    name: siteName,
    alternateName: "emmotion Videoproduktion",
    description: description,
    url: baseUrl,
    telephone: contact.phone,
    email: contact.email,
    image: `${baseUrl}/opengraph-image`,
    priceRange: "CHF 600 - CHF 6000",
    address: {
      "@type": "PostalAddress",
      ...(settings?.contact?.street && { streetAddress: settings.contact.street }),
      ...(settings?.contact?.city && { addressLocality: settings.contact.city }),
      addressRegion: "St. Gallen",
      addressCountry: "CH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "47.33",
      longitude: "9.60",
    },
    areaServed: regions.map(region => ({
      "@type": "Place",
      name: region,
    })),
    sameAs: [
      social.instagram,
      social.linkedin,
      ...(settings?.social?.youtube ? [settings.social.youtube] : []),
    ].filter(Boolean),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Videoproduktion Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Imagefilm",
            description: "Professionelle Unternehmensvideos für authentische Markenpräsentation",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Eventvideo",
            description: "Dynamische Dokumentation von Veranstaltungen",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Social Media Content",
            description: "Kurze, wirkungsvolle Videos für Instagram, LinkedIn und TikTok",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Drohnenaufnahmen",
            description: "Spektakuläre Luftaufnahmen in 4K-Qualität",
          },
        },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Hole Settings für Structured Data
  let settings: StructuredDataSettings | null = null;
  try {
    settings = await client.fetch(seoSettingsQuery);
  } catch {
    settings = null;
  }

  const structuredData = getStructuredData(settings);

  return (
    <html lang="de" className={`${inter.variable} ${bebasNeue.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <CustomCursor />
        {children}
        <BackToTop />
        <CookieConsent />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
