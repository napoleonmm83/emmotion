# TECHNICAL.md – Erweiterte technische Dokumentation

> Ergänzung zu CLAUDE.md mit detaillierten Code-Beispielen und Konfigurationen.

---

## INHALTSVERZEICHNIS

1. [Project Setup](#project-setup)
2. [Next.js Konfiguration](#nextjs-konfiguration)
3. [Tailwind Konfiguration](#tailwind-konfiguration)
4. [TypeScript Types](#typescript-types)
5. [Sanity Setup](#sanity-setup)
6. [API Routes](#api-routes)
7. [Middleware](#middleware)
8. [React Email Templates](#react-email-templates)
9. [Form Handling](#form-handling)
10. [Animation Patterns](#animation-patterns)
11. [Video Handling](#video-handling)
12. [Image Optimization](#image-optimization)
13. [Caching Strategies](#caching-strategies)
14. [Error Handling](#error-handling)
15. [Security Headers](#security-headers)
16. [Accessibility](#accessibility)
17. [Testing](#testing)
18. [Deployment](#deployment)

---

## PROJECT SETUP

### Initialisierung
```bash
# Projekt erstellen
npx create-next-app@latest emmotion-website --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

cd emmotion-website

# Core Dependencies
npm install next-sanity @sanity/image-url @portabletext/react
npm install react-hook-form @hookform/resolvers zod
npm install resend @react-email/components
npm install framer-motion
npm install lucide-react
npm install clsx tailwind-merge class-variance-authority
npm install date-fns slugify

# Dev Dependencies
npm install -D @types/node @tailwindcss/typography

# shadcn/ui initialisieren
npx shadcn@latest init

# shadcn Komponenten (einzeln nach Bedarf)
npx shadcn@latest add button card input textarea label select accordion dialog sheet separator badge tabs form toast sonner
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "sanity": "sanity dev",
    "sanity:deploy": "sanity deploy",
    "sanity:build": "sanity build",
    "email:dev": "email dev --port 3001",
    "analyze": "ANALYZE=true next build"
  }
}
```

---

## NEXT.JS KONFIGURATION

### next.config.ts
```typescript
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Bildoptimierung
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "i.vimeocdn.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Experimentelle Features
  experimental: {
    // Optimized Package Imports
    optimizePackageImports: ["lucide-react", "framer-motion", "date-fns"],
  },

  // Redirects
  async redirects() {
    return [
      {
        source: "/services",
        destination: "/leistungen",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/ueber-mich",
        permanent: true,
      },
      {
        source: "/work",
        destination: "/portfolio",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/kontakt",
        permanent: true,
      },
    ]
  },

  // Headers für Security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },

  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default nextConfig
```

---

## TAILWIND KONFIGURATION

### tailwind.config.ts
```typescript
import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        display: ["var(--font-display)", ...fontFamily.sans],
      },
      fontSize: {
        "display-lg": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-sm": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-up": "fade-up 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "spin-slow": "spin 3s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      transitionDuration: {
        "400": "400ms",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(to bottom, hsl(var(--background)), transparent)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
}

export default config
```

### globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 262 83% 58%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 262 83% 58%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground antialiased;
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Focus styles */
  :focus-visible {
    @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;
  }

  /* Selection */
  ::selection {
    @apply bg-primary/20 text-foreground;
  }
}

@layer components {
  /* Container Varianten */
  .container-tight {
    @apply mx-auto max-w-4xl px-4 md:px-6;
  }

  .container-wide {
    @apply mx-auto max-w-7xl px-4 md:px-6 lg:px-8;
  }

  /* Section Spacing */
  .section {
    @apply py-16 md:py-24 lg:py-32;
  }

  .section-sm {
    @apply py-12 md:py-16 lg:py-20;
  }

  /* Prose Styling für CMS Content */
  .prose-custom {
    @apply prose prose-neutral dark:prose-invert max-w-none;
    @apply prose-headings:font-display prose-headings:tracking-tight;
    @apply prose-a:text-primary prose-a:no-underline hover:prose-a:underline;
    @apply prose-img:rounded-lg;
  }

  /* Video Aspect Ratios */
  .video-16-9 {
    @apply aspect-video;
  }

  .video-9-16 {
    aspect-ratio: 9 / 16;
  }

  .video-1-1 {
    @apply aspect-square;
  }

  /* Glass Effect */
  .glass {
    @apply bg-background/80 backdrop-blur-md;
  }

  /* Gradient Text */
  .gradient-text {
    @apply bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent;
  }
}

@layer utilities {
  /* Hide scrollbar */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* Text Balance */
  .text-balance {
    text-wrap: balance;
  }

  /* Animation Delays */
  .animation-delay-100 {
    animation-delay: 100ms;
  }
  .animation-delay-200 {
    animation-delay: 200ms;
  }
  .animation-delay-300 {
    animation-delay: 300ms;
  }
  .animation-delay-400 {
    animation-delay: 400ms;
  }
  .animation-delay-500 {
    animation-delay: 500ms;
  }
}
```

---

## TYPESCRIPT TYPES

### types/index.ts
```typescript
// ============================================
// SANITY TYPES
// ============================================

import type { PortableTextBlock } from "@portabletext/types"

// Base Types
export interface SanityDocument {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
  _rev: string
}

export interface SanitySlug {
  _type: "slug"
  current: string
}

export interface SanityImage {
  _type: "image"
  asset: {
    _ref: string
    _type: "reference"
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
  alt?: string
}

export interface SanityReference {
  _type: "reference"
  _ref: string
}

// SEO Type
export interface SEO {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
}

// Service Type
export interface Service extends SanityDocument {
  _type: "service"
  title: string
  slug: SanitySlug
  shortDescription?: string
  description?: PortableTextBlock[]
  icon?: string
  idealFor?: string[]
  priceFrom?: number
  featuredVideo?: string
  featuredImage?: SanityImage
  benefits?: Array<{
    title: string
    description: string
  }>
  seo?: SEO
  order?: number
}

// Project Type
export interface Project extends SanityDocument {
  _type: "project"
  title: string
  slug: SanitySlug
  client?: string
  category?: Service | SanityReference
  industry?: 
    | "gastronomie"
    | "industrie"
    | "handwerk"
    | "gesundheit"
    | "dienstleistung"
    | "tourismus"
    | "sonstiges"
  videoUrl?: string
  thumbnail: SanityImage
  challenge?: string
  solution?: string
  result?: string
  testimonial?: Testimonial | SanityReference
  featured?: boolean
  publishedAt?: string
}

// Testimonial Type
export interface Testimonial extends SanityDocument {
  _type: "testimonial"
  quote: string
  author: string
  position?: string
  company?: string
  image?: SanityImage
  project?: Project | SanityReference
  featured?: boolean
}

// FAQ Type
export interface FAQ extends SanityDocument {
  _type: "faq"
  question: string
  answer: PortableTextBlock[]
  category?: "kosten" | "ablauf" | "technik" | "allgemein"
  order?: number
}

// Blog Post Type
export interface Post extends SanityDocument {
  _type: "post"
  title: string
  slug: SanitySlug
  excerpt?: string
  content?: PortableTextBlock[]
  featuredImage?: SanityImage
  author?: Author | SanityReference
  categories?: string[]
  publishedAt?: string
  seo?: SEO
}

// Author Type
export interface Author extends SanityDocument {
  _type: "author"
  name: string
  slug: SanitySlug
  image?: SanityImage
  bio?: string
}

// Site Settings Type
export interface SiteSettings extends SanityDocument {
  _type: "settings"
  siteName?: string
  siteDescription?: string
  logo?: SanityImage
  contact?: {
    email?: string
    phone?: string
    address?: string
  }
  social?: {
    linkedin?: string
    instagram?: string
    youtube?: string
  }
  defaultSeo?: SEO
}

// ============================================
// KONFIGURATOR TYPES
// ============================================

export type VideoType = "imagefilm" | "recruiting" | "produkt" | "social"
export type Duration = "short" | "medium" | "long"
export type Complexity = "simple" | "standard" | "premium"

export interface KonfiguratorExtras {
  drone: boolean
  music: boolean
  subtitles: boolean
  socialCuts: boolean
  expressDelivery: boolean
}

export interface KonfiguratorState {
  step: number
  videoType: VideoType | null
  complexity: Complexity | null
  duration: Duration | null
  extras: KonfiguratorExtras
}

export interface PriceBreakdown {
  item: string
  price: number
}

export interface PriceResult {
  basePrice: number
  extrasPrice: number
  totalPrice: number
  priceRange: {
    min: number
    max: number
  }
  breakdown: PriceBreakdown[]
}

// ============================================
// FORM TYPES
// ============================================

export interface ContactFormData {
  name: string
  company?: string
  email: string
  phone?: string
  videoType?: string
  budget?: string
  message: string
  honeypot?: string // Spam protection
}

export interface KonfiguratorFormData {
  name: string
  email: string
  phone?: string
  company?: string
  message?: string
  configuration: {
    videoType: VideoType
    complexity: Complexity
    duration: Duration
    extras: KonfiguratorExtras
  }
  estimatedPrice: PriceResult
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface EmailResponse {
  id: string
}

// ============================================
// COMPONENT PROPS TYPES
// ============================================

export interface SectionProps {
  className?: string
  id?: string
}

export interface ServiceCardProps {
  service: Service
  index?: number
}

export interface ProjectCardProps {
  project: Project
  priority?: boolean
}

export interface TestimonialCardProps {
  testimonial: Testimonial
}

export interface FAQItemProps {
  faq: FAQ
  isOpen?: boolean
  onToggle?: () => void
}

// ============================================
// UTILITY TYPES
// ============================================

export type WithClassName<T = object> = T & {
  className?: string
}

export type WithChildren<T = object> = T & {
  children: React.ReactNode
}

// Navigation Item
export interface NavItem {
  label: string
  href: string
  external?: boolean
  children?: NavItem[]
}

// Breadcrumb
export interface BreadcrumbItem {
  label: string
  href?: string
}

// Meta Data
export interface PageMeta {
  title: string
  description: string
  image?: string
  noIndex?: boolean
}
```

### types/sanity.d.ts
```typescript
// Type definitions for Sanity queries
// Diese Datei wird von sanity-typegen generiert oder manuell gepflegt

declare module "sanity" {
  // Extend if needed
}
```

---

## SANITY SETUP

### sanity/sanity.config.ts
```typescript
import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "./schemas"
import { structure } from "./structure"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  name: "emmotion",
  title: "emmotion.ch",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: "2024-01-01" }),
  ],
  schema: {
    types: schemaTypes,
  },
})
```

### sanity/structure.ts
```typescript
import type { StructureResolver } from "sanity/structure"
import { 
  FileText, 
  Briefcase, 
  FolderOpen, 
  MessageSquare, 
  HelpCircle, 
  Settings,
  Users,
  Newspaper
} from "lucide-react"

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Inhalt")
    .items([
      // Singleton: Site Settings
      S.listItem()
        .title("Einstellungen")
        .icon(Settings)
        .child(
          S.document()
            .schemaType("settings")
            .documentId("settings")
        ),
      
      S.divider(),

      // Services
      S.listItem()
        .title("Leistungen")
        .icon(Briefcase)
        .schemaType("service")
        .child(S.documentTypeList("service").title("Leistungen")),

      // Projects
      S.listItem()
        .title("Portfolio")
        .icon(FolderOpen)
        .schemaType("project")
        .child(S.documentTypeList("project").title("Projekte")),

      // Testimonials
      S.listItem()
        .title("Testimonials")
        .icon(MessageSquare)
        .schemaType("testimonial")
        .child(S.documentTypeList("testimonial").title("Testimonials")),

      // FAQ
      S.listItem()
        .title("FAQ")
        .icon(HelpCircle)
        .schemaType("faq")
        .child(S.documentTypeList("faq").title("FAQ")),

      S.divider(),

      // Blog
      S.listItem()
        .title("Blog")
        .icon(Newspaper)
        .child(
          S.list()
            .title("Blog")
            .items([
              S.listItem()
                .title("Beiträge")
                .icon(FileText)
                .schemaType("post")
                .child(S.documentTypeList("post").title("Beiträge")),
              S.listItem()
                .title("Autoren")
                .icon(Users)
                .schemaType("author")
                .child(S.documentTypeList("author").title("Autoren")),
            ])
        ),

      // Pages (custom static pages)
      S.listItem()
        .title("Seiten")
        .icon(FileText)
        .schemaType("page")
        .child(S.documentTypeList("page").title("Seiten")),
    ])
```

### sanity/lib/client.ts
```typescript
import { createClient } from "next-sanity"
import imageUrlBuilder from "@sanity/image-url"
import type { SanityImage } from "@/types"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"

// Client für öffentliche Anfragen (ohne Token)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
})

// Client für Server-seitige Anfragen mit Draft-Unterstützung
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "previewDrafts",
  token: process.env.SANITY_API_TOKEN,
})

// Image URL Builder
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImage) {
  return builder.image(source)
}

// Helper für Image URLs mit Standard-Optionen
export function getImageUrl(
  image: SanityImage,
  width?: number,
  height?: number
): string {
  let imageBuilder = builder.image(image).auto("format").fit("max")
  
  if (width) imageBuilder = imageBuilder.width(width)
  if (height) imageBuilder = imageBuilder.height(height)
  
  return imageBuilder.url()
}

// Blur Data URL für Placeholder
export async function getImageBlurDataUrl(image: SanityImage): Promise<string> {
  const url = builder.image(image).width(20).quality(20).blur(10).url()
  
  try {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    return `data:image/jpeg;base64,${base64}`
  } catch {
    return ""
  }
}
```

### sanity/lib/queries.ts
```typescript
import { groq } from "next-sanity"

// ============================================
// SERVICES
// ============================================

export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    slug,
    shortDescription,
    icon,
    idealFor,
    priceFrom,
    featuredImage,
    "featuredImageUrl": featuredImage.asset->url
  }
`

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    shortDescription,
    description,
    icon,
    idealFor,
    priceFrom,
    featuredVideo,
    featuredImage,
    benefits,
    seo,
    "relatedProjects": *[_type == "project" && references(^._id)] | order(publishedAt desc) [0...3] {
      _id,
      title,
      slug,
      thumbnail,
      client
    }
  }
`

export const serviceSlugsQuery = groq`
  *[_type == "service" && defined(slug.current)][].slug.current
`

// ============================================
// PROJECTS
// ============================================

export const projectsQuery = groq`
  *[_type == "project"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    client,
    industry,
    thumbnail,
    featured,
    publishedAt,
    "category": category->{
      _id,
      title,
      slug
    }
  }
`

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(publishedAt desc) [0...4] {
    _id,
    title,
    slug,
    client,
    thumbnail,
    "category": category->{
      title
    }
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    client,
    industry,
    videoUrl,
    thumbnail,
    challenge,
    solution,
    result,
    publishedAt,
    "category": category->{
      _id,
      title,
      slug
    },
    "testimonial": testimonial->{
      _id,
      quote,
      author,
      position,
      company,
      image
    },
    "relatedProjects": *[_type == "project" && slug.current != $slug && category._ref == ^.category._ref] | order(publishedAt desc) [0...3] {
      _id,
      title,
      slug,
      thumbnail,
      client
    }
  }
`

export const projectSlugsQuery = groq`
  *[_type == "project" && defined(slug.current)][].slug.current
`

// ============================================
// TESTIMONIALS
// ============================================

export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(_createdAt desc) {
    _id,
    quote,
    author,
    position,
    company,
    image,
    featured
  }
`

export const featuredTestimonialsQuery = groq`
  *[_type == "testimonial" && featured == true] | order(_createdAt desc) [0...3] {
    _id,
    quote,
    author,
    position,
    company,
    image
  }
`

// ============================================
// FAQ
// ============================================

export const faqsQuery = groq`
  *[_type == "faq"] | order(order asc) {
    _id,
    question,
    answer,
    category,
    order
  }
`

export const faqsByCategoryQuery = groq`
  *[_type == "faq" && category == $category] | order(order asc) {
    _id,
    question,
    answer,
    category,
    order
  }
`

// ============================================
// BLOG
// ============================================

export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    publishedAt,
    "author": author->{
      name,
      image
    },
    categories
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    featuredImage,
    publishedAt,
    seo,
    "author": author->{
      name,
      image,
      bio
    },
    categories,
    "relatedPosts": *[_type == "post" && slug.current != $slug] | order(publishedAt desc) [0...3] {
      _id,
      title,
      slug,
      featuredImage,
      publishedAt
    }
  }
`

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`

// ============================================
// SITE SETTINGS
// ============================================

export const siteSettingsQuery = groq`
  *[_type == "settings"][0] {
    siteName,
    siteDescription,
    logo,
    contact,
    social,
    defaultSeo
  }
`

// ============================================
// SITEMAP
// ============================================

export const sitemapQuery = groq`
  {
    "services": *[_type == "service" && defined(slug.current)] {
      "slug": slug.current,
      _updatedAt
    },
    "projects": *[_type == "project" && defined(slug.current)] {
      "slug": slug.current,
      _updatedAt
    },
    "posts": *[_type == "post" && defined(slug.current)] {
      "slug": slug.current,
      _updatedAt
    }
  }
`
```

### sanity/lib/fetch.ts
```typescript
import { client, previewClient } from "./client"
import type { QueryParams } from "next-sanity"

// Cached fetch mit Tags für Revalidation
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  revalidate = 60,
}: {
  query: string
  params?: QueryParams
  tags?: string[]
  revalidate?: number | false
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate,
      tags,
    },
  })
}

// Preview fetch (für Draft-Mode)
export async function sanityFetchPreview<T>({
  query,
  params = {},
}: {
  query: string
  params?: QueryParams
}): Promise<T> {
  return previewClient.fetch<T>(query, params)
}
```

### sanity/lib/portable-text.tsx
```typescript
import { PortableText as BasePortableText } from "@portabletext/react"
import type { PortableTextBlock } from "@portabletext/types"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "./client"

const components = {
  types: {
    image: ({ value }: { value: { asset: { _ref: string }; alt?: string } }) => {
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || ""}
            width={800}
            height={450}
            className="rounded-lg"
          />
          {value.alt && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {value.alt}
            </figcaption>
          )}
        </figure>
      )
    },
    // YouTube Embed
    youtube: ({ value }: { value: { url: string } }) => {
      const videoId = value.url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      )?.[1]

      if (!videoId) return null

      return (
        <div className="my-8 aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full rounded-lg"
          />
        </div>
      )
    },
  },
  marks: {
    link: ({
      value,
      children,
    }: {
      value?: { href: string }
      children: React.ReactNode
    }) => {
      const href = value?.href || ""
      const isExternal = href.startsWith("http")

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {children}
          </a>
        )
      }

      return (
        <Link href={href} className="text-primary hover:underline">
          {children}
        </Link>
      )
    },
    internalLink: ({
      value,
      children,
    }: {
      value?: { slug: string }
      children: React.ReactNode
    }) => {
      return (
        <Link href={`/${value?.slug}`} className="text-primary hover:underline">
          {children}
        </Link>
      )
    },
  },
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mt-12 mb-4 text-3xl font-bold tracking-tight">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mt-8 mb-4 text-2xl font-semibold tracking-tight">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="mt-6 mb-3 text-xl font-semibold">{children}</h4>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-6 border-l-4 border-primary pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="my-4 ml-6 list-disc space-y-2">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="my-4 ml-6 list-decimal space-y-2">{children}</ol>
    ),
  },
}

interface PortableTextProps {
  value: PortableTextBlock[]
  className?: string
}

export function PortableText({ value, className }: PortableTextProps) {
  return (
    <div className={className}>
      <BasePortableText value={value} components={components} />
    </div>
  )
}
```

---

## API ROUTES

### app/api/contact/route.ts
```typescript
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { ContactEmail } from "@/emails/contact-notification"
import { ContactConfirmationEmail } from "@/emails/contact-confirmation"

const resend = new Resend(process.env.RESEND_API_KEY)

// Validation Schema
const contactSchema = z.object({
  name: z.string().min(2, "Name ist zu kurz").max(100),
  company: z.string().max(100).optional(),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  phone: z.string().max(30).optional(),
  videoType: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Nachricht ist zu kurz").max(5000),
  honeypot: z.string().max(0).optional(), // Spam protection
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Honeypot check
    if (body.honeypot) {
      // Bot detected, but return success to not reveal
      return NextResponse.json({ success: true })
    }

    // Validate
    const validatedData = contactSchema.parse(body)

    // Rate limiting check (simple implementation)
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    // TODO: Implement proper rate limiting with Redis/KV

    // Send notification email to Marcus
    const notificationResult = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: process.env.EMAIL_TO!,
      replyTo: validatedData.email,
      subject: `Neue Anfrage von ${validatedData.name}`,
      react: ContactEmail({
        name: validatedData.name,
        company: validatedData.company,
        email: validatedData.email,
        phone: validatedData.phone,
        videoType: validatedData.videoType,
        budget: validatedData.budget,
        message: validatedData.message,
      }),
    })

    // Send confirmation email to user
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: validatedData.email,
      subject: "Danke für Ihre Anfrage | emmotion.ch",
      react: ContactConfirmationEmail({
        name: validatedData.name,
      }),
    })

    return NextResponse.json({
      success: true,
      message: "Nachricht erfolgreich gesendet",
      id: notificationResult.data?.id,
    })
  } catch (error) {
    console.error("Contact form error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validierungsfehler",
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
      },
      { status: 500 }
    )
  }
}
```

### app/api/konfigurator/route.ts
```typescript
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { KonfiguratorEmail } from "@/emails/konfigurator-request"
import type { VideoType, Duration, Complexity, KonfiguratorExtras, PriceResult } from "@/types"

const resend = new Resend(process.env.RESEND_API_KEY)

// Validation Schema
const konfiguratorSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  company: z.string().max(100).optional(),
  message: z.string().max(2000).optional(),
  configuration: z.object({
    videoType: z.enum(["imagefilm", "recruiting", "produkt", "social"]),
    complexity: z.enum(["simple", "standard", "premium"]),
    duration: z.enum(["short", "medium", "long"]),
    extras: z.object({
      drone: z.boolean(),
      music: z.boolean(),
      subtitles: z.boolean(),
      socialCuts: z.boolean(),
      expressDelivery: z.boolean(),
    }),
  }),
  estimatedPrice: z.object({
    basePrice: z.number(),
    extrasPrice: z.number(),
    totalPrice: z.number(),
    priceRange: z.object({
      min: z.number(),
      max: z.number(),
    }),
    breakdown: z.array(
      z.object({
        item: z.string(),
        price: z.number(),
      })
    ),
  }),
})

// Label mappings for email
const VIDEO_TYPE_LABELS: Record<VideoType, string> = {
  imagefilm: "Imagefilm",
  recruiting: "Recruiting Video",
  produkt: "Produktvideo",
  social: "Social Media Content",
}

const COMPLEXITY_LABELS: Record<Complexity, string> = {
  simple: "Einfach",
  standard: "Standard",
  premium: "Premium",
}

const DURATION_LABELS: Record<Duration, string> = {
  short: "Kurz (bis 1 Min)",
  medium: "Mittel (1-2 Min)",
  long: "Lang (2-4 Min)",
}

const EXTRAS_LABELS: Record<keyof KonfiguratorExtras, string> = {
  drone: "Drohnenaufnahmen",
  music: "Premium-Musik",
  subtitles: "Untertitel",
  socialCuts: "Social Media Schnitte",
  expressDelivery: "Express-Lieferung",
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = konfiguratorSchema.parse(body)

    // Format extras for email
    const selectedExtras = Object.entries(validatedData.configuration.extras)
      .filter(([_, selected]) => selected)
      .map(([key]) => EXTRAS_LABELS[key as keyof KonfiguratorExtras])

    // Send email
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: process.env.EMAIL_TO!,
      replyTo: validatedData.email,
      subject: `Konfigurator-Anfrage: ${VIDEO_TYPE_LABELS[validatedData.configuration.videoType]}`,
      react: KonfiguratorEmail({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        message: validatedData.message,
        videoType: VIDEO_TYPE_LABELS[validatedData.configuration.videoType],
        complexity: COMPLEXITY_LABELS[validatedData.configuration.complexity],
        duration: DURATION_LABELS[validatedData.configuration.duration],
        extras: selectedExtras,
        priceRange: validatedData.estimatedPrice.priceRange,
        breakdown: validatedData.estimatedPrice.breakdown,
      }),
    })

    return NextResponse.json({
      success: true,
      message: "Anfrage erfolgreich gesendet",
      id: result.data?.id,
    })
  } catch (error) {
    console.error("Konfigurator form error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validierungsfehler",
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Ein Fehler ist aufgetreten",
      },
      { status: 500 }
    )
  }
}
```

### app/api/revalidate/route.ts
```typescript
import { revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import { parseBody } from "next-sanity/webhook"

// Sanity Webhook Secret
const secret = process.env.SANITY_REVALIDATE_SECRET

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string
      slug?: { current: string }
    }>(req, secret)

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 })
    }

    if (!body?._type) {
      return new NextResponse("Bad Request", { status: 400 })
    }

    // Revalidate based on document type
    const tagsToRevalidate: string[] = []

    switch (body._type) {
      case "service":
        tagsToRevalidate.push("services")
        if (body.slug?.current) {
          tagsToRevalidate.push(`service-${body.slug.current}`)
        }
        break
      case "project":
        tagsToRevalidate.push("projects")
        if (body.slug?.current) {
          tagsToRevalidate.push(`project-${body.slug.current}`)
        }
        break
      case "testimonial":
        tagsToRevalidate.push("testimonials")
        break
      case "faq":
        tagsToRevalidate.push("faqs")
        break
      case "post":
        tagsToRevalidate.push("posts")
        if (body.slug?.current) {
          tagsToRevalidate.push(`post-${body.slug.current}`)
        }
        break
      case "settings":
        tagsToRevalidate.push("settings")
        break
      default:
        tagsToRevalidate.push(body._type)
    }

    // Revalidate all tags
    for (const tag of tagsToRevalidate) {
      revalidateTag(tag)
    }

    return NextResponse.json({
      revalidated: true,
      tags: tagsToRevalidate,
      now: Date.now(),
    })
  } catch (err) {
    console.error("Revalidation error:", err)
    return new NextResponse("Error revalidating", { status: 500 })
  }
}
```

---

## MIDDLEWARE

### middleware.ts
```typescript
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const { pathname } = request.nextUrl

  // CORS für API Routes
  if (pathname.startsWith("/api/")) {
    response.headers.set("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_SITE_URL || "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    // Handle preflight
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: response.headers })
    }
  }

  // Security Headers sind in next.config.ts definiert

  // Locale Detection (falls mehrsprachig)
  // const locale = request.cookies.get('NEXT_LOCALE')?.value || 'de'

  return response
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
}
```

---

## REACT EMAIL TEMPLATES

### emails/contact-notification.tsx
```typescript
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Preview,
} from "@react-email/components"

interface ContactEmailProps {
  name: string
  company?: string
  email: string
  phone?: string
  videoType?: string
  budget?: string
  message: string
}

export function ContactEmail({
  name,
  company,
  email,
  phone,
  videoType,
  budget,
  message,
}: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Neue Kontaktanfrage von {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Neue Kontaktanfrage</Heading>
          
          <Section style={section}>
            <Text style={label}>Name</Text>
            <Text style={value}>{name}</Text>
          </Section>

          {company && (
            <Section style={section}>
              <Text style={label}>Firma</Text>
              <Text style={value}>{company}</Text>
            </Section>
          )}

          <Section style={section}>
            <Text style={label}>E-Mail</Text>
            <Text style={value}>{email}</Text>
          </Section>

          {phone && (
            <Section style={section}>
              <Text style={label}>Telefon</Text>
              <Text style={value}>{phone}</Text>
            </Section>
          )}

          {videoType && (
            <Section style={section}>
              <Text style={label}>Videotyp</Text>
              <Text style={value}>{videoType}</Text>
            </Section>
          )}

          {budget && (
            <Section style={section}>
              <Text style={label}>Budget</Text>
              <Text style={value}>{budget}</Text>
            </Section>
          )}

          <Hr style={hr} />

          <Section style={section}>
            <Text style={label}>Nachricht</Text>
            <Text style={messageStyle}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Gesendet über emmotion.ch Kontaktformular
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
  borderRadius: "8px",
}

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 30px",
}

const section = {
  marginBottom: "16px",
}

const label = {
  color: "#666666",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 4px",
}

const value = {
  color: "#1a1a1a",
  fontSize: "16px",
  margin: "0",
}

const messageStyle = {
  color: "#1a1a1a",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
}

const hr = {
  borderColor: "#e6e6e6",
  margin: "30px 0",
}

const footer = {
  color: "#999999",
  fontSize: "12px",
  margin: "0",
}

export default ContactEmail
```

### emails/contact-confirmation.tsx
```typescript
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Link,
  Preview,
} from "@react-email/components"

interface ContactConfirmationEmailProps {
  name: string
}

export function ContactConfirmationEmail({ name }: ContactConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Danke für Ihre Anfrage bei emmotion.ch</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Danke für Ihre Anfrage</Heading>
          
          <Text style={text}>
            Hallo {name},
          </Text>

          <Text style={text}>
            vielen Dank für Ihre Nachricht. Ich habe Ihre Anfrage erhalten 
            und melde mich innerhalb von 24 Stunden bei Ihnen.
          </Text>

          <Text style={text}>
            Falls Sie dringend sind, erreichen Sie mich auch telefonisch 
            unter <Link href="tel:+41XXXXXXXXX" style={link}>+41 71 XXX XX XX</Link>.
          </Text>

          <Section style={signature}>
            <Text style={text}>
              Herzliche Grüsse
            </Text>
            <Text style={textBold}>
              Marcus
            </Text>
            <Text style={textSmall}>
              emmotion.ch – Videoproduktion für Unternehmen
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
  borderRadius: "8px",
}

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 30px",
}

const text = {
  color: "#1a1a1a",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
}

const textBold = {
  ...text,
  fontWeight: "600",
}

const textSmall = {
  ...text,
  fontSize: "14px",
  color: "#666666",
}

const link = {
  color: "#2563eb",
  textDecoration: "none",
}

const signature = {
  marginTop: "32px",
}

export default ContactConfirmationEmail
```

### emails/konfigurator-request.tsx
```typescript
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Preview,
} from "@react-email/components"

interface KonfiguratorEmailProps {
  name: string
  email: string
  phone?: string
  company?: string
  message?: string
  videoType: string
  complexity: string
  duration: string
  extras: string[]
  priceRange: { min: number; max: number }
  breakdown: Array<{ item: string; price: number }>
}

export function KonfiguratorEmail({
  name,
  email,
  phone,
  company,
  message,
  videoType,
  complexity,
  duration,
  extras,
  priceRange,
  breakdown,
}: KonfiguratorEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Konfigurator-Anfrage: {videoType}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Konfigurator-Anfrage</Heading>
          
          {/* Contact Info */}
          <Section style={card}>
            <Text style={cardTitle}>Kontakt</Text>
            <Text style={value}><strong>Name:</strong> {name}</Text>
            <Text style={value}><strong>E-Mail:</strong> {email}</Text>
            {phone && <Text style={value}><strong>Telefon:</strong> {phone}</Text>}
            {company && <Text style={value}><strong>Firma:</strong> {company}</Text>}
          </Section>

          {/* Configuration */}
          <Section style={card}>
            <Text style={cardTitle}>Konfiguration</Text>
            <Text style={value}><strong>Videotyp:</strong> {videoType}</Text>
            <Text style={value}><strong>Umfang:</strong> {complexity}</Text>
            <Text style={value}><strong>Länge:</strong> {duration}</Text>
            {extras.length > 0 && (
              <Text style={value}><strong>Extras:</strong> {extras.join(", ")}</Text>
            )}
          </Section>

          {/* Price Breakdown */}
          <Section style={card}>
            <Text style={cardTitle}>Preisaufstellung</Text>
            {breakdown.map((item, index) => (
              <Text key={index} style={priceRow}>
                <span>{item.item}</span>
                <span>CHF {item.price.toLocaleString("de-CH")}</span>
              </Text>
            ))}
            <Hr style={hrLight} />
            <Text style={priceTotal}>
              <span>Geschätzter Rahmen</span>
              <span>CHF {priceRange.min.toLocaleString("de-CH")} – {priceRange.max.toLocaleString("de-CH")}</span>
            </Text>
          </Section>

          {/* Message */}
          {message && (
            <Section style={card}>
              <Text style={cardTitle}>Zusätzliche Nachricht</Text>
              <Text style={messageStyle}>{message}</Text>
            </Section>
          )}

          <Text style={footer}>
            Gesendet über emmotion.ch Konfigurator
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
  borderRadius: "8px",
}

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 30px",
}

const card = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
}

const cardTitle = {
  color: "#1a1a1a",
  fontSize: "14px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 12px",
}

const value = {
  color: "#1a1a1a",
  fontSize: "15px",
  margin: "0 0 8px",
}

const priceRow = {
  color: "#1a1a1a",
  fontSize: "15px",
  margin: "0 0 8px",
  display: "flex",
  justifyContent: "space-between",
}

const priceTotal = {
  ...priceRow,
  fontWeight: "600",
  fontSize: "16px",
}

const hrLight = {
  borderColor: "#e5e7eb",
  margin: "12px 0",
}

const messageStyle = {
  color: "#1a1a1a",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
}

const footer = {
  color: "#999999",
  fontSize: "12px",
  margin: "20px 0 0",
  textAlign: "center" as const,
}

export default KonfiguratorEmail
```

---

## FORM HANDLING

### lib/validations.ts
```typescript
import { z } from "zod"

// Contact Form
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name muss mindestens 2 Zeichen haben")
    .max(100, "Name darf maximal 100 Zeichen haben"),
  company: z
    .string()
    .max(100, "Firmenname darf maximal 100 Zeichen haben")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  phone: z
    .string()
    .max(30, "Telefonnummer darf maximal 30 Zeichen haben")
    .optional()
    .or(z.literal("")),
  videoType: z
    .string()
    .optional(),
  budget: z
    .string()
    .optional(),
  message: z
    .string()
    .min(10, "Nachricht muss mindestens 10 Zeichen haben")
    .max(5000, "Nachricht darf maximal 5000 Zeichen haben"),
  honeypot: z
    .string()
    .max(0)
    .optional(),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

// Konfigurator Form (Contact Step)
export const konfiguratorContactSchema = z.object({
  name: z
    .string()
    .min(2, "Name muss mindestens 2 Zeichen haben"),
  email: z
    .string()
    .email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  phone: z
    .string()
    .optional()
    .or(z.literal("")),
  company: z
    .string()
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .max(2000)
    .optional()
    .or(z.literal("")),
})

export type KonfiguratorContactValues = z.infer<typeof konfiguratorContactSchema>
```

### components/forms/contact-form.tsx
```typescript
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { contactFormSchema, type ContactFormValues } from "@/lib/validations"
import { cn } from "@/lib/utils"

type FormState = "idle" | "submitting" | "success" | "error"

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      videoType: "",
      budget: "",
      message: "",
      honeypot: "",
    },
  })

  const onSubmit = async (data: ContactFormValues) => {
    setFormState("submitting")
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setFormState("success")
        reset()
      } else {
        setFormState("error")
        setErrorMessage(result.error || "Ein Fehler ist aufgetreten")
      }
    } catch (error) {
      setFormState("error")
      setErrorMessage("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.")
    }
  }

  // Success State
  if (formState === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-2xl font-semibold mb-2">Nachricht gesendet!</h3>
        <p className="text-muted-foreground mb-6">
          Vielen Dank für Ihre Anfrage. Ich melde mich innerhalb von 24 Stunden bei Ihnen.
        </p>
        <Button onClick={() => setFormState("idle")} variant="outline">
          Neue Nachricht senden
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Honeypot - hidden from users, but bots fill it */}
      <input
        type="text"
        {...register("honeypot")}
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] opacity-0 h-0 w-0"
        aria-hidden="true"
      />

      {/* Error Message */}
      {formState === "error" && (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Name & Company */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Ihr Name"
            className={cn(errors.name && "border-destructive")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Firma</Label>
          <Input
            id="company"
            {...register("company")}
            placeholder="Ihre Firma (optional)"
          />
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">
            E-Mail <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="ihre@email.ch"
            className={cn(errors.email && "border-destructive")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            type="tel"
            {...register("phone")}
            placeholder="+41 71 XXX XX XX"
          />
        </div>
      </div>

      {/* Video Type & Budget */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="videoType">Art des Videos</Label>
          <Select onValueChange={(value) => setValue("videoType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Bitte wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imagefilm">Imagefilm</SelectItem>
              <SelectItem value="recruiting">Recruiting Video</SelectItem>
              <SelectItem value="produktvideo">Produktvideo</SelectItem>
              <SelectItem value="social">Social Media Content</SelectItem>
              <SelectItem value="other">Anderes / Weiss noch nicht</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Budget (optional)</Label>
          <Select onValueChange={(value) => setValue("budget", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Bitte wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bis-2000">Bis CHF 2'000</SelectItem>
              <SelectItem value="2000-5000">CHF 2'000 – 5'000</SelectItem>
              <SelectItem value="5000-10000">CHF 5'000 – 10'000</SelectItem>
              <SelectItem value="ueber-10000">Über CHF 10'000</SelectItem>
              <SelectItem value="unklar">Noch unklar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">
          Ihre Nachricht <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Erzählen Sie mir von Ihrem Projekt..."
          rows={5}
          className={cn(errors.message && "border-destructive")}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        disabled={formState === "submitting"}
        className="w-full md:w-auto"
      >
        {formState === "submitting" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Wird gesendet...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Nachricht senden
          </>
        )}
      </Button>
    </form>
  )
}
```

---

## ANIMATION PATTERNS

### lib/animations.ts
```typescript
import type { Variants } from "framer-motion"

// Fade In
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

// Fade Up
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

// Fade Down
export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

// Slide In from Left
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

// Slide In from Right
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

// Scale In
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

// Stagger Container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

// Stagger Item
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

// Viewport Animation Settings
export const viewportSettings = {
  once: true,
  margin: "-100px",
  amount: 0.3,
}

// Spring Animation for Hover
export const springHover = {
  scale: 1.02,
  transition: { type: "spring", stiffness: 300, damping: 20 },
}

// Tap Animation
export const tapAnimation = {
  scale: 0.98,
}
```

### components/shared/animated-section.tsx
```typescript
"use client"

import { motion, type Variants } from "framer-motion"
import { fadeUp, viewportSettings } from "@/lib/animations"
import { cn } from "@/lib/utils"

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  variants?: Variants
  delay?: number
}

export function AnimatedSection({
  children,
  className,
  variants = fadeUp,
  delay = 0,
}: AnimatedSectionProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={viewportSettings}
      variants={variants}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </motion.section>
  )
}
```

### components/shared/animated-text.tsx
```typescript
"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedTextProps {
  text: string
  className?: string
  once?: boolean
}

export function AnimatedText({ text, className, once = true }: AnimatedTextProps) {
  const words = text.split(" ")

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  }

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      className={cn("inline-block", className)}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}
```

---

## VIDEO HANDLING

### components/shared/video-player.tsx
```typescript
"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  src: string
  poster?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  className?: string
  aspectRatio?: "16:9" | "9:16" | "1:1" | "4:3"
}

export function VideoPlayer({
  src,
  poster,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = true,
  className,
  aspectRatio = "16:9",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(muted)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = () => setIsLoading(false)
    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100
      setProgress(progress)
    }
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        containerRef.current.requestFullscreen()
      }
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    videoRef.current.currentTime = percentage * videoRef.current.duration
  }

  const aspectRatioClass = {
    "16:9": "aspect-video",
    "9:16": "aspect-[9/16]",
    "1:1": "aspect-square",
    "4:3": "aspect-[4/3]",
  }[aspectRatio]

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative group rounded-lg overflow-hidden bg-black",
        aspectRatioClass,
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      )}

      {/* Play Button Overlay (when paused) */}
      {!isPlaying && !isLoading && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
        >
          <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center">
            <Play className="w-10 h-10 text-black ml-1" />
          </div>
        </button>
      )}

      {/* Controls */}
      {controls && (
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300",
            showControls || !isPlaying ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Progress Bar */}
          <div
            className="h-1 bg-white/30 rounded-full mb-3 cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white" />
                )}
              </button>
              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <Maximize className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

### components/shared/video-thumbnail.tsx
```typescript
"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoThumbnailProps {
  thumbnailSrc: string
  videoSrc?: string
  alt: string
  className?: string
  aspectRatio?: "16:9" | "9:16" | "1:1"
  priority?: boolean
  onClick?: () => void
}

export function VideoThumbnail({
  thumbnailSrc,
  videoSrc,
  alt,
  className,
  aspectRatio = "16:9",
  priority = false,
  onClick,
}: VideoThumbnailProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)

  const aspectRatioClass = {
    "16:9": "aspect-video",
    "9:16": "aspect-[9/16]",
    "1:1": "aspect-square",
  }[aspectRatio]

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden cursor-pointer group",
        aspectRatioClass,
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Thumbnail Image */}
      <Image
        src={thumbnailSrc}
        alt={alt}
        fill
        priority={priority}
        className={cn(
          "object-cover transition-transform duration-500",
          isHovered && "scale-105"
        )}
      />

      {/* Video Preview on Hover */}
      {videoSrc && isHovered && (
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            videoLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={cn(
            "w-16 h-16 rounded-full bg-white/90 flex items-center justify-center transition-transform duration-300",
            isHovered ? "scale-110" : "scale-100"
          )}
        >
          <Play className="w-7 h-7 text-black ml-1" />
        </div>
      </div>
    </div>
  )
}
```

### lib/video-utils.ts
```typescript
// Extract YouTube Video ID
export function getYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

// Extract Vimeo Video ID
export function getVimeoId(url: string): string | null {
  const regex = /(?:vimeo\.com\/)(\d+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

// Get YouTube Thumbnail URL
export function getYouTubeThumbnail(videoId: string, quality: "default" | "hq" | "mq" | "sd" | "maxres" = "hq"): string {
  const qualityMap = {
    default: "default",
    mq: "mqdefault",
    hq: "hqdefault",
    sd: "sddefault",
    maxres: "maxresdefault",
  }
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}

// Get Vimeo Thumbnail URL (requires API call, simplified version)
export async function getVimeoThumbnail(videoId: string): Promise<string | null> {
  try {
    const response = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`)
    const data = await response.json()
    return data[0]?.thumbnail_large || null
  } catch {
    return null
  }
}

// Format Video Duration
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

// Generate Video Embed URL
export function getEmbedUrl(url: string): string | null {
  const youtubeId = getYouTubeId(url)
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`
  }

  const vimeoId = getVimeoId(url)
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}?dnt=1`
  }

  return null
}
```

---

## IMAGE OPTIMIZATION

### components/shared/optimized-image.tsx
```typescript
import Image, { type ImageProps } from "next/image"
import { urlFor, getImageBlurDataUrl } from "@/sanity/lib/client"
import type { SanityImage } from "@/types"
import { cn } from "@/lib/utils"

interface OptimizedImageProps extends Omit<ImageProps, "src" | "alt"> {
  image: SanityImage
  alt: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  className?: string
  containerClassName?: string
  priority?: boolean
}

export async function OptimizedImage({
  image,
  alt,
  width,
  height,
  fill = false,
  sizes,
  className,
  containerClassName,
  priority = false,
  ...props
}: OptimizedImageProps) {
  // Generate image URL with Sanity
  let imageBuilder = urlFor(image).auto("format").fit("max")
  
  if (width) imageBuilder = imageBuilder.width(width)
  if (height) imageBuilder = imageBuilder.height(height)

  const src = imageBuilder.url()

  // Generate blur placeholder
  const blurDataURL = await getImageBlurDataUrl(image)

  // Common sizes presets
  const defaultSizes = fill
    ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    : undefined

  if (fill) {
    return (
      <div className={cn("relative", containerClassName)}>
        <Image
          src={src}
          alt={alt || image.alt || ""}
          fill
          sizes={sizes || defaultSizes}
          className={cn("object-cover", className)}
          placeholder={blurDataURL ? "blur" : "empty"}
          blurDataURL={blurDataURL}
          priority={priority}
          {...props}
        />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt || image.alt || ""}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
      priority={priority}
      {...props}
    />
  )
}
```

---

## CACHING STRATEGIES

### lib/cache.ts
```typescript
import { unstable_cache } from "next/cache"
import { sanityFetch } from "@/sanity/lib/fetch"
import {
  servicesQuery,
  projectsQuery,
  testimonialsQuery,
  faqsQuery,
  siteSettingsQuery,
} from "@/sanity/lib/queries"
import type { Service, Project, Testimonial, FAQ, SiteSettings } from "@/types"

// Cache Tags
export const CACHE_TAGS = {
  services: "services",
  projects: "projects",
  testimonials: "testimonials",
  faqs: "faqs",
  settings: "settings",
  posts: "posts",
} as const

// Cached Data Fetchers

export const getServices = unstable_cache(
  async () => {
    return sanityFetch<Service[]>({
      query: servicesQuery,
      tags: [CACHE_TAGS.services],
    })
  },
  ["services"],
  { revalidate: 3600, tags: [CACHE_TAGS.services] }
)

export const getProjects = unstable_cache(
  async () => {
    return sanityFetch<Project[]>({
      query: projectsQuery,
      tags: [CACHE_TAGS.projects],
    })
  },
  ["projects"],
  { revalidate: 3600, tags: [CACHE_TAGS.projects] }
)

export const getTestimonials = unstable_cache(
  async () => {
    return sanityFetch<Testimonial[]>({
      query: testimonialsQuery,
      tags: [CACHE_TAGS.testimonials],
    })
  },
  ["testimonials"],
  { revalidate: 3600, tags: [CACHE_TAGS.testimonials] }
)

export const getFaqs = unstable_cache(
  async () => {
    return sanityFetch<FAQ[]>({
      query: faqsQuery,
      tags: [CACHE_TAGS.faqs],
    })
  },
  ["faqs"],
  { revalidate: 3600, tags: [CACHE_TAGS.faqs] }
)

export const getSiteSettings = unstable_cache(
  async () => {
    return sanityFetch<SiteSettings>({
      query: siteSettingsQuery,
      tags: [CACHE_TAGS.settings],
    })
  },
  ["settings"],
  { revalidate: 86400, tags: [CACHE_TAGS.settings] } // 24 hours
)
```

---

## ERROR HANDLING

### app/error.tsx
```typescript
"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Etwas ist schiefgelaufen</h1>
        <p className="text-muted-foreground mb-6">
          Ein unerwarteter Fehler ist aufgetreten. 
          Bitte versuchen Sie es erneut oder kontaktieren Sie mich, 
          wenn das Problem bestehen bleibt.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="default">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Erneut versuchen
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Zur Startseite
            </Link>
          </Button>
        </div>

        {error.digest && (
          <p className="mt-6 text-xs text-muted-foreground">
            Fehler-ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
```

### app/not-found.tsx
```typescript
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <span className="text-8xl font-bold text-muted-foreground/20">404</span>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Seite nicht gefunden</h1>
        <p className="text-muted-foreground mb-6">
          Die gesuchte Seite existiert nicht oder wurde verschoben. 
          Überprüfen Sie die URL oder navigieren Sie zurück zur Startseite.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Zur Startseite
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/portfolio">
              <Search className="w-4 h-4 mr-2" />
              Portfolio ansehen
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
```

### lib/error-utils.ts
```typescript
// Error Types
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = "AppError"
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(message, 400, "VALIDATION_ERROR")
    this.name = "ValidationError"
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND")
    this.name = "NotFoundError"
  }
}

// Error Handler for API Routes
export function handleApiError(error: unknown): Response {
  console.error("API Error:", error)

  if (error instanceof AppError) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        code: error.code,
      }),
      { status: error.statusCode }
    )
  }

  if (error instanceof Error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Ein interner Fehler ist aufgetreten",
      }),
      { status: 500 }
    )
  }

  return new Response(
    JSON.stringify({
      success: false,
      error: "Ein unbekannter Fehler ist aufgetreten",
    }),
    { status: 500 }
  )
}
```

---

## ACCESSIBILITY

### lib/a11y.ts
```typescript
// Keyboard Navigation Helper
export function handleKeyboardNavigation(
  event: React.KeyboardEvent,
  callbacks: {
    onEnter?: () => void
    onEscape?: () => void
    onArrowUp?: () => void
    onArrowDown?: () => void
    onArrowLeft?: () => void
    onArrowRight?: () => void
    onTab?: () => void
  }
) {
  const { key } = event

  switch (key) {
    case "Enter":
    case " ":
      event.preventDefault()
      callbacks.onEnter?.()
      break
    case "Escape":
      callbacks.onEscape?.()
      break
    case "ArrowUp":
      event.preventDefault()
      callbacks.onArrowUp?.()
      break
    case "ArrowDown":
      event.preventDefault()
      callbacks.onArrowDown?.()
      break
    case "ArrowLeft":
      callbacks.onArrowLeft?.()
      break
    case "ArrowRight":
      callbacks.onArrowRight?.()
      break
    case "Tab":
      callbacks.onTab?.()
      break
  }
}

// Focus Trap Hook
import { useEffect, useRef } from "react"

export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener("keydown", handleKeyDown)
    firstElement?.focus()

    return () => container.removeEventListener("keydown", handleKeyDown)
  }, [isActive])

  return containerRef
}

// Screen Reader Only Text
export const srOnly = "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
```

### components/shared/skip-link.tsx
```typescript
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
    >
      Zum Hauptinhalt springen
    </a>
  )
}
```

---

## TESTING

### Testing Setup (Optional, wenn gewünscht)

```bash
# Testing Dependencies
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

### vitest.config.ts
```typescript
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    css: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
})
```

### tests/setup.ts
```typescript
import "@testing-library/jest-dom"
import { vi } from "vitest"

// Mock Next.js Router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Next.js Image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    <img src={src} alt={alt} {...props} />
  ),
}))
```

---

## DEPLOYMENT

### Vercel Deployment Checklist

```markdown
## Pre-Deployment

- [ ] All environment variables set in Vercel Dashboard
- [ ] Domain configured and DNS propagated
- [ ] Sanity CORS origins include production domain
- [ ] Sanity webhook configured for production
- [ ] Email sending tested (Resend domain verified)
- [ ] Analytics configured

## Environment Variables (Vercel)

NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=xxx
SANITY_REVALIDATE_SECRET=xxx
RESEND_API_KEY=xxx
EMAIL_FROM=hallo@emmotion.ch
EMAIL_TO=hallo@emmotion.ch
NEXT_PUBLIC_SITE_URL=https://emmotion.ch
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=emmotion.ch

## Post-Deployment

- [ ] Test contact form
- [ ] Test konfigurator form
- [ ] Verify all pages load correctly
- [ ] Check Core Web Vitals
- [ ] Submit sitemap to Google Search Console
- [ ] Verify robots.txt
- [ ] Test on mobile devices
```

### vercel.json (Optional, für spezielle Konfiguration)
```json
{
  "buildCommand": "next build",
  "framework": "nextjs",
  "regions": ["fra1"],
  "crons": []
}
```

---

## UTILITIES

### lib/utils.ts
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Class Name Merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format Currency (CHF)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format Date
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }
  return new Intl.DateTimeFormat("de-CH", options || defaultOptions).format(
    typeof date === "string" ? new Date(date) : date
  )
}

// Truncate Text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + "..."
}

// Generate Slug
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// Absolute URL
export function absoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`
}

// Debounce Function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Generate Random ID
export function generateId(prefix = ""): string {
  const random = Math.random().toString(36).substring(2, 9)
  return prefix ? `${prefix}-${random}` : random
}
```

### lib/constants.ts
```typescript
// Site Configuration
export const SITE_CONFIG = {
  name: "emmotion.ch",
  title: "Videoproduktion Rheintal & Liechtenstein",
  description: "Professionelle Videos für Unternehmen: Imagefilm, Recruiting Video, Produktvideo. Mit TV-Erfahrung, persönlich und regional.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://emmotion.ch",
  locale: "de-CH",
  author: {
    name: "Marcus",
    email: "hallo@emmotion.ch",
    phone: "+41 71 XXX XX XX",
  },
} as const

// Navigation Items
export const NAV_ITEMS = [
  { label: "Leistungen", href: "/leistungen" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Über mich", href: "/ueber-mich" },
  { label: "Prozess", href: "/prozess" },
  { label: "FAQ", href: "/faq" },
  { label: "Kontakt", href: "/kontakt" },
] as const

// Footer Navigation
export const FOOTER_NAV = {
  main: NAV_ITEMS,
  legal: [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
  ],
} as const

// Social Links
export const SOCIAL_LINKS = {
  linkedin: "https://linkedin.com/in/xxx",
  instagram: "https://instagram.com/emmotion.ch",
  youtube: "https://youtube.com/@emmotion",
} as const

// Video Types for Forms
export const VIDEO_TYPES = [
  { value: "imagefilm", label: "Imagefilm" },
  { value: "recruiting", label: "Recruiting Video" },
  { value: "produktvideo", label: "Produktvideo" },
  { value: "social", label: "Social Media Content" },
  { value: "other", label: "Anderes / Weiss noch nicht" },
] as const

// Budget Options
export const BUDGET_OPTIONS = [
  { value: "bis-2000", label: "Bis CHF 2'000" },
  { value: "2000-5000", label: "CHF 2'000 – 5'000" },
  { value: "5000-10000", label: "CHF 5'000 – 10'000" },
  { value: "ueber-10000", label: "Über CHF 10'000" },
  { value: "unklar", label: "Noch unklar" },
] as const

// Industries
export const INDUSTRIES = [
  { value: "gastronomie", label: "Gastronomie" },
  { value: "industrie", label: "Industrie" },
  { value: "handwerk", label: "Handwerk" },
  { value: "gesundheit", label: "Gesundheit" },
  { value: "dienstleistung", label: "Dienstleistung" },
  { value: "tourismus", label: "Tourismus" },
  { value: "sonstiges", label: "Sonstiges" },
] as const
```

---

## ZUSAMMENFASSUNG

Diese technische Dokumentation ergänzt CLAUDE.md um:

1. **Vollständige Konfigurationsdateien** (Next.js, Tailwind, TypeScript)
2. **Alle TypeScript Types** für das Projekt
3. **Komplettes Sanity Setup** mit Client, Queries und Portable Text
4. **API Routes** für Kontaktformular, Konfigurator und Revalidation
5. **E-Mail Templates** mit React Email
6. **Form Handling** mit Zod Validation
7. **Animation Patterns** mit Framer Motion
8. **Video & Image Handling** Komponenten
9. **Caching Strategies** mit unstable_cache
10. **Error Handling** (Error Boundaries, API Errors)
11. **Accessibility Helpers**
12. **Deployment Checkliste**
13. **Utility Functions**

Claude Code sollte diese Dokumentation als Referenz nutzen und die Code-Snippets direkt übernehmen oder anpassen können.
