# Offene Optimierungen – emmotion.ch

> Stand: 24.12.2024

---

## Hoch (SEO-Boost)

### 1. VideoObject Schema hinzufügen
- **Status:** Offen
- **Beschreibung:** Schema.org VideoObject Markup für Portfolio-Projekte und TV-Produktionen hinzufügen für Rich Results in Google
- **Dateien:**
  - `src/app/portfolio/[slug]/page.tsx`
  - `src/app/tv-produktionen/page.tsx`
- **Beispiel:**
```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Projekt Titel",
  "description": "...",
  "thumbnailUrl": "...",
  "uploadDate": "2024-01-01",
  "duration": "PT2M30S",
  "contentUrl": "..."
}
```

### 2. FAQPage Schema hinzufügen
- **Status:** Offen
- **Beschreibung:** Schema.org FAQPage Markup auf `/faq` Seite für Rich Results
- **Datei:** `src/app/faq/page.tsx`
- **Beispiel:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Frage hier?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Antwort hier."
      }
    }
  ]
}
```

### 3. OG Images für Dynamic Pages
- **Status:** Offen
- **Beschreibung:** Dynamische Open Graph Images für bessere Social Media Previews
- **Neue Dateien erstellen:**
  - `src/app/portfolio/[slug]/opengraph-image.tsx`
  - `src/app/leistungen/[slug]/opengraph-image.tsx`
- **Referenz:** https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image

---

## Mittel (Code-Qualität)

*Alle Punkte erledigt!*

---

## Niedrig (Nice-to-Have)

### 7. Grosse Komponenten refactoren
- **Status:** Offen
- **Beschreibung:** `tv-produktionen-content.tsx` (805 Zeilen) in Sub-Komponenten aufteilen
- **Datei:** `src/app/tv-produktionen/tv-produktionen-content.tsx`
- **Vorschlag:**
  - `tv-grid.tsx` – Grid Rendering
  - `tv-filters.tsx` – Filter Logic
  - `tv-stats.tsx` – Statistiken

---

## Erledigt

### ✅ Next.js 16 cacheComponents Migration
- **Datum:** 24.12.2024
- **Beschreibung:** Alle Pages auf Suspense + cached Data Layer migriert, Sanity Webhook für sofortige Revalidierung

### ✅ Studio Page noindex
- **Datum:** 24.12.2024
- **Beschreibung:** `robots: { index: false, follow: false }` in Studio Layout

### ✅ Home Page explizite Metadata
- **Datum:** 24.12.2024
- **Beschreibung:** Explizite Metadata für Homepage statt nur Layout-Vererbung

### ✅ sizes Attribute
- **Datum:** 24.12.2024
- **Beschreibung:** Alle Images mit `fill` haben jetzt `sizes` Attribute

### ✅ Doppelte Fetch-Logik extrahieren
- **Datum:** 24.12.2024
- **Beschreibung:** Mit cacheComponents erledigt - alle Fetches zentral in `sanity/lib/data.ts`

### ✅ Console Logs entfernen
- **Datum:** 22.12.2024
- **Commit:** `fec49a3`
- **Beschreibung:** ~97 console.log/error Statements aus 21 Dateien entfernt
