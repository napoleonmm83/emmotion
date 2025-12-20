# Technisches Know-how & Patterns

> Dokumentation der wichtigsten Patterns und Lösungen im Projekt emmotion.ch

---

## Inhaltsverzeichnis

1. [Sanity CMS Patterns](#sanity-cms-patterns)
2. [Next.js 15 Patterns](#nextjs-15-patterns)
3. [Konfigurator / Multi-Step Form](#konfigurator--multi-step-form)
4. [API Routes](#api-routes)
5. [Styling Patterns](#styling-patterns)
6. [Projektstruktur](#projektstruktur)
7. [Design System](#design-system)
8. [Environment Variables](#environment-variables)
9. [Sicherheit](#sicherheit)
10. [Bexio API Integration](#bexio-api-integration)

---

## Sanity CMS Patterns

### ⚠️ Wichtige Regel: Bestehende Texte übernehmen

**Bei allen CMS-editierbaren Feldern müssen bestehende Texte aus dem Code übernommen werden!**

Wenn Inhalte vom Code ins CMS verschoben werden:

1. **Bestehende Texte als Default-Werte** im Schema setzen (`initialValue`)
2. **Oder** initiale Sanity-Dokumente mit den bestehenden Texten erstellen
3. **Niemals** Inhalte verlieren oder mit Platzhaltern ersetzen

**Beispiel:**
```typescript
// FALSCH - Text geht verloren
defineField({
  name: "heroTitle",
  title: "Hero Titel",
  type: "string",
})

// RICHTIG - Bestehender Text als Default
defineField({
  name: "heroTitle",
  title: "Hero Titel",
  type: "string",
  initialValue: "Videoproduktion mit TV-Erfahrung", // <- aus bestehendem Code
})
```

**Gilt für:**
- Startseiten-Inhalte (Hero, CTAs, Sektions-Titel)
- Seiten-spezifische Texte
- Formulare und Buttons
- Alle Inhalte, die vorher hardcoded waren

---

### Dynamische Bild-Aspect-Ratios

Portrait vs. Landscape Bilder automatisch erkennen und Layout anpassen.

**GROQ Query mit Metadaten:**
```groq
image {
  asset->{
    _id,
    url,
    metadata {
      dimensions {
        width,
        height,
        aspectRatio
      }
    }
  },
  hotspot,
  crop
}
```

**TypeScript Interface:**
```typescript
interface ImageWithMetadata {
  asset?: {
    _id?: string;
    url?: string;
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
      };
    };
  };
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}
```

**Portrait-Erkennung:**
```typescript
const dimensions = data?.image?.asset?.metadata?.dimensions;
const isPortrait = dimensions ? dimensions.aspectRatio < 1 : false;

// aspectRatio < 1 = Portrait (höher als breit)
// aspectRatio > 1 = Landscape (breiter als hoch)
// aspectRatio = 1 = Quadrat
```

**Dynamische Bildgrössen:**
```typescript
const imageUrl = urlFor(data.image)
  .width(isPortrait ? 800 : 1200)
  .height(isPortrait ? 1200 : 800)
  .url();
```

**Dynamische CSS Aspect-Ratio:**
```tsx
<div className={`relative rounded-xl overflow-hidden ${
  isPortrait ? "aspect-[3/4]" : "aspect-video"
}`}>
  <Image src={imageUrl} fill className="object-cover" />
</div>
```

---

### YouTube/Vimeo Videos einbetten (Facade Pattern)

Performante Video-Embeds mit automatischer Erkennung von YouTube/Vimeo URLs.

**Das Problem:** YouTube/Vimeo iframes laden viele Ressourcen (~1MB) und verlangsamen die Seite.

**Die Lösung:** Facade Pattern - zeigt erst ein Thumbnail mit Play-Button, lädt iframe erst beim Klick.

#### Smart VideoPlayer (Automatische Erkennung)

Der `VideoPlayer` erkennt automatisch YouTube/Vimeo URLs und verwendet das Facade Pattern:

```tsx
import { VideoPlayer } from "@/components/shared";

// Funktioniert mit allen URL-Typen:
<VideoPlayer
  src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"  // YouTube
  poster="/thumbnail.jpg"  // Optional: eigenes Thumbnail
  title="Mein Video"
/>

<VideoPlayer
  src="https://vimeo.com/123456789"  // Vimeo
  title="Vimeo Video"
/>

<VideoPlayer
  src="/videos/local-video.mp4"  // Direkte URL → Native Player
  autoPlay
  loop
/>
```

#### YouTubeEmbed Komponente (Direkt)

Für YouTube/Vimeo-spezifische Verwendung:

```tsx
import { YouTubeEmbed } from "@/components/shared";

<YouTubeEmbed
  url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  title="Video Titel"
  poster="/custom-thumbnail.jpg"  // Optional
  aspectRatio="video"  // "video" | "square" | "portrait"
/>
```

#### URL-Erkennung Utilities

```typescript
import { isEmbeddableVideo, getVideoProvider } from "@/components/shared";

// Prüfen ob URL einbettbar ist
isEmbeddableVideo("https://youtu.be/abc123");  // true
isEmbeddableVideo("/video.mp4");               // false

// Provider ermitteln
getVideoProvider("https://youtube.com/...");   // "youtube"
getVideoProvider("https://vimeo.com/...");     // "vimeo"
getVideoProvider("/video.mp4");                // "direct"
```

#### Unterstützte URL-Formate

**YouTube:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

**Vimeo:**
- `https://vimeo.com/VIDEO_ID`
- `https://vimeo.com/video/VIDEO_ID`

#### Sanity Schema für Videos

```typescript
defineField({
  name: "videoUrl",
  title: "Video URL",
  type: "url",
  description: "YouTube, Vimeo oder direkte Video-URL",
})
```

**Array von Videos:**
```typescript
defineField({
  name: "exampleVideos",
  title: "Beispielvideos",
  type: "array",
  of: [{
    type: "object",
    fields: [
      { name: "title", type: "string", title: "Titel" },
      { name: "youtubeUrl", type: "url", title: "YouTube/Vimeo URL" },
      { name: "description", type: "text", title: "Kurzbeschreibung" }
    ]
  }]
})

---

### Schema mit Array of Objects

Wiederholbare Felder wie Process Steps, FAQs, Benefits.

```typescript
defineField({
  name: "process",
  title: "Ablauf / Prozess",
  type: "array",
  of: [{
    type: "object",
    fields: [
      { name: "step", type: "number", title: "Schritt Nr." },
      { name: "title", type: "string", title: "Titel" },
      { name: "description", type: "text", title: "Beschreibung", rows: 2 }
    ],
    preview: {
      select: { title: "title", step: "step" },
      prepare({ title, step }) {
        return { title: `${step}. ${title}` };
      }
    }
  }]
})
```

---

## Next.js 15 Patterns

### Server/Client Component Split

Page als Server Component für Data Fetching, Content als Client Component für Interaktivität.

```typescript
// page.tsx (Server Component)
import { ServicePageContent } from "./service-content";

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await fetchData(slug);
  return <ServicePageContent data={data} />;
}

// service-content.tsx (Client Component)
"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function ServicePageContent({ data }) {
  // Framer Motion, useState, Event Handler möglich
}
```

---

### Dynamic Routes mit Params (Next.js 15)

In Next.js 15 sind params ein Promise.

```typescript
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const data = await client.fetch(query, { slug });
  // ...
}
```

---

### Fallback Data Pattern

Fallback-Daten anzeigen wenn CMS leer ist.

```typescript
const defaultServices: ServiceDetail[] = [
  {
    slug: "imagefilm",
    title: "Imagefilme",
    // ... alle Felder
  },
  // ...
];

async function getService(slug: string): Promise<ServiceDetail | null> {
  try {
    const sanityData = await client.fetch(query, { slug });

    if (!sanityData) {
      // Fallback zu Default-Daten
      return defaultServices.find(s => s.slug === slug) || null;
    }

    // Sanity-Daten mappen
    return {
      slug: sanityData.slug,
      title: sanityData.title,
      // ...
    };
  } catch {
    // Bei Fehler: Fallback
    return defaultServices.find(s => s.slug === slug) || null;
  }
}
```

---

### Dynamischer Filter mit animierten Statistiken

Pattern für Filter-Dropdowns mit dynamisch berechneten Statistiken (z.B. TV-Produktionen Jahresfilter).

```typescript
// State für Filter
const [selectedYear, setSelectedYear] = useState<number | null>(null);

// Verfügbare Jahre aus Daten extrahieren (absteigend sortiert)
const availableYears = useMemo(() => {
  const years = new Set<number>();
  videos.forEach((video) => {
    const year = new Date(video.publishedAt).getFullYear();
    years.add(year);
  });
  return Array.from(years).sort((a, b) => b - a);
}, [videos]);

// Daten nach Jahr filtern
const filteredData = useMemo(() => {
  if (!selectedYear) return data;
  return data.filter((item) => {
    const year = new Date(item.publishedAt).getFullYear();
    return year === selectedYear;
  });
}, [data, selectedYear]);

// Dynamische Statistiken basierend auf gefiltertem Jahr
const stats = useMemo(() => ({
  totalItems: filteredData.length,
  totalViews: filteredData.reduce((sum, v) => sum + v.viewCount, 0),
  // ... weitere Statistiken
}), [filteredData]);
```

**Dropdown UI:**
```tsx
<select
  value={selectedYear || ""}
  onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
  className="px-3 py-2 rounded-lg bg-card border border-border"
>
  <option value="">Alle Jahre</option>
  {availableYears.map((year) => (
    <option key={year} value={year}>{year}</option>
  ))}
</select>
```

**AnimatedCounter für smooth Updates:**
```typescript
function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValueRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const startValue = previousValueRef.current;
    previousValueRef.current = value;
    if (startValue === value) return;

    const animDuration = startValue === 0 ? duration * 1000 : 500; // Schneller bei Updates
    const startTime = performance.now();
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / animDuration, 1);
      setDisplayValue(Math.floor(startValue + (value - startValue) * easeOutQuart(progress)));
      if (progress < 1) animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [value, duration]);

  return <span>{displayValue.toLocaleString("de-CH")}</span>;
}
```

**Wichtig:** Bei AnimatePresence den Key mit Filter-State kombinieren:
```tsx
<AnimatePresence mode="wait">
  <motion.div key={`${sortBy}-${searchQuery}-${selectedYear || "all"}`}>
    {/* Gefilterte Inhalte */}
  </motion.div>
</AnimatePresence>
```

---

## Konfigurator / Multi-Step Form

### Preisberechnung Logik

```typescript
// lib/konfigurator-logic.ts

export type VideoType = "imagefilm" | "recruiting" | "produkt" | "social";
export type Duration = "short" | "medium" | "long";
export type Complexity = "simple" | "standard" | "premium";

const BASE_PRICES: Record<VideoType, Record<Complexity, number>> = {
  imagefilm: { simple: 2400, standard: 3800, premium: 5500 },
  recruiting: { simple: 1800, standard: 2800, premium: 4200 },
  produkt: { simple: 800, standard: 1500, premium: 2500 },
  social: { simple: 600, standard: 1200, premium: 2000 },
};

const DURATION_MULTIPLIER: Record<Duration, number> = {
  short: 1,      // bis 1 Min
  medium: 1.4,   // 1-2 Min
  long: 1.8,     // 2-4 Min
};

const EXTRAS_PRICES = {
  drone: 400,
  music: 150,
  subtitles: 200,
  socialCuts: 300,
  expressDelivery: 500,
};

export function calculatePrice(input: KonfiguratorInput): PriceResult {
  const basePrice = BASE_PRICES[input.videoType][input.complexity];
  const multipliedPrice = basePrice * DURATION_MULTIPLIER[input.duration];

  let extrasPrice = 0;
  if (input.extras.drone) extrasPrice += EXTRAS_PRICES.drone;
  if (input.extras.music) extrasPrice += EXTRAS_PRICES.music;
  // ...

  const totalPrice = Math.round(multipliedPrice) + extrasPrice;

  return {
    basePrice: Math.round(multipliedPrice),
    extrasPrice,
    totalPrice,
    priceRange: {
      min: Math.round(totalPrice * 0.85),
      max: Math.round(totalPrice * 1.15),
    },
  };
}
```

### Step-basierter State

```typescript
const [step, setStep] = useState(1);
const [formData, setFormData] = useState({
  videoType: null,
  duration: null,
  complexity: null,
  extras: {
    drone: false,
    music: false,
    subtitles: false,
    socialCuts: false,
    expressDelivery: false,
  },
});

const handleNext = () => setStep(s => s + 1);
const handleBack = () => setStep(s => s - 1);

const updateFormData = (field: string, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
```

---

## API Routes

### Contact Form Handler

```typescript
// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validierung
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validierungsfehler", details: result.error.flatten() },
        { status: 400 }
      );
    }

    // E-Mail senden mit Resend
    // await resend.emails.send({ ... });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Interner Fehler" },
      { status: 500 }
    );
  }
}
```

---

## Styling Patterns

### Card Component (shadcn/ui)

```tsx
import { Card } from "@/components/ui/card";

// Basic usage
<Card className="p-6">
  {/* Content */}
</Card>

// With hover effect
<Card className="p-6 hover:border-primary/30">
  {/* Content */}
</Card>

// For animated cards, wrap Card inside motion.div
<motion.div variants={itemVariants}>
  <Card className="p-6 h-full">
    {/* Content */}
  </Card>
</motion.div>

// Edge-to-edge images (Card has overflow-hidden)
<Card>
  <Image src="..." fill className="object-cover" />
  <div className="p-6">{/* Text content */}</div>
</Card>
```

### Gradient Primary

```css
.gradient-primary {
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
}

.glow-primary {
  box-shadow: 0 0 20px hsl(var(--primary) / 0.3);
}

.glow-primary-hover:hover {
  box-shadow: 0 0 30px hsl(var(--primary) / 0.5);
}
```

```tsx
<button className="gradient-primary glow-primary glow-primary-hover px-8 py-4 rounded-lg">
  CTA Button
</button>
```

### Icon Mapping

Icons dynamisch aus CMS laden:

```typescript
import { Film, Video, Camera, Plane, Clapperboard, Sparkles } from "lucide-react";

const iconMap = {
  Film,
  Video,
  Camera,
  Plane,
  Clapperboard,
  Sparkles,
};

// Usage
const Icon = iconMap[service.icon as keyof typeof iconMap] || Film;
<Icon className="w-6 h-6 text-primary" />
```

---

## Video Components

### VideoLightbox

Desktop-Lightbox für Videos im Portfolio und TV-Produktionen. Auf Mobile wird zum Fallback (Link zur Detailseite) gewechselt.

```tsx
import { VideoLightbox } from "@/components/shared";

<VideoLightbox
  videoUrl={project.videoUrl}           // YouTube, Vimeo oder direkte URL
  thumbnail={project.thumbnail}          // Poster-Bild
  title={project.title}
  category="Imagefilm"                   // Optional
  priority={true}                        // Für above-the-fold
  fallbackWrapper={(children) => (       // Für Mobile: Link zur Detailseite
    <Link href={`/portfolio/${project.slug}`}>{children}</Link>
  )}
/>
```

**Verhalten:**
- **Desktop (md+):** Klick öffnet Video-Modal (70% Viewport) mit autoplay
- **Mobile:** Klick führt zur Detailseite (via fallbackWrapper)

**Lightbox-Grösse anpassen:**
```tsx
// In DialogContent className:
className="w-[70vw] h-[70vh] !max-w-none ..."
// !max-w-none überschreibt shadcn's sm:max-w-lg
```

---

### Dialog Backdrop Blur

Der Dialog-Hintergrund ist standardmässig mit Blur versehen:

```tsx
// components/ui/dialog.tsx - DialogOverlay
className="... bg-black/60 backdrop-blur-sm"
```

Für stärkeren Blur: `backdrop-blur-md` oder `backdrop-blur-lg`

---

### TV-Produktionen Patterns

#### Video-Nummerierung

Chronologische Nummerierung (ältestes Video = #1):

```tsx
{sortedVideos.map((video, index) => (
  <VideoCard
    key={video.youtubeId}
    video={video}
    number={sortedVideos.length - index}  // Umgekehrte Nummerierung
  />
))}
```

Anzeige in der Card (Datumszeile, rechts):
```tsx
<div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
  <div className="flex items-center gap-1">
    <Calendar className="w-3 h-3" />
    {formatDate(video.publishedAt)}
  </div>
  {number && (
    <span className="text-muted-foreground/50">#{number}</span>
  )}
</div>
```

#### Sanity Array _key Requirement

Beim Speichern von Arrays in Sanity muss jedes Objekt eine `_key` Property haben:

```typescript
// FALSCH - gibt "Missing keys" Fehler im CMS
const videos = videosData.map((video) => ({
  youtubeId: video.youtubeId,
  title: video.title,
  // ...
}));

// RICHTIG - _key hinzufügen
const videos = videosData.map((video) => ({
  _key: video.youtubeId,  // Unique key (YouTube ID ideal)
  youtubeId: video.youtubeId,
  title: video.title,
  // ...
}));
```

**Fehlermeldung ohne _key:**
```
Missing keys - Some items in the list are missing their keys.
This must be fixed in order to edit the list.
```

---

#### Duplikat-Entfernung

YouTube-Playlists können Videos mehrfach enthalten. Duplikate werden client-seitig entfernt:

```typescript
const videos = useMemo(() => {
  const raw = tvData.cachedData?.videos || [];
  const seen = new Set<string>();
  return raw.filter((video) => {
    if (seen.has(video.youtubeId)) return false;
    seen.add(video.youtubeId);
    return true;
  });
}, [tvData.cachedData?.videos]);
```

#### Lightbox für YouTube-Videos

TV-Produktionen verwendet eine eigene Lightbox-Implementation:

```tsx
function VideoCard({ video, number }: { video: Video; number?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;

  return (
    <>
      {/* Desktop: Opens lightbox */}
      <motion.div
        className="hidden md:block cursor-pointer ..."
        onClick={() => setIsOpen(true)}
      >
        {cardContent}
      </motion.div>

      {/* Mobile: Direct YouTube link */}
      <motion.a
        href={youtubeUrl}
        target="_blank"
        className="md:hidden ..."
      >
        {cardContent}
      </motion.a>

      {/* Lightbox Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[70vw] h-[70vh] !max-w-none ...">
          <VideoPlayer src={youtubeUrl} ... />
        </DialogContent>
      </Dialog>
    </>
  );
}
```

---

## Projektstruktur

```
emmotion.ch/
├── app/
│   ├── page.tsx                    # Startseite
│   ├── leistungen/
│   │   ├── page.tsx                # Übersicht
│   │   └── [slug]/
│   │       ├── page.tsx            # Server Component
│   │       └── service-content.tsx # Client Component
│   ├── portfolio/
│   │   ├── page.tsx
│   │   └── [slug]/
│   ├── ueber-mich/
│   ├── konfigurator/
│   ├── kontakt/
│   ├── faq/
│   ├── impressum/
│   ├── datenschutz/
│   ├── api/
│   │   ├── contact/route.ts
│   │   └── konfigurator/route.ts
│   └── studio/[[...tool]]/         # Sanity Studio
├── components/
│   ├── layout/                     # Header, Footer
│   ├── sections/                   # Hero, Services, Portfolio, etc.
│   ├── forms/                      # Contact Form
│   ├── konfigurator/               # Step Components
│   └── shared/                     # Container, SectionHeader
├── sanity/
│   ├── schemas/                    # Alle Sanity Schemas
│   └── lib/
│       ├── client.ts               # Sanity Client
│       ├── queries.ts              # GROQ Queries
│       ├── image.ts                # urlFor Helper
│       └── portable-text.tsx       # PortableText
├── lib/
│   ├── utils.ts                    # cn() Helper
│   └── konfigurator-logic.ts       # Preisberechnung
└── types/
    └── index.ts
```

---

## Design System

### Brand-Farbe: Rot

**Die primäre Brand-Farbe ist Rot und wird für alle wichtigen UI-Elemente verwendet:**

```css
/* CSS Variable */
--color-primary: hsl(0 85% 45%);  /* ≈ #b91c1c */

/* Hex-Werte für E-Mails (CSS Variables funktionieren dort nicht) */
#b91c1c  /* Primary - Buttons, Links, Akzente */
#dc2626  /* Primary Light - Hover, Gradienten */
#7f1d1d  /* Primary Dark - Text auf hellem Hintergrund */
#fef2f2  /* Primary Background - Helle Flächen */
```

**Verwendung:**
- Header-Hintergründe: `linear-gradient(135deg, #b91c1c, #dc2626)`
- Buttons: `background: #b91c1c`
- Links: `color: #b91c1c`
- Akzent-Boxen: `background: #fef2f2; border: 1px solid #dc2626`
- Wichtige Zahlen/Preise: `color: #b91c1c`

**E-Mail Templates:**
Da E-Mails keine CSS Variables unterstützen, werden die Hex-Werte direkt verwendet.
Siehe: `src/emails/*.tsx`

### Farben (CSS Variables)

```css
:root {
  /* Primary - Blau */
  --primary: 220 90% 56%;
  --primary-foreground: 0 0% 100%;

  /* Accent - Violett */
  --accent: 262 83% 58%;
  --accent-foreground: 0 0% 100%;

  /* Neutrals */
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;

  /* Radius */
  --radius: 0.5rem;
}

.dark {
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;
  --muted: 217 33% 17%;
  --muted-foreground: 215 20% 65%;
  --border: 217 33% 17%;
}
```

### Spacing

| Element | Klassen |
|---------|---------|
| Sections | `py-16 md:py-24 lg:py-32` |
| Container | `px-4 md:px-6 lg:px-8 max-w-7xl mx-auto` |
| Cards | `p-6 md:p-8` |
| Gaps | `gap-4`, `gap-6`, `gap-8`, `gap-12` |

### Typografie

#### Font Families

```css
/* In globals.css definiert */
--font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
--font-display: "Bebas Neue", ui-sans-serif, system-ui, sans-serif;
```

- **font-sans**: Für Fliesstext, Labels, Buttons
- **font-display**: Für H1 und H2 Überschriften (Display-Font, Grossbuchstaben-Stil)

#### Heading-Hierarchie

**⚠️ WICHTIG: Immer diese Patterns verwenden für konsistente Typografie!**

| Element | Font | Tracking | Sizes | Verwendung |
|---------|------|----------|-------|------------|
| H1 (Hero) | `font-display` | `tracking-wider` | `text-5xl md:text-7xl lg:text-8xl xl:text-9xl` | Hauptseiten-Hero |
| H1 (Page) | `font-display` | `tracking-wider` | `text-3xl md:text-4xl lg:text-5xl` | Unterseiten-Titel |
| H2 (Section) | `font-display` | `tracking-wide` | `text-3xl md:text-4xl lg:text-5xl` | Sektionsüberschriften |
| H3 | `font-semibold` | - | `text-lg lg:text-xl` | Karten-Titel, Untertitel |
| H4-H6 | `font-medium` | - | `text-base lg:text-lg` | Kleine Überschriften |

**Beispiele:**

```tsx
// H1 auf Seiten-Ebene
<h1 className="text-3xl md:text-4xl lg:text-5xl font-display tracking-wider text-foreground">
  Seitentitel
</h1>

// H2 für Sektionen
<h2 className="text-3xl md:text-4xl lg:text-5xl font-display tracking-wide text-foreground">
  Sektionsüberschrift
</h2>

// H3 für Karten/Inhalt
<h3 className="text-lg lg:text-xl font-semibold text-foreground">
  Untertitel
</h3>
```

**CSS Base Layer (automatisch angewendet):**
```css
/* globals.css */
h1 { @apply font-display uppercase; letter-spacing: 0.08em; }
h2 { @apply font-display uppercase; letter-spacing: 0.06em; }
h3 { @apply font-sans font-semibold; letter-spacing: 0.02em; }
h4, h5, h6 { @apply font-sans font-medium; letter-spacing: 0.01em; }
```

#### Font Sizes (Tailwind)

```css
text-xs:   0.75rem   /* 12px */
text-sm:   0.875rem  /* 14px */
text-base: 1rem      /* 16px */
text-lg:   1.125rem  /* 18px */
text-xl:   1.25rem   /* 20px */
text-2xl:  1.5rem    /* 24px */
text-3xl:  1.875rem  /* 30px */
text-4xl:  2.25rem   /* 36px */
text-5xl:  3rem      /* 48px */
text-6xl:  3.75rem   /* 60px */
```

#### Letter Spacing (Tracking)

| Tailwind Class | CSS Value | Verwendung |
|----------------|-----------|------------|
| `tracking-wider` | `0.125em` | H1 Überschriften |
| `tracking-wide` | `0.025em` | H2 Sektionsüberschriften |
| (default) | `0` | Fliesstext |
| `tracking-tight` | `-0.025em` | ❌ NICHT für Überschriften verwenden |

#### Text-Farben

```tsx
// Primäre Textfarbe
<p className="text-foreground">Haupttext</p>

// Gedämpfte Farbe für Nebentexte
<p className="text-muted-foreground">Beschreibung, Datum, etc.</p>

// Akzentfarbe
<span className="text-primary">Hervorgehobener Text</span>
```

**Niemals hardcoded Farben verwenden** (ausser in E-Mail-Templates wo CSS Variables nicht funktionieren).

#### Responsive Text-Pattern

Immer responsive Grössen verwenden:

```tsx
// RICHTIG
<h1 className="text-3xl md:text-4xl lg:text-5xl">...</h1>
<p className="text-sm lg:text-base">...</p>

// FALSCH - fehlt responsive scaling
<h1 className="text-5xl">...</h1>
<p className="text-sm">...</p>
```

### Animationen (Framer Motion)

```typescript
// Fade In
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}

// Stagger Children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Viewport Trigger
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
```

---

## Environment Variables

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=xxx

# Email (Resend)
RESEND_API_KEY=xxx
# Absender/Empfänger werden in Sanity CMS konfiguriert (E-Mail Einstellungen)

# Cloudflare Turnstile (Captcha)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=xxx  # Öffentlich, für Frontend
TURNSTILE_SECRET_KEY=xxx             # Privat, für Backend-Verifikation

# Vercel Blob (Video-Upload)
BLOB_READ_WRITE_TOKEN=xxx

# YouTube API
YOUTUBE_API_KEY=xxx  # YouTube Data API v3 Key

# Cron Jobs (Sicherheit)
CRON_SECRET=xxx               # Für automatische Vercel Cron Jobs
NEXT_PUBLIC_SYNC_SECRET=xxx   # Für manuelle Syncs vom CMS

# Site
NEXT_PUBLIC_SITE_URL=https://emmotion.ch
```

---

## Sicherheit

### Cron Job Absicherung

Vercel Cron Jobs sind standardmässig öffentlich erreichbar. **Immer mit CRON_SECRET absichern!**

**1. Secret generieren (Terminal):**
```bash
openssl rand -hex 32
```

**2. In Vercel setzen:**
- Dashboard → Project → Settings → Environment Variables
- Name: `CRON_SECRET`
- Value: Der generierte 64-Zeichen Hex-String
- Environment: Production (+ Preview falls gewünscht)

**3. Im API Route prüfen:**
```typescript
// app/api/cron/[job]/route.ts
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Vercel setzt automatisch den Bearer Token bei Cron-Aufrufen
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ... Job-Logik
}
```

**4. vercel.json konfigurieren:**
```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-submissions",
      "schedule": "0 3 * * *"
    }
  ]
}
```

Vercel fügt automatisch den `Authorization: Bearer <CRON_SECRET>` Header hinzu, wenn der Cron-Job ausgeführt wird.

---

### YouTube Sync - Manuelle Authentifizierung

Für manuelle Syncs vom CMS (Sanity Studio) wird ein separates Secret verwendet:

**Environment Variables:**
```env
CRON_SECRET=xxx               # Für automatische Vercel Cron Jobs (Header-Auth)
NEXT_PUBLIC_SYNC_SECRET=xxx   # Für manuelle Syncs vom CMS (URL-Parameter)
```

**API Route (`/api/cron/sync-youtube`):**
```typescript
function isAuthorizedRequest(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const syncSecret = process.env.NEXT_PUBLIC_SYNC_SECRET;
  const authHeader = request.headers.get("authorization");

  // Vercel Cron auth header
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  // Manual sync with secret (CMS button)
  const providedSecret = request.nextUrl.searchParams.get("secret");
  if (providedSecret) {
    if ((cronSecret && providedSecret === cronSecret) ||
        (syncSecret && providedSecret === syncSecret)) {
      return true;
    }
  }

  return false;
}
```

**CMS Sync Button:**
```typescript
// sanity/components/YouTubeSyncButton.tsx
const syncSecret = process.env.NEXT_PUBLIC_SYNC_SECRET;
const url = `${baseUrl}/api/cron/sync-youtube?secret=${syncSecret}`;
await fetch(url);
```

**Secret generieren:**
```bash
openssl rand -hex 32
```

---

### API Route Sicherheit

**Immer implementieren:**

1. **Rate Limiting** - Verhindert Spam/DDoS
```typescript
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 Stunde

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT) return true;
  record.count++;
  return false;
}
```

2. **Honeypot-Felder** - Fängt Bots ab
```typescript
// Im Formular: verstecktes Feld "website"
if (body.website && body.website.length > 0) {
  console.log("Honeypot triggered");
  return NextResponse.json({ success: true }); // Fake Success
}
```

3. **Zeit-basierte Validierung** - Zu schnelle Submissions = Bot
```typescript
const MIN_SUBMISSION_TIME = 3000; // 3 Sekunden

if (body._timestamp) {
  const submissionTime = Date.now() - body._timestamp;
  if (submissionTime < MIN_SUBMISSION_TIME) {
    return NextResponse.json({ success: true }); // Fake Success
  }
}
```

4. **Cloudflare Turnstile** - DSGVO-konformes Captcha
```typescript
// Backend-Verifikation
const isValid = await verifyTurnstileToken(body.turnstileToken, ip);
if (!isValid) {
  return NextResponse.json(
    { error: "Sicherheitsüberprüfung fehlgeschlagen" },
    { status: 400 }
  );
}
```

5. **Input Sanitization** - XSS/Injection verhindern
```typescript
function sanitizeString(str: string): string {
  return str.trim().slice(0, 5000); // Länge begrenzen
}

// Spam-Pattern erkennen
const spamPatterns = [
  /\[url=/i,
  /\[link=/i,
  /<a\s+href/i,
  /viagra|cialis|casino|crypto/i,
];
```

---

### DSGVO-Konformität

1. **Automatische Datenlöschung** - Kontaktanfragen nach 60 Tagen löschen
   - Cron Job: `/api/cron/cleanup-submissions`
   - Läuft täglich um 03:00 Uhr

2. **Datensparsamkeit** - Nur notwendige Daten speichern

3. **Turnstile statt reCAPTCHA** - Keine Cookies, DSGVO-konform

4. **Plausible Analytics** - Cookie-frei, DSGVO-konform

---

### Security Headers (next.config.ts)

Alle wichtigen Sicherheitsheader sind in `next.config.ts` konfiguriert:

**HSTS (HTTP Strict Transport Security):**
```typescript
{
  key: "Strict-Transport-Security",
  value: "max-age=31536000; includeSubDomains; preload",
}
```
- `max-age=31536000` = 1 Jahr
- `includeSubDomains` = Gilt für alle Subdomains
- `preload` = Ermöglicht Aufnahme in Browser-Preload-Liste

**Cross-Origin-Opener-Policy (COOP):**
```typescript
{
  key: "Cross-Origin-Opener-Policy",
  value: "same-origin-allow-popups",
}
```
- Schützt vor Spectre-ähnlichen Angriffen
- `same-origin-allow-popups` erlaubt OAuth/Payment Popups

**Content Security Policy (CSP):**
Konfiguriert für Sanity CDN, YouTube Embeds, Turnstile, Vercel Blob, etc.

**Weitere Header:**
- `X-Frame-Options: SAMEORIGIN` - Clickjacking-Schutz
- `X-Content-Type-Options: nosniff` - MIME-Sniffing verhindern
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` - Browser-Features einschränken

**Hinweis:** React Error #418 (Hydration Mismatch) kann durch Cloudflare Turnstile verursacht werden, da es dynamisch Inhalte injiziert. Dies ist ein bekanntes Verhalten und nicht kritisch.

---

### Video Player Error Handling

VideoPlayer zeigt automatisch das Poster-Bild als Fallback, wenn das Video nicht geladen werden kann:

```typescript
const [hasError, setHasError] = useState(false);

<video
  onError={() => setHasError(true)}
/>

{hasError && poster && (
  <div className="absolute inset-0">
    <img src={poster} alt="" className="w-full h-full object-cover" />
  </div>
)}
```

---

## Bexio API Integration

### API Versionen

Bexio verwendet zwei API-Versionen parallel:

- **v2.0** (`https://api.bexio.com/2.0/`) - Für Rechnungen, Kontakte, Aufträge
- **v3.0** (`https://api.bexio.com/3.0/`) - Für Benutzer, Steuersätze

```typescript
// v2 Endpoints (funktionieren)
/kb_invoice          // Rechnungen
/contact             // Kontakte
/kb_invoice/{id}/send    // Rechnung per E-Mail senden
/kb_invoice/{id}/issue   // Rechnung ausstellen

// v2 Endpoints (geben 404 zurück - v3 verwenden!)
/user    // -> v3: /users
/tax     // -> v3: /taxes
```

### ⚠️ Kritisch: E-Mail-Versand mit [Network Link]

**Der `/kb_invoice/{id}/send` Endpoint erfordert ZWINGEND den Platzhalter `[Network Link]` im Nachrichtentext!**

Ohne diesen Platzhalter gibt die API den Fehler zurück:
```json
{
  "error_code": 422,
  "errors": ["message: plugins.ibNetworkPlugin.i18n.form_module_network.error.missing_network_placeholder"]
}
```

**Lösung:**
```typescript
const message = `Guten Tag

Anbei erhalten Sie Ihre Rechnung:
[Network Link]

Freundliche Grüsse
emmotion.ch`;

await client.post(`/kb_invoice/${invoiceId}/send`, {
  recipient_email: "kunde@example.com",
  subject: "Ihre Rechnung",
  message: message,  // MUSS [Network Link] enthalten!
  mark_as_open: false,
});
```

Der `[Network Link]` wird von Bexio durch den tatsächlichen Link zur Online-Rechnung ersetzt.

### Korrekter Workflow: Rechnung erstellen und versenden

```typescript
// 1. Rechnung erstellen (Status: Entwurf)
const invoice = await client.post("/kb_invoice", invoiceData);

// 2. Rechnung ausstellen (Status: Offen)
await client.post(`/kb_invoice/${invoice.id}/issue`);

// 3. Per E-Mail versenden (mit [Network Link]!)
await client.post(`/kb_invoice/${invoice.id}/send`, {
  recipient_email: "kunde@example.com",
  subject: "Ihre Rechnung",
  message: "Rechnung hier: [Network Link]",
  mark_as_open: false,  // Bereits offen durch /issue
});
```

### Rechnungs-Status IDs

```typescript
const STATUS = {
  DRAFT: 7,        // Entwurf
  OPEN: 8,         // Offen/Ausstehend
  PAID: 9,         // Bezahlt
  PARTIAL: 16,     // Teilbezahlt
  CANCELLED: 19,   // Storniert
  OVERDUE: 31,     // Überfällig
};
```

### Dateien

- `src/lib/bexio/client.ts` - API Client
- `src/lib/bexio/invoices.ts` - Rechnungen erstellen/versenden
- `src/lib/bexio/contacts.ts` - Kontakte verwalten
- `src/lib/bexio/types.ts` - TypeScript Typen

### Kontakt-Adressfelder

**Wichtig:** Die Adresse muss in separate Felder aufgeteilt werden:

```typescript
// FALSCH - gibt 422 Fehler
const contact = {
  address: "Hauptstrasse 42",  // ❌ Feld existiert nicht!
};

// RICHTIG
const contact = {
  street_name: "Hauptstrasse",   // Strassenname
  house_number: "42",             // Hausnummer
  address_addition: "2. Stock",   // Optional: Adresszusatz
  postcode: "9000",
  city: "St. Gallen",
};
```

### Environment Variables

```env
BEXIO_API_TOKEN=xxx     # Personal Access Token
BEXIO_USER_ID=1         # Benutzer-ID (optional, wird automatisch geholt)
BEXIO_TAX_ID=17         # Steuer-ID für 0% (optional, wird automatisch geholt)
```

**Token generieren:** https://developer.bexio.com/ → API Tokens

Benötigte Berechtigungen:
- `kb_invoice_edit` (Rechnungen erstellen/bearbeiten)
- `contact_edit` (Kontakte erstellen/bearbeiten)

---

*Letzte Aktualisierung: Dezember 2024*
