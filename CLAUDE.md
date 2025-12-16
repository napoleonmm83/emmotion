# CLAUDE.md – Projektanweisung emmotion.ch

> Diese Datei dient als Kontext für Claude Code. Lies sie vollständig, bevor du Code schreibst.

---

## PROJEKTÜBERSICHT

**Projekt:** emmotion.ch – Website für Videoproduktion
**Kunde:** Marcus, Videograf im Rheintal/Liechtenstein/Ostschweiz
**Ziel:** Professionelle, performante Website mit CMS zur Kundenakquise

### Kernfunktionen
1. Portfolio mit Video-Showcase
2. Service-Seiten (SEO-optimiert)
3. Video-Konfigurator (Preiskalkulator)
4. Kontaktformular mit E-Mail-Versand
5. FAQ-Bereich
6. Blog (optional, Phase 2)

### Unique Selling Points (im Design hervorheben)
- TV-Erfahrung (Regionalfernsehen)
- Persönlich statt Agentur
- Regional verwurzelt (Rheintal, Liechtenstein, Ostschweiz)

---

## TECH STACK

```yaml
Framework:      Next.js 15 (App Router)
Language:       TypeScript (strict mode)
Styling:        Tailwind CSS 4 + CSS Variables
UI Components:  shadcn/ui
CMS:            Sanity v3
Hosting:        Vercel
Video Player:   Mux Player oder native HTML5 mit lazy loading
Forms:          React Hook Form + Zod
Email:          Resend + React Email
Analytics:      Plausible (DSGVO-konform)
Icons:          Lucide React
Animations:     Framer Motion (sparsam einsetzen)
```

### Wichtige Packages
```bash
# Core
next@latest react@latest react-dom@latest typescript

# Styling & UI
tailwindcss @tailwindcss/typography class-variance-authority clsx tailwind-merge
lucide-react framer-motion

# shadcn dependencies (nach init)
# Komponenten einzeln installieren via: npx shadcn@latest add [component]

# CMS
next-sanity @sanity/image-url @sanity/vision @portabletext/react

# Forms & Validation
react-hook-form @hookform/resolvers zod

# Email
resend @react-email/components

# Utils
date-fns slugify
```

---

## PROJEKTSTRUKTUR

```
emmotion-website/
├── app/
│   ├── (site)/                    # Hauptseiten (mit Layout)
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Startseite
│   │   ├── leistungen/
│   │   │   ├── page.tsx           # Übersicht
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # Einzelne Leistung
│   │   ├── portfolio/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── ueber-mich/
│   │   │   └── page.tsx
│   │   ├── prozess/
│   │   │   └── page.tsx
│   │   ├── konfigurator/
│   │   │   └── page.tsx
│   │   ├── faq/
│   │   │   └── page.tsx
│   │   ├── kontakt/
│   │   │   └── page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── impressum/
│   │   │   └── page.tsx
│   │   └── datenschutz/
│   │       └── page.tsx
│   ├── api/
│   │   ├── contact/
│   │   │   └── route.ts           # Kontaktformular
│   │   ├── konfigurator/
│   │   │   └── route.ts           # Konfigurator-Anfrage
│   │   └── revalidate/
│   │       └── route.ts           # Sanity Webhook
│   ├── studio/
│   │   └── [[...index]]/
│   │       └── page.tsx           # Sanity Studio
│   ├── globals.css
│   ├── layout.tsx                 # Root Layout
│   └── not-found.tsx
├── components/
│   ├── ui/                        # shadcn/ui Komponenten
│   ├── sections/                  # Sektionen für Seiten
│   │   ├── hero.tsx
│   │   ├── services-grid.tsx
│   │   ├── portfolio-teaser.tsx
│   │   ├── testimonials.tsx
│   │   ├── process-timeline.tsx
│   │   ├── cta-section.tsx
│   │   ├── faq-accordion.tsx
│   │   └── konfigurator/
│   │       ├── konfigurator.tsx
│   │       ├── step-video-type.tsx
│   │       ├── step-options.tsx
│   │       ├── step-extras.tsx
│   │       └── step-result.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── mobile-nav.tsx
│   │   └── logo.tsx
│   ├── shared/
│   │   ├── video-player.tsx
│   │   ├── video-thumbnail.tsx
│   │   ├── section-header.tsx
│   │   ├── container.tsx
│   │   └── animated-counter.tsx
│   └── forms/
│       ├── contact-form.tsx
│       └── konfigurator-form.tsx
├── sanity/
│   ├── schemas/
│   │   ├── index.ts
│   │   ├── service.ts
│   │   ├── project.ts
│   │   ├── testimonial.ts
│   │   ├── faq.ts
│   │   ├── page.ts
│   │   ├── post.ts
│   │   ├── author.ts
│   │   └── settings.ts
│   ├── lib/
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   ├── image.ts
│   │   └── portable-text.tsx
│   ├── sanity.config.ts
│   └── sanity.cli.ts
├── lib/
│   ├── utils.ts                   # cn() helper etc.
│   ├── constants.ts               # Site config
│   ├── validations.ts             # Zod schemas
│   └── konfigurator-logic.ts      # Preisberechnung
├── emails/
│   ├── contact-notification.tsx
│   └── konfigurator-request.tsx
├── public/
│   ├── fonts/
│   ├── images/
│   └── videos/
├── types/
│   └── index.ts
├── CLAUDE.md                      # Diese Datei
├── TEXTE.md                       # Alle Website-Texte
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## DESIGN SYSTEM

### Farben (CSS Variables in globals.css)

```css
:root {
  /* Brand Colors */
  --color-primary: 220 90% 56%;      /* Blau - Vertrauen, Professionalität */
  --color-primary-foreground: 0 0% 100%;
  
  /* Neutrals - Dunkles Theme-freundlich */
  --color-background: 0 0% 100%;
  --color-foreground: 222 47% 11%;
  --color-muted: 210 40% 96%;
  --color-muted-foreground: 215 16% 47%;
  
  /* Accent */
  --color-accent: 262 83% 58%;       /* Violett - Kreativität */
  --color-accent-foreground: 0 0% 100%;
  
  /* Semantic */
  --color-destructive: 0 84% 60%;
  --color-border: 214 32% 91%;
  --color-ring: 222 47% 11%;
  
  /* Radius */
  --radius: 0.5rem;
}

.dark {
  --color-background: 222 47% 11%;
  --color-foreground: 210 40% 98%;
  --color-muted: 217 33% 17%;
  --color-muted-foreground: 215 20% 65%;
  --color-border: 217 33% 17%;
}
```

### Typografie

```css
/* Font Stack */
--font-sans: "Inter", system-ui, sans-serif;
--font-display: "Inter", system-ui, sans-serif;  /* oder eigene Display-Font */

/* Font Sizes (Tailwind) */
text-sm:    0.875rem / 1.25rem
text-base:  1rem / 1.5rem
text-lg:    1.125rem / 1.75rem
text-xl:    1.25rem / 1.75rem
text-2xl:   1.5rem / 2rem
text-3xl:   1.875rem / 2.25rem
text-4xl:   2.25rem / 2.5rem
text-5xl:   3rem / 1.1
text-6xl:   3.75rem / 1.1
```

### Spacing Scale

```
Sections:     py-16 md:py-24 lg:py-32
Container:    px-4 md:px-6 lg:px-8, max-w-7xl mx-auto
Cards:        p-6 md:p-8
Gaps:         gap-4, gap-6, gap-8, gap-12
```

### Design-Prinzipien

1. **Cleanes, modernes Design** – Viel Weissraum, klare Hierarchie
2. **Video im Fokus** – Grosszügige Video-Darstellung, elegante Player
3. **Dunkle Akzente** – Hero kann dunkel sein, Rest hell
4. **Subtile Animationen** – Fade-in beim Scrollen, Hover-States
5. **Mobile First** – Alle Layouts zuerst für Mobile designen

---

## KOMPONENTEN-PATTERNS

### Container Component
```tsx
// components/shared/container.tsx
import { cn } from "@/lib/utils"

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: "default" | "small" | "large"
}

export function Container({ children, className, size = "default" }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-4 md:px-6 lg:px-8",
        {
          "max-w-5xl": size === "small",
          "max-w-7xl": size === "default",
          "max-w-[1400px]": size === "large",
        },
        className
      )}
    >
      {children}
    </div>
  )
}
```

### Section Header Component
```tsx
// components/shared/section-header.tsx
interface SectionHeaderProps {
  title: string
  subtitle?: string
  centered?: boolean
}

export function SectionHeader({ title, subtitle, centered = true }: SectionHeaderProps) {
  return (
    <div className={cn("mb-12 md:mb-16", centered && "text-center")}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}
```

### Video Player Component
```tsx
// components/shared/video-player.tsx
"use client"

import { useState, useRef } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface VideoPlayerProps {
  src: string
  poster?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  className?: string
}

export function VideoPlayer({
  src,
  poster,
  autoPlay = false,
  muted = true,
  loop = false,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(muted)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className={cn("relative group rounded-lg overflow-hidden", className)}>
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
      
      {/* Controls Overlay */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-4 left-4 flex gap-2">
          <button
            onClick={togglePlay}
            className="p-2 bg-white/90 rounded-full hover:bg-white transition"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleMute}
            className="p-2 bg-white/90 rounded-full hover:bg-white transition"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

## SANITY SCHEMAS

### Service Schema
```typescript
// sanity/schemas/service.ts
import { defineType, defineField } from "sanity"

export default defineType({
  name: "service",
  title: "Leistung",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Kurzbeschreibung",
      type: "text",
      rows: 3,
      description: "Für Übersichtsseiten und Cards",
    }),
    defineField({
      name: "description",
      title: "Ausführliche Beschreibung",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "icon",
      title: "Icon Name",
      type: "string",
      description: "Lucide Icon Name (z.B. 'video', 'users', 'package')",
    }),
    defineField({
      name: "idealFor",
      title: "Ideal für",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "priceFrom",
      title: "Preis ab (CHF)",
      type: "number",
    }),
    defineField({
      name: "featuredVideo",
      title: "Beispiel-Video URL",
      type: "url",
    }),
    defineField({
      name: "featuredImage",
      title: "Vorschaubild",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "benefits",
      title: "Vorteile",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Titel" },
            { name: "description", type: "text", title: "Beschreibung" },
          ],
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "metaTitle", type: "string", title: "Meta Title" },
        { name: "metaDescription", type: "text", title: "Meta Description" },
      ],
    }),
    defineField({
      name: "order",
      title: "Reihenfolge",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Reihenfolge",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
})
```

### Project Schema
```typescript
// sanity/schemas/project.ts
import { defineType, defineField } from "sanity"

export default defineType({
  name: "project",
  title: "Projekt",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "client",
      title: "Kunde",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Kategorie",
      type: "reference",
      to: [{ type: "service" }],
    }),
    defineField({
      name: "industry",
      title: "Branche",
      type: "string",
      options: {
        list: [
          { title: "Gastronomie", value: "gastronomie" },
          { title: "Industrie", value: "industrie" },
          { title: "Handwerk", value: "handwerk" },
          { title: "Gesundheit", value: "gesundheit" },
          { title: "Dienstleistung", value: "dienstleistung" },
          { title: "Tourismus", value: "tourismus" },
          { title: "Sonstiges", value: "sonstiges" },
        ],
      },
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description: "Vimeo, YouTube oder direkte URL",
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "challenge",
      title: "Herausforderung",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "solution",
      title: "Lösung",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "result",
      title: "Ergebnis",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "testimonial",
      title: "Kundenstimme",
      type: "reference",
      to: [{ type: "testimonial" }],
    }),
    defineField({
      name: "featured",
      title: "Auf Startseite zeigen",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Veröffentlicht am",
      type: "date",
    }),
  ],
  orderings: [
    {
      title: "Neueste zuerst",
      name: "dateDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      client: "client",
      media: "thumbnail",
    },
    prepare({ title, client, media }) {
      return {
        title,
        subtitle: client,
        media,
      }
    },
  },
})
```

### FAQ Schema
```typescript
// sanity/schemas/faq.ts
import { defineType, defineField } from "sanity"

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Frage",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Antwort",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategorie",
      type: "string",
      options: {
        list: [
          { title: "Kosten & Preise", value: "kosten" },
          { title: "Ablauf & Prozess", value: "ablauf" },
          { title: "Technik & Qualität", value: "technik" },
          { title: "Allgemein", value: "allgemein" },
        ],
      },
    }),
    defineField({
      name: "order",
      title: "Reihenfolge",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Reihenfolge",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
})
```

### Testimonial Schema
```typescript
// sanity/schemas/testimonial.ts
import { defineType, defineField } from "sanity"

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Zitat",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "string",
    }),
    defineField({
      name: "company",
      title: "Firma",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Bild",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "project",
      title: "Zugehöriges Projekt",
      type: "reference",
      to: [{ type: "project" }],
    }),
    defineField({
      name: "featured",
      title: "Auf Startseite zeigen",
      type: "boolean",
      initialValue: false,
    }),
  ],
})
```

### Site Settings Schema
```typescript
// sanity/schemas/settings.ts
import { defineType, defineField } from "sanity"

export default defineType({
  name: "settings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Website Name",
      type: "string",
    }),
    defineField({
      name: "siteDescription",
      title: "Website Beschreibung",
      type: "text",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
    }),
    defineField({
      name: "contact",
      title: "Kontakt",
      type: "object",
      fields: [
        { name: "email", type: "string", title: "E-Mail" },
        { name: "phone", type: "string", title: "Telefon" },
        { name: "address", type: "text", title: "Adresse" },
      ],
    }),
    defineField({
      name: "social",
      title: "Social Media",
      type: "object",
      fields: [
        { name: "linkedin", type: "url", title: "LinkedIn" },
        { name: "instagram", type: "url", title: "Instagram" },
        { name: "youtube", type: "url", title: "YouTube" },
      ],
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "object",
      fields: [
        { name: "metaTitle", type: "string", title: "Default Meta Title" },
        { name: "metaDescription", type: "text", title: "Default Meta Description" },
        { name: "ogImage", type: "image", title: "Default OG Image" },
      ],
    }),
  ],
  // Singleton
  __experimental_actions: ["update", "publish"],
})
```

---

## KONFIGURATOR LOGIK

### Preisberechnung
```typescript
// lib/konfigurator-logic.ts

export type VideoType = "imagefilm" | "recruiting" | "produkt" | "social"
export type Duration = "short" | "medium" | "long"
export type Complexity = "simple" | "standard" | "premium"

interface KonfiguratorInput {
  videoType: VideoType
  duration: Duration
  complexity: Complexity
  extras: {
    drone: boolean
    music: boolean
    subtitles: boolean
    socialCuts: boolean
    expressDelivery: boolean
  }
}

interface PriceResult {
  basePrice: number
  extrasPrice: number
  totalPrice: number
  priceRange: {
    min: number
    max: number
  }
  breakdown: Array<{
    item: string
    price: number
  }>
}

const BASE_PRICES: Record<VideoType, Record<Complexity, number>> = {
  imagefilm: { simple: 2400, standard: 3800, premium: 5500 },
  recruiting: { simple: 1800, standard: 2800, premium: 4200 },
  produkt: { simple: 800, standard: 1500, premium: 2500 },
  social: { simple: 600, standard: 1200, premium: 2000 },
}

const DURATION_MULTIPLIER: Record<Duration, number> = {
  short: 1,      // bis 1 Min
  medium: 1.4,   // 1-2 Min
  long: 1.8,     // 2-4 Min
}

const EXTRAS_PRICES = {
  drone: 400,
  music: 150,
  subtitles: 200,
  socialCuts: 300,
  expressDelivery: 500,
}

export function calculatePrice(input: KonfiguratorInput): PriceResult {
  const basePrice = BASE_PRICES[input.videoType][input.complexity]
  const multipliedPrice = basePrice * DURATION_MULTIPLIER[input.duration]
  
  const breakdown: Array<{ item: string; price: number }> = [
    { item: "Basispreis", price: Math.round(multipliedPrice) },
  ]
  
  let extrasPrice = 0
  
  if (input.extras.drone) {
    extrasPrice += EXTRAS_PRICES.drone
    breakdown.push({ item: "Drohnenaufnahmen", price: EXTRAS_PRICES.drone })
  }
  if (input.extras.music) {
    extrasPrice += EXTRAS_PRICES.music
    breakdown.push({ item: "Lizenzfreie Musik", price: EXTRAS_PRICES.music })
  }
  if (input.extras.subtitles) {
    extrasPrice += EXTRAS_PRICES.subtitles
    breakdown.push({ item: "Untertitel", price: EXTRAS_PRICES.subtitles })
  }
  if (input.extras.socialCuts) {
    extrasPrice += EXTRAS_PRICES.socialCuts
    breakdown.push({ item: "Social Media Schnitte", price: EXTRAS_PRICES.socialCuts })
  }
  if (input.extras.expressDelivery) {
    extrasPrice += EXTRAS_PRICES.expressDelivery
    breakdown.push({ item: "Express-Lieferung", price: EXTRAS_PRICES.expressDelivery })
  }
  
  const totalPrice = Math.round(multipliedPrice) + extrasPrice
  
  return {
    basePrice: Math.round(multipliedPrice),
    extrasPrice,
    totalPrice,
    priceRange: {
      min: Math.round(totalPrice * 0.85),
      max: Math.round(totalPrice * 1.15),
    },
    breakdown,
  }
}
```

---

## SEO REQUIREMENTS

### Jede Seite braucht:
```typescript
// Metadata in page.tsx
export const metadata: Metadata = {
  title: "Seitentitel | emmotion.ch",
  description: "Max 155 Zeichen...",
  openGraph: {
    title: "...",
    description: "...",
    images: [{ url: "/og-image.jpg" }],
  },
}
```

### Schema.org Markup
```typescript
// Für LocalBusiness (im Root Layout)
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "emmotion.ch",
  description: "Videoproduktion für Unternehmen",
  url: "https://emmotion.ch",
  telephone: "+41 71 XXX XX XX",
  email: "hallo@emmotion.ch",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Rheintal",
    addressRegion: "St. Gallen",
    addressCountry: "CH",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "47.XXX",
    longitude: "9.XXX",
  },
  areaServed: ["Rheintal", "Liechtenstein", "Ostschweiz", "St. Gallen"],
  priceRange: "CHF 800 - CHF 6000",
}

// Für Videos (auf Portfolio-Seiten)
const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "...",
  description: "...",
  thumbnailUrl: "...",
  uploadDate: "...",
  duration: "PT2M30S",
  contentUrl: "...",
}

// Für FAQ
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "...",
      acceptedAnswer: {
        "@type": "Answer",
        text: "...",
      },
    },
  ],
}
```

### Sitemap & Robots
```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all dynamic pages from Sanity
  const services = await getServices()
  const projects = await getProjects()
  
  const staticPages = [
    { url: "https://emmotion.ch", lastModified: new Date(), priority: 1 },
    { url: "https://emmotion.ch/leistungen", lastModified: new Date(), priority: 0.9 },
    { url: "https://emmotion.ch/portfolio", lastModified: new Date(), priority: 0.9 },
    { url: "https://emmotion.ch/ueber-mich", lastModified: new Date(), priority: 0.8 },
    { url: "https://emmotion.ch/kontakt", lastModified: new Date(), priority: 0.8 },
    { url: "https://emmotion.ch/faq", lastModified: new Date(), priority: 0.7 },
    { url: "https://emmotion.ch/konfigurator", lastModified: new Date(), priority: 0.8 },
  ]
  
  const servicePages = services.map((s) => ({
    url: `https://emmotion.ch/leistungen/${s.slug}`,
    lastModified: new Date(),
    priority: 0.8,
  }))
  
  const projectPages = projects.map((p) => ({
    url: `https://emmotion.ch/portfolio/${p.slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }))
  
  return [...staticPages, ...servicePages, ...projectPages]
}
```

---

## CODING STANDARDS

### TypeScript
- Strict mode aktiviert
- Keine `any` Types
- Interfaces für Props
- Zod für Runtime-Validierung

### Komponenten
- Functional Components mit Arrow Functions
- Props destructuring
- Default exports für Pages, named exports für Components
- `"use client"` nur wenn nötig (State, Events, Browser APIs)

### Styling
- Tailwind für alles
- `cn()` Helper für conditional classes
- Keine Inline-Styles
- CSS Variables für Theme-Werte

### Imports
```typescript
// Reihenfolge:
// 1. React/Next
import { useState } from "react"
import Link from "next/link"

// 2. Third-party
import { motion } from "framer-motion"

// 3. Internal - absolut
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// 4. Types
import type { Project } from "@/types"
```

### Commits
```
feat: Add video konfigurator
fix: Correct price calculation
style: Update hero section spacing
refactor: Extract video player component
docs: Update README
```

---

## PERFORMANCE GUIDELINES

### Images
- Immer `next/image` verwenden
- WebP/AVIF automatisch via Sanity
- Sizes-Attribut setzen
- Lazy Loading (default)
- Blur Placeholder für grosse Bilder

### Videos
- Poster-Bild immer setzen
- Lazy Loading aktivieren
- Autoplay nur mit `muted`
- `playsinline` für Mobile
- Komprimierte Versionen (720p für Hintergrund reicht)

### Fonts
```typescript
// app/layout.tsx
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})
```

### Bundle Size
- Dynamic Imports für schwere Komponenten
- Tree Shaking aktiv halten
- Keine grossen Libraries komplett importieren

---

## ENVIRONMENT VARIABLES

```env
# .env.local

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=xxx

# Resend
RESEND_API_KEY=xxx
EMAIL_FROM=hallo@emmotion.ch
EMAIL_TO=hallo@emmotion.ch

# Site
NEXT_PUBLIC_SITE_URL=https://emmotion.ch

# Analytics (optional)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=emmotion.ch
```

---

## DEPLOYMENT CHECKLIST

### Vor Go-Live:
- [ ] Alle Texte finalisiert
- [ ] Bilder/Videos optimiert und hochgeladen
- [ ] Kontaktformular getestet
- [ ] E-Mail-Empfang bestätigt
- [ ] SEO Meta Tags auf allen Seiten
- [ ] Schema.org Markup validiert
- [ ] Favicon und OG Images
- [ ] 404 Seite gestaltet
- [ ] Impressum und Datenschutz vollständig
- [ ] Cookie Banner (falls Analytics mit Cookies)
- [ ] Mobile Darstellung getestet
- [ ] Core Web Vitals geprüft
- [ ] Sitemap generiert
- [ ] robots.txt korrekt
- [ ] Google Search Console eingerichtet
- [ ] Analytics eingerichtet

---

## KONTAKT BEI FRAGEN

Bei Unklarheiten zu Design-Entscheidungen oder Business-Logik:
→ Frage den Projektinhaber (Marcus)

Diese Dokumentation ist die Single Source of Truth für technische Entscheidungen.
