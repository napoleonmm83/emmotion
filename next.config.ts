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
      // Scripts: eigene Domain + Turnstile
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://static.cloudflareinsights.com",
      // Styles: eigene Domain + inline (für Tailwind)
      "style-src 'self' 'unsafe-inline'",
      // Bilder: eigene Domain + CDNs
      "img-src 'self' data: blob: https://cdn.sanity.io https://i.ytimg.com https://images.unsplash.com https://*.public.blob.vercel-storage.com",
      // Fonts: eigene Domain
      "font-src 'self'",
      // API-Verbindungen
      "connect-src 'self' https://*.sanity.io https://challenges.cloudflare.com https://plausible.io wss://*.sanity.io",
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
      "date-fns",
      "zod",
    ],
  },
};

export default nextConfig;
