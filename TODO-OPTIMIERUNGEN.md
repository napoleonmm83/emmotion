# Offene Optimierungen – emmotion.ch

> Stand: 24.12.2024

---

## Hoch (SEO-Boost)

*Alle Punkte erledigt!*

---

## Mittel (Code-Qualität)

*Alle Punkte erledigt!*

---

## Niedrig (Nice-to-Have)

*Alle Punkte erledigt!*

---

## Erledigt

### ✅ TV-Produktionen Komponente refactored
- **Datum:** 24.12.2024
- **Beschreibung:** `tv-produktionen-content.tsx` von 805 auf 338 Zeilen reduziert (-58%)
- **Neue Struktur:**
  - `components/tv-video-card.tsx` (228 Zeilen)
  - `components/tv-helpers.tsx` (125 Zeilen)
  - `components/tv-filters.tsx` (123 Zeilen)
  - `components/tv-types.ts` (58 Zeilen)
  - `components/tv-stat-card.tsx` (34 Zeilen)

### ✅ VideoObject Schema
- **Datum:** 24.12.2024
- **Beschreibung:** Schema.org VideoObject für Portfolio-Projekte und ItemList mit VideoObjects für TV-Produktionen
- **Dateien:** `src/app/portfolio/[slug]/page.tsx`, `src/app/tv-produktionen/page.tsx`

### ✅ FAQPage Schema
- **Datum:** 24.12.2024
- **Beschreibung:** Schema.org FAQPage Markup auf `/faq` Seite (war bereits implementiert)
- **Datei:** `src/app/faq/page.tsx`

### ✅ Dynamische OG Images
- **Datum:** 24.12.2024
- **Beschreibung:** Dynamische Open Graph Images für Portfolio und Leistungen Seiten
- **Dateien:** `src/app/portfolio/[slug]/opengraph-image.tsx`, `src/app/leistungen/[slug]/opengraph-image.tsx`

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
