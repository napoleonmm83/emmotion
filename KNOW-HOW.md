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

### YouTube Videos einbetten

YouTube URLs im CMS speichern und als Embed anzeigen.

**Schema:**
```typescript
defineField({
  name: "exampleVideos",
  title: "Beispielvideos",
  type: "array",
  of: [{
    type: "object",
    fields: [
      { name: "title", type: "string", title: "Titel" },
      { name: "youtubeUrl", type: "url", title: "YouTube URL" },
      { name: "description", type: "text", title: "Kurzbeschreibung" }
    ]
  }]
})
```

**YouTube ID extrahieren:**
```typescript
function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}
```

**Embed Komponente:**
```tsx
const videoId = getYouTubeId(video.youtubeUrl);

<iframe
  src={`https://www.youtube.com/embed/${videoId}`}
  title={video.title}
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  className="w-full h-full"
/>
```

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

### Card Surface

```css
/* globals.css */
.card-surface {
  background: hsl(var(--muted) / 0.3);
  border: 1px solid hsl(var(--border));
}
```

```tsx
<div className="card-surface rounded-xl p-6">
  {/* Content */}
</div>
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

```css
--font-sans: "Inter", system-ui, sans-serif;

/* Sizes (Tailwind) */
text-sm:   0.875rem
text-base: 1rem
text-lg:   1.125rem
text-xl:   1.25rem
text-2xl:  1.5rem
text-3xl:  1.875rem
text-4xl:  2.25rem
text-5xl:  3rem
text-6xl:  3.75rem
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

# Cron Jobs (Sicherheit)
CRON_SECRET=xxx  # Zufälliger String für Cron-Job-Authentifizierung

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

*Letzte Aktualisierung: Dezember 2024*
