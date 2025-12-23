/**
 * Cache Profile Konfigurationen für Next.js 16 Cache Components
 *
 * Diese Profile werden direkt in cacheLife() verwendet, um TypeScript-Kompatibilität
 * zu gewährleisten. Die Werte entsprechen den Definitionen in next.config.ts.
 *
 * Verwendung:
 *   import { CACHE_PROFILES } from "@/lib/cache";
 *   cacheLife(CACHE_PROFILES.cms);
 */

type CacheProfile = {
  stale: number;
  revalidate: number;
  expire: number;
};

/**
 * Differenzierte Cache-Profile basierend auf Content-Typ
 */
export const CACHE_PROFILES = {
  /**
   * Statische/rechtliche Seiten (Impressum, Datenschutz)
   * - Ändern sehr selten
   * - 24h revalidate, 7 Tage Cache
   */
  static: {
    stale: 3600,        // 1h - Daten gelten als frisch
    revalidate: 86400,  // 24h - einmal täglich revalidieren
    expire: 604800,     // 7 Tage - maximale Cache-Dauer
  } as CacheProfile,

  /**
   * Site-weite Einstellungen (Kontaktdaten, Social Links)
   * - Ändern gelegentlich
   * - 10min revalidate
   */
  settings: {
    stale: 300,         // 5min - Daten gelten als frisch
    revalidate: 600,    // 10min - regelmässig revalidieren
    expire: 3600,       // 1h - maximale Cache-Dauer
  } as CacheProfile,

  /**
   * Regulärer CMS-Inhalt (Portfolio, Services, FAQ)
   * - Standard-Aktualisierung wie bisheriges revalidate = 60
   * - 60s revalidate
   */
  cms: {
    stale: 30,          // 30s - Daten gelten als frisch
    revalidate: 60,     // 60s - wie bisheriges revalidate = 60
    expire: 3600,       // 1h - maximale Cache-Dauer
  } as CacheProfile,

  /**
   * Externe Daten (YouTube TV-Produktionen)
   * - Häufiger aktualisiert via Cron
   * - 5min revalidate
   */
  external: {
    stale: 60,          // 1min - Daten gelten als frisch
    revalidate: 300,    // 5min - regelmässig revalidieren
    expire: 1800,       // 30min - maximale Cache-Dauer
  } as CacheProfile,

  /**
   * Onboarding-Daten (Fragebögen, Vertragsvorlagen)
   * - Müssen aktuell sein für Kundenprozess
   * - 2min revalidate
   */
  onboarding: {
    stale: 30,          // 30s - Daten gelten als frisch
    revalidate: 120,    // 2min - häufig revalidieren
    expire: 600,        // 10min - maximale Cache-Dauer
  } as CacheProfile,
} as const;
