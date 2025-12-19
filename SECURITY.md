# Sicherheitsdokumentation – emmotion.ch

> Letzte Aktualisierung: 19. Dezember 2024

---

## Übersicht

Diese Dokumentation beschreibt alle implementierten Sicherheitsmassnahmen für deine emmotion.ch Website.

---

## 1. Security Headers

**Datei:** `next.config.ts`

| Header | Wert | Zweck |
|--------|------|-------|
| `X-Frame-Options` | `SAMEORIGIN` | Verhindert Clickjacking |
| `X-Content-Type-Options` | `nosniff` | Verhindert MIME-Type Sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Kontrolliert Referrer-Informationen |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Erzwingt HTTPS |
| `Permissions-Policy` | Restriktiv | Deaktiviert Kamera, Mikrofon, etc. |
| `Content-Security-Policy` | Umfassend | XSS-Schutz, Script-Kontrolle |

---

## 2. CAPTCHA Protection (Cloudflare Turnstile)

**Dateien:**
- `src/lib/turnstile.ts`
- `src/components/forms/contact-form.tsx`
- `src/components/konfigurator/step-result.tsx`

### Konfiguration
- **Site Key:** `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (öffentlich)
- **Secret Key:** `TURNSTILE_SECRET_KEY` (nur Server)

### Fail-Secure Verhalten
```typescript
if (!TURNSTILE_SECRET_KEY) {
  if (process.env.NODE_ENV === "production") {
    return false; // Blockt in Produktion
  }
  return true; // Erlaubt in Entwicklung
}
```

### Geschützte Formulare
- Kontaktformular (`/kontakt`)
- Konfigurator Anfrage (`/konfigurator`)

---

## 3. CSRF Protection

**Datei:** `src/lib/csrf.ts`

### Origin Validation
Erlaubte Origins:
- `https://emmotion.ch`
- `https://www.emmotion.ch`
- `https://emmotion-*.vercel.app` (Preview Deployments)
- `localhost` (nur Entwicklung)

### Geschützte Endpoints
- `/api/contact`
- `/api/konfigurator`
- `/api/projekt-anfrage/submit-signed`

---

## 4. Rate Limiting (Redis/Upstash)

**Datei:** `src/lib/rate-limit.ts`

### Technologie
- **Produktion:** Upstash Redis (Sliding Window Algorithmus)
- **Fallback:** In-Memory (bei Redis-Ausfall oder lokaler Entwicklung)

### Konfiguration (Vercel Environment Variables)
```
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

### Limits pro Endpoint

| Endpoint | Limit | Zeitfenster |
|----------|-------|-------------|
| `/api/contact` | 5 Anfragen | 1 Stunde |
| `/api/konfigurator` | 10 Anfragen | 1 Stunde |
| `/api/projekt-anfrage/submit-signed` | 5 Anfragen | 1 Stunde |
| `/api/email-test` | 3 Anfragen | 1 Stunde |
| `/api/blob/upload` | 10 Uploads | 1 Stunde |

### Response Headers bei Rate Limit
```
HTTP 429 Too Many Requests
Retry-After: <seconds>
X-RateLimit-Remaining: 0
```

---

## 5. Input Sanitization (XSS Prevention)

**Datei:** `src/lib/sanitize.ts`

### Funktionen

| Funktion | Zweck | Max. Länge |
|----------|-------|------------|
| `sanitizeString()` | Entfernt HTML-Tags | Konfigurierbar (default 5000) |
| `sanitizeEmail()` | Bereinigt E-Mail-Adressen | 254 Zeichen |
| `sanitizePhone()` | Nur erlaubte Zeichen | 30 Zeichen |

### Geschützte Felder
- Name, E-Mail, Telefon, Firma
- Nachrichten und Beschreibungen
- Projekt-Details

### Beispiel
```typescript
// Input: "<script>alert('xss')</script>Hello"
// Output: "Hello"
```

---

## 6. Request Size Limits

### Konfiguration pro Endpoint

| Endpoint | Max. Grösse | Grund |
|----------|-------------|-------|
| `/api/contact` | 50 KB | Normales Formular |
| `/api/konfigurator` | 50 KB | Normales Formular |
| `/api/projekt-anfrage/submit-signed` | 500 KB | Enthält Signatur-Daten |
| `/api/blob/upload` | 200 MB | Video-Uploads |

### Response bei Überschreitung
```
HTTP 413 Payload Too Large
{ "error": "Anfrage zu gross." }
```

---

## 7. API Endpoint Authentication

### Cron Jobs
**Dateien:** `src/app/api/cron/*/route.ts`

```typescript
// Header: Authorization: Bearer <CRON_SECRET>
const cronSecret = process.env.CRON_SECRET;
const authHeader = request.headers.get("authorization");
return authHeader === `Bearer ${cronSecret}`;
```

**Geschützte Endpoints:**
- `/api/cron/cleanup-submissions`
- `/api/cron/sync-youtube`

### Webhooks
**Datei:** `src/app/api/projekt-anfrage/regenerate-contract/route.ts`

```typescript
// Header: sanity-webhook-secret: <SANITY_WEBHOOK_SECRET>
const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
const receivedSecret = request.headers.get("sanity-webhook-secret");
return receivedSecret === webhookSecret;
```

### Blob Upload
**Datei:** `src/app/api/blob/upload/route.ts`

- Origin Validation (nur Studio erlaubt)
- Optional: `BLOB_UPLOAD_SECRET` Header

---

## 8. Spam Protection

### Honeypot Feld
```typescript
// Verstecktes Feld "website" - Bots füllen es aus
if (body.website && body.website.length > 0) {
  return NextResponse.json({ success: true }); // Fake success
}
```

### Zeitbasierte Validierung
```typescript
// Formular muss mindestens 3 Sekunden offen sein
const MIN_SUBMISSION_TIME = 3000;
if (Date.now() - body._timestamp < MIN_SUBMISSION_TIME) {
  return NextResponse.json({ success: true }); // Fake success
}
```

### Spam Pattern Detection
```typescript
const spamPatterns = [
  /\[url=/i,
  /\[link=/i,
  /<a\s+href/i,
  /viagra|cialis|casino|crypto|bitcoin|lottery|winner/i,
];
```

---

## 9. Environment Variables (Vercel)

### Required
| Variable | Zweck |
|----------|-------|
| `SANITY_API_TOKEN` | Sanity CMS Zugriff |
| `RESEND_API_KEY` | E-Mail Versand |
| `TURNSTILE_SECRET_KEY` | CAPTCHA Verifizierung |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | CAPTCHA Widget |

### Security Secrets
| Variable | Zweck |
|----------|-------|
| `CRON_SECRET` | Cron Job Authentifizierung |
| `SANITY_WEBHOOK_SECRET` | Webhook Authentifizierung |
| `BLOB_UPLOAD_SECRET` | Upload Authentifizierung (optional) |

### Rate Limiting
| Variable | Zweck |
|----------|-------|
| `UPSTASH_REDIS_REST_URL` | Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | Redis Token |

---

## 10. Server-seitige Validierung

### Preisberechnung (Konfigurator)
**Datei:** `src/app/api/konfigurator/route.ts`

```typescript
// Client-seitige Preise werden ignoriert
// Server berechnet immer neu
const price = calculatePrice(config);
```

### Konfigurationswerte
```typescript
const validVideoTypes = ["imagefilm", "recruiting", "produkt", "social", "event"];
const validDurations = ["short", "medium", "long"];
const validComplexities = ["simple", "standard", "premium"];

if (!validVideoTypes.includes(config.videoType)) {
  return NextResponse.json({ error: "Ungültiger Video-Typ." }, { status: 400 });
}
```

---

## 11. Sicherheits-Checkliste

### Vor jedem Deployment
- [ ] Alle Environment Variables in Vercel gesetzt
- [ ] CRON_SECRET und WEBHOOK_SECRET sind stark (64+ Zeichen)
- [ ] Turnstile Keys korrekt konfiguriert
- [ ] Redis (Upstash) erreichbar

### Regelmässig prüfen
- [ ] `pnpm audit` für Dependency-Vulnerabilities
- [ ] Rate Limit Logs auf Anomalien checken
- [ ] Sanity Submissions auf Spam-Muster prüfen
- [ ] Error Logs auf verdächtige Aktivitäten durchschauen

---

## 12. Bekannte Einschränkungen

1. **In-Memory Rate Limiting Fallback**
   - Bei Redis-Ausfall: Limits werden bei Server-Neustart zurückgesetzt
   - Bei mehreren Serverless-Instanzen: Limits sind nicht synchronisiert

2. **CSP `unsafe-inline`**
   - Aktuell für Inline-Styles erforderlich
   - Zukünftig: Nonce-basierte CSP implementieren

3. **Keine IP-Anonymisierung**
   - IPs werden für Rate Limiting gespeichert
   - Retention: 1 Stunde (Redis TTL)

---

## 13. Kontakt bei Sicherheitsproblemen

Falls du eine Sicherheitslücke entdeckst:
1. **Nicht öffentlich melden**
2. E-Mail an: marcus@emmotion.ch
3. Antwort innerhalb von 24-48 Stunden

---

## Änderungshistorie

| Datum | Änderung |
|-------|----------|
| 2024-12-19 | Initial: Security Headers, CSRF, Rate Limiting |
| 2024-12-19 | Turnstile CAPTCHA Integration |
| 2024-12-19 | Upstash Redis für Rate Limiting |
| 2024-12-19 | Input Sanitization (XSS Prevention) |
| 2024-12-19 | Request Size Limits |
| 2024-12-19 | Fail-Secure Turnstile Verhalten |
