# Offene Optimierungen – emmotion.ch

> Stand: 22.12.2024

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

### 4. Studio Page noindex
- **Status:** Offen
- **Beschreibung:** Sanity Studio von Suchmaschinen ausschliessen
- **Datei:** `src/app/studio/[[...tool]]/page.tsx`
- **Lösung:**
```tsx
export const metadata: Metadata = {
  robots: { index: false, follow: false }
};
```

### 5. Home Page explizite Metadata
- **Status:** Offen
- **Beschreibung:** `generateMetadata()` für Home Page hinzufügen statt nur von Layout zu erben
- **Datei:** `src/app/page.tsx`

### 6. Fehlende `sizes` Attribute
- **Status:** Offen
- **Beschreibung:** `sizes` Attribut bei TV-Preview Image hinzufügen
- **Datei:** `src/components/sections/portfolio.tsx` (Zeile ~195)
- **Lösung:** `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`

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

### 8. Doppelte Fetch-Logik extrahieren
- **Status:** Offen
- **Beschreibung:** `getProjects()` und `getSettings()` in shared lib extrahieren
- **Betroffene Dateien:**
  - `src/app/portfolio/page.tsx`
  - `src/app/portfolio/[slug]/page.tsx`
- **Ziel:** `src/lib/portfolio-queries.ts`

---

## Erledigt

### ✅ Console Logs entfernen
- **Datum:** 22.12.2024
- **Commit:** `fec49a3`
- **Beschreibung:** ~97 console.log/error Statements aus 21 Dateien entfernt
