import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
  // Experimentelle Optimierungen
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
