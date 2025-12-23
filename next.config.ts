import type { NextConfig } from "next";

// Security Headers
const securityHeaders = [
  {
    // Verhindert Clickjacking durch Einbetten in iframes
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    // Verhindert MIME-Type Sniffing
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Kontrolliert Referrer-Informationen
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Erzwingt HTTPS mit preload für HSTS-Liste
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    // Cross-Origin-Opener-Policy für Isolation
    // same-origin-allow-popups erlaubt OAuth/Payment Popups
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups",
  },
  {
    // Einschränkung von Browser-Features
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    // Content Security Policy
    key: "Content-Security-Policy",
    value: [
      // Standardmässig nur von eigener Domain laden
      "default-src 'self'",
      // Scripts: eigene Domain + Turnstile + Vercel Analytics
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://static.cloudflareinsights.com https://va.vercel-scripts.com",
      // Styles: eigene Domain + inline (für Tailwind)
      "style-src 'self' 'unsafe-inline'",
      // Bilder: eigene Domain + CDNs
      "img-src 'self' data: blob: https://cdn.sanity.io https://i.ytimg.com https://images.unsplash.com https://*.public.blob.vercel-storage.com",
      // Fonts: eigene Domain
      "font-src 'self'",
      // API-Verbindungen + Vercel Analytics
      "connect-src 'self' https://*.sanity.io https://challenges.cloudflare.com https://plausible.io wss://*.sanity.io https://vitals.vercel-insights.com",
      // Video/Audio Medien
      "media-src 'self' https://*.public.blob.vercel-storage.com https://cdn.sanity.io blob:",
      // Frames: YouTube Embeds + Turnstile
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://challenges.cloudflare.com",
      // Formulare nur an eigene Domain
      "form-action 'self'",
      // Base URI einschränken
      "base-uri 'self'",
      // Keine object/embed Tags
      "object-src 'none'",
      // Frame-Ancestors (zusätzlich zu X-Frame-Options)
      "frame-ancestors 'self'",
      // Upgrade unsichere Requests
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Next.js 16: Cache Components temporär deaktiviert wegen Build-Problemen
  // TODO: Re-enable once caching issues are resolved
  // cacheComponents: true,
  // Differenzierte Cache-Profile basierend auf Content-Typ
  cacheLife: {
    // Statische/rechtliche Seiten (Impressum, Datenschutz) - ändern sehr selten
    static: {
      stale: 3600,        // 1h - Daten gelten als frisch
      revalidate: 86400,  // 24h - einmal täglich revalidieren
      expire: 604800,     // 7 Tage - maximale Cache-Dauer
    },
    // Site-weite Einstellungen (Kontaktdaten, Social Links) - ändern gelegentlich
    settings: {
      stale: 300,         // 5min - Daten gelten als frisch
      revalidate: 600,    // 10min - regelmässig revalidieren
      expire: 3600,       // 1h - maximale Cache-Dauer
    },
    // Regulärer CMS-Inhalt (Portfolio, Services, FAQ) - Standard-Aktualisierung
    cms: {
      stale: 30,          // 30s - Daten gelten als frisch
      revalidate: 60,     // 60s - wie bisheriges revalidate = 60
      expire: 3600,       // 1h - maximale Cache-Dauer
    },
    // Externe Daten (YouTube TV-Produktionen) - häufiger aktualisiert via Cron
    external: {
      stale: 60,          // 1min - Daten gelten als frisch
      revalidate: 300,    // 5min - regelmässig revalidieren
      expire: 1800,       // 30min - maximale Cache-Dauer
    },
    // Onboarding-Daten (Fragebögen, Vertragsvorlagen) - müssen aktuell sein
    onboarding: {
      stale: 30,          // 30s - Daten gelten als frisch
      revalidate: 120,    // 2min - häufig revalidieren
      expire: 600,        // 10min - maximale Cache-Dauer
    },
  },
  // Next.js 16: React Compiler für automatische Memoization
  reactCompiler: true,
  // Security Headers für alle Routen
  async headers() {
    return [
      {
        // Auf alle Routen anwenden (ausser /studio für Sanity)
        source: "/((?!studio).*)",
        headers: securityHeaders,
      },
      {
        // Sanity Studio braucht lockerere CSP
        source: "/studio/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
  images: {
    // Moderne Bildformate für bessere Kompression
    formats: ["image/avif", "image/webp"],
    // Optimierte Bildgrößen
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  // Experimentelle Optimierungen
  experimental: {
    // Turbopack File System Caching für schnellere Dev (Next.js 16.1)
    // Build-Caching deaktiviert wegen Windows Symlink-Problemen
    turbopackFileSystemCacheForDev: true,
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "@sanity/client",
      "@sanity/image-url",
      "date-fns",
      "zod",
      "react-hook-form",
      "resend",
    ],
  },
};

export default nextConfig;
