# emmotion.ch – Website Spezifikation

## Technischer Stack

| Komponente | Technologie | Begründung |
|------------|-------------|------------|
| **Framework** | Next.js 15 (App Router) | SSR/SSG, Image Optimization, beste Performance |
| **UI Library** | shadcn/ui + Tailwind CSS 4 | Flexibel, modern, keine Vendor-Lock-in |
| **CMS** | Sanity v3 | Beste Next.js-Integration, Visual Editing, kostenloser Tier |
| **Hosting** | Vercel | Zero-Config für Next.js, Edge Network, kostenloser Tier |
| **Video** | Mux oder Cloudflare Stream | Optimiertes Streaming, Lazy Loading, Thumbnails |
| **E-Mail** | Resend | Moderne API, React Email Templates |
| **Analytics** | Plausible oder Umami | DSGVO-konform, kein Cookie-Banner nötig |
| **Formulare** | React Hook Form + Zod | Type-safe Validierung |

---

## Projektstruktur (Next.js App Router)

```
/app
  /page.tsx                 # Startseite
  /leistungen
    /page.tsx               # Übersicht
    /imagefilm/page.tsx
    /recruiting-video/page.tsx
    /produktvideo/page.tsx
    /social-media/page.tsx
  /portfolio
    /page.tsx
    /[slug]/page.tsx
  /ueber-mich/page.tsx
  /prozess/page.tsx
  /konfigurator/page.tsx
  /faq/page.tsx
  /kontakt/page.tsx
  /blog
    /page.tsx
    /[slug]/page.tsx
  /impressum/page.tsx
  /datenschutz/page.tsx

/components
  /ui                       # shadcn components
  /sections                 # Page sections
  /layout                   # Header, Footer, Navigation

/sanity
  /schemas                  # Content types
  /lib                      # Sanity client, queries

/lib
  /utils.ts
  /constants.ts
```

---

## Sanity Schemas (Content Types)

```typescript
// Wichtigste Schemas:

// 1. Service (Leistungen)
{
  name: 'service',
  fields: ['title', 'slug', 'description', 'icon', 'idealFor', 'priceFrom', 'featuredVideo', 'seo']
}

// 2. Project (Portfolio)
{
  name: 'project',
  fields: ['title', 'slug', 'client', 'category', 'video', 'thumbnail', 'challenge', 'solution', 'result', 'testimonial']
}

// 3. FAQ
{
  name: 'faq',
  fields: ['question', 'answer', 'category', 'order']
}

// 4. Testimonial
{
  name: 'testimonial',
  fields: ['quote', 'author', 'position', 'company', 'image', 'project']
}

// 5. Page (für statische Seiten)
{
  name: 'page',
  fields: ['title', 'slug', 'content', 'seo']
}
```

---

## Packages installieren

```bash
# Next.js Projekt erstellen
npx create-next-app@latest emmotion-website --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# shadcn/ui initialisieren
npx shadcn@latest init

# Wichtige shadcn Komponenten
npx shadcn@latest add button card dialog form input textarea select tabs accordion navigation-menu sheet

# Sanity
npm install next-sanity @sanity/image-url @sanity/vision

# Weitere Dependencies
npm install framer-motion lucide-react react-hook-form @hookform/resolvers zod resend
npm install -D @tailwindcss/typography
```

---

# STARTSEITE TEXTE

## META / SEO

```yaml
title: "Videoproduktion Rheintal & Liechtenstein | emmotion.ch"
description: "Professionelle Videos für Unternehmen: Imagefilm, Recruiting Video, Produktvideo. Mit TV-Erfahrung, persönlich und regional. Jetzt Projekt anfragen."
keywords: "Videoproduktion Rheintal, Imagefilm Ostschweiz, Recruiting Video Liechtenstein, Unternehmensfilm St. Gallen"
```

---

## HERO SECTION

### Headline
```
Videos, die wirken.
```

### Subline
```
Videoproduktion mit TV-Erfahrung – für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz.
```

### CTA Buttons
```
[Projekt anfragen]  [Portfolio ansehen]
```

### Hintergrund
- Fullscreen Video-Loop (Showreel, 15-20 Sek, stumm)
- Oder: Statisches Bild mit subtiler Animation
- Dunkler Overlay für Lesbarkeit

---

## VERTRAUENS-LEISTE (Trust Bar)

### Variante A: Icons mit Text
```
📺 TV-Erfahrung     📍 Regional verwurzelt     👤 Persönlich statt Agentur
```

### Variante B: Zahlen (später ergänzen)
```
50+ Videos produziert   |   10+ Jahre Erfahrung   |   100% Kundenzufriedenheit
```

---

## INTRO SECTION

### Headline
```
Ihr Video. Ihre Geschichte.
```

### Text
```
Sie wollen nicht irgendein Video. Sie wollen ein Video, das Vertrauen schafft, 
Kunden überzeugt oder die richtigen Bewerber anzieht.

Ich bin Marcus – Videograf mit Hintergrund im regionalen Fernsehen. 
Bei emmotion verbinde ich redaktionelles Storytelling mit einer eigenständigen 
Bildsprache. Das Ergebnis: Videos, die nicht nur gut aussehen, sondern arbeiten.

Ohne Agentur-Overhead. Persönlich, direkt, aus der Region.
```

### CTA
```
[Mehr über mich]
```

---

## SERVICES SECTION

### Section Headline
```
Was ich anbiete
```

### Section Subline
```
Vier Videoformate. Ein Ziel: Ihre Botschaft auf den Punkt bringen.
```

---

### Service 1: Imagefilm

**Titel:** Imagefilm

**Beschreibung:**
```
Zeigen Sie, wer Sie sind. Ein Imagefilm bringt Ihre Unternehmenskultur 
auf den Punkt – authentisch, professionell, einprägsam.
```

**Ideal für:**
```
Website · Messen · Präsentationen · Investorengespräche
```

**CTA:** `Mehr erfahren →`

---

### Service 2: Recruiting Video

**Titel:** Recruiting Video

**Beschreibung:**
```
Fachkräfte finden ist schwer. Ein gutes Recruiting-Video zeigt, warum 
es sich lohnt, bei Ihnen zu arbeiten – bevor das erste Gespräch stattfindet.
```

**Ideal für:**
```
Karriereseite · LinkedIn · Jobportale · Instagram
```

**CTA:** `Mehr erfahren →`

---

### Service 3: Produktvideo

**Titel:** Produktvideo

**Beschreibung:**
```
Ihr Produkt verdient mehr als Fotos. Zeigen Sie es in Aktion, 
erklären Sie Funktionen, wecken Sie Begehrlichkeit.
```

**Ideal für:**
```
Webshop · Amazon · Landingpages · Social Ads
```

**CTA:** `Mehr erfahren →`

---

### Service 4: Social Media Content

**Titel:** Social Media Content

**Beschreibung:**
```
Kurz, knackig, scroll-stoppend. Videos für Instagram, LinkedIn, 
TikTok – optimiert für jede Plattform.
```

**Ideal für:**
```
Laufende Präsenz · Kampagnen · Employer Branding · Launches
```

**CTA:** `Mehr erfahren →`

---

## ARBEITSWEISE SECTION

### Headline
```
So arbeite ich
```

### Text
```
Kein Agentur-Sprech, keine endlosen Meetings. 
Wir sprechen einmal ausführlich, ich verstehe Ihr Ziel, und dann liefere ich.

Mein Hintergrund im Regionalfernsehen hat mich gelehrt: 
Gute Geschichten entstehen, wenn man zuhört. 
Und professionelle Ergebnisse entstehen, wenn man sein Handwerk versteht.
```

### Prozess-Schritte

```
1. GESPRÄCH
   Wir klären Ziel, Umfang und Budget. 
   Kostenlos und unverbindlich.

2. KONZEPT
   Ich entwickle die Story und den Drehplan. 
   Sie geben Feedback.

3. DREH
   Professionell, aber unkompliziert. 
   Meist ein Tag, manchmal zwei.

4. SCHNITT
   Ihr Video nimmt Form an. 
   Eine Korrekturschleife inklusive.

5. FERTIG
   Sie erhalten alle Dateien. 
   In allen Formaten, die Sie brauchen.
```

### CTA
```
[Zum detaillierten Prozess]
```

---

## PORTFOLIO SECTION

### Headline
```
Ausgewählte Projekte
```

### Subline
```
Jedes Video erzählt eine Geschichte. Hier sind einige davon.
```

### Projekt-Karten
```
[Video Thumbnail]
KUNDE / BRANCHE
Projekttitel
→ Ansehen
```

### CTA
```
[Alle Projekte ansehen]
```

---

## TESTIMONIALS SECTION

### Headline
```
Was Kunden sagen
```

### Testimonial 1 (Platzhalter)
```
"Die Zusammenarbeit mit Marcus war unkompliziert und professionell. 
Das Video hat unsere Erwartungen übertroffen – und das Feedback 
unserer Kunden ist durchweg positiv."

— [Name], [Position]
   [Firma]
```

### Testimonial 2 (Platzhalter)
```
"Endlich jemand, der zuhört und versteht, was wir brauchen. 
Keine Agentur-Floskeln, sondern echte Lösungen. 
Das Recruiting-Video hat uns drei neue Mitarbeiter gebracht."

— [Name], [Position]
   [Firma]
```

---

## KONFIGURATOR TEASER

### Headline
```
Was kostet Ihr Video?
```

### Text
```
Jedes Projekt ist anders. Mit meinem Video-Konfigurator erhalten Sie 
in 2 Minuten eine erste Einschätzung – unverbindlich und transparent.

Keine versteckten Kosten. Keine Überraschungen.
```

### CTA
```
[Jetzt konfigurieren]
```

---

## CTA SECTION (vor Footer)

### Headline
```
Bereit für ein Video, das wirkt?
```

### Text
```
Lassen Sie uns sprechen. Ich höre zu, stelle die richtigen Fragen 
und sage Ihnen ehrlich, ob und wie ich helfen kann.

Ein erstes Gespräch ist immer kostenlos.
```

### CTAs
```
[Projekt anfragen]

oder rufen Sie an: 071 XXX XX XX
oder schreiben Sie: hallo@emmotion.ch
```

---

## FOOTER

### Spalte 1: Brand
```
emmotion.ch
Videoproduktion für Unternehmen
Rheintal · Liechtenstein · Ostschweiz
```

### Spalte 2: Navigation
```
Leistungen
Portfolio
Über mich
Prozess
FAQ
Kontakt
```

### Spalte 3: Kontakt
```
Marcus [Nachname]
[Strasse]
[PLZ Ort]

hallo@emmotion.ch
071 XXX XX XX
```

### Spalte 4: Social
```
LinkedIn
Instagram
YouTube
```

### Bottom Bar
```
© 2025 emmotion.ch   ·   Impressum   ·   Datenschutz
```

---

## MOBILE HINWEISE

- Hero: Video durch optimiertes Bild ersetzen (Performance)
- Services: Vertikal statt Grid
- Navigation: Sheet/Drawer mit shadcn
- CTAs: Sticky Button am unteren Rand
- Telefon: Click-to-Call aktivieren

---

## PERFORMANCE CHECKLIST

- [ ] Bilder: WebP/AVIF mit next/image
- [ ] Videos: Lazy Loading, Poster-Bild zuerst
- [ ] Fonts: next/font mit display: swap
- [ ] CSS: Tailwind Purge aktiv
- [ ] JS: Dynamic Imports für schwere Komponenten
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
