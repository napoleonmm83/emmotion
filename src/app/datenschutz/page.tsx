import { cacheLife } from "next/cache";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LegalPageContent } from "@/components/legal";
import { client } from "@sanity/lib/client";
import { legalPageBySlugQuery, settingsQuery } from "@sanity/lib/queries";
import { CACHE_PROFILES } from "@/lib/cache";

export const metadata: Metadata = {
  title: "Datenschutz | emmotion.ch",
  description:
    "Datenschutzerklärung von emmotion.ch - Informationen zum Umgang mit deinen personenbezogenen Daten.",
  robots: {
    index: true,
    follow: true,
  },
};

// Fallback Kontaktdaten
const defaultContact = {
  email: "hallo@emmotion.ch",
  phone: "+41 79 723 29 24",
  street: "Kerbelstrasse 6",
  city: "9470 Buchs SG",
  uid: "CHE-387.768.205",
};

interface Settings {
  siteName?: string;
  contact?: {
    email?: string;
    phone?: string;
    street?: string;
    city?: string;
    uid?: string;
  };
}

async function getDatenschutzData() {
  "use cache";
  cacheLife(CACHE_PROFILES.static); // Rechtliche Seiten ändern selten - 24h revalidate
  try {
    const data = await client.fetch(legalPageBySlugQuery, { slug: "datenschutz" });
    return data;
  } catch {
    return null;
  }
}

async function getSettings(): Promise<Settings | null> {
  "use cache";
  cacheLife(CACHE_PROFILES.settings); // Site-Einstellungen - 10min revalidate
  try {
    const data = await client.fetch(settingsQuery);
    return data || null;
  } catch {
    return null;
  }
}

// Placeholder content while CMS data is not yet available
function DatenschutzFallback({ settings }: { settings: Settings | null }) {
  const contact = {
    email: settings?.contact?.email || defaultContact.email,
    phone: settings?.contact?.phone || defaultContact.phone,
    street: settings?.contact?.street || defaultContact.street,
    city: settings?.contact?.city || defaultContact.city,
    uid: settings?.contact?.uid || defaultContact.uid,
  };
  const siteName = settings?.siteName || "emmotion.ch";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 tracking-wide">
          1. Datenschutz auf einen Blick
        </h2>
        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 tracking-wide">
          Allgemeine Hinweise
        </h3>
        <p className="text-muted-foreground mb-4">
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit deinen
          personenbezogenen Daten passiert, wenn du diese Website besuchst.
          Personenbezogene Daten sind alle Daten, mit denen du persönlich identifiziert
          werden kannst.
        </p>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 tracking-wide">
          2. Verantwortliche Stelle
        </h2>
        <div className="text-muted-foreground space-y-1 mb-4">
          <p className="font-medium text-foreground">{siteName}</p>
          <p className="text-sm text-muted-foreground mb-2">
            Ein Brand von martini.digital
          </p>
          <p>Marcus Martini</p>
          <p>{contact.street}</p>
          <p>{contact.city}</p>
          <p>Schweiz</p>
          <p className="mt-2">UID: {contact.uid}</p>
          <p className="mt-2">
            E-Mail:{" "}
            <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
              {contact.email}
            </a>
          </p>
        </div>
        <p className="text-muted-foreground">
          Verantwortliche Stelle ist die natürliche oder juristische Person, die allein
          oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von
          personenbezogenen Daten entscheidet.
        </p>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 tracking-wide">
          3. Datenerfassung auf dieser Website
        </h2>

        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 mt-8 tracking-wide">
          Kontaktformular
        </h3>
        <p className="text-muted-foreground mb-4">
          Wenn du mir per Kontaktformular Anfragen zukommen lässt, werden deine Angaben
          aus dem Anfrageformular inklusive der von dir dort angegebenen Kontaktdaten
          zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei mir
          gespeichert. Diese Daten gebe ich nicht ohne deine Einwilligung weiter.
        </p>
        <p className="text-muted-foreground mb-4">
          Die Verarbeitung dieser Daten erfolgt auf Grundlage deiner Einwilligung
          (Art. 6 Abs. 1 lit. a DSGVO / Art. 13 DSG). Du kannst diese Einwilligung
          jederzeit widerrufen.
        </p>

        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 mt-8 tracking-wide">
          Video-Konfigurator
        </h3>
        <p className="text-muted-foreground mb-4">
          Bei Nutzung unseres Video-Konfigurators werden die von dir eingegebenen Daten
          (Konfiguration, Kontaktdaten) zwecks Bearbeitung deiner Anfrage gespeichert.
          Diese Daten werden ausschliesslich zur Erstellung eines Angebots verwendet.
        </p>

        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 mt-8 tracking-wide">
          Aufbewahrung und Löschung
        </h3>
        <p className="text-muted-foreground mb-4">
          Kontaktanfragen und Konfigurator-Anfragen werden automatisch nach <strong>60 Tagen</strong> gelöscht.
          Diese automatische Löschung gewährleistet die Datensparsamkeit gemäss DSGVO/DSG.
          Du kannst jederzeit eine vorzeitige Löschung deiner Daten verlangen.
        </p>

        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 mt-8 tracking-wide">
          Spam-Schutz (Cloudflare Turnstile)
        </h3>
        <p className="text-muted-foreground mb-4">
          Unsere Formulare verwenden Cloudflare Turnstile zum Schutz vor Spam und Missbrauch.
          Turnstile ist eine datenschutzfreundliche Alternative zu herkömmlichen Captchas und
          setzt <strong>keine Cookies</strong>. Bei der Nutzung werden technische Daten wie
          IP-Adresse und Browser-Informationen an Cloudflare übermittelt.
        </p>
        <p className="text-muted-foreground mb-4">
          Anbieter: Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA.
          Datenschutzerklärung:{" "}
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            https://www.cloudflare.com/privacypolicy/
          </a>
        </p>

        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 mt-8 tracking-wide">Server-Log-Dateien</h3>
        <p className="text-muted-foreground mb-4">
          Der Provider der Seiten erhebt und speichert automatisch Informationen in
          sogenannten Server-Log-Dateien, die dein Browser automatisch übermittelt.
          Dies sind:
        </p>
        <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
          <li>Browsertyp und Browserversion</li>
          <li>Verwendetes Betriebssystem</li>
          <li>Referrer URL</li>
          <li>Hostname des zugreifenden Rechners</li>
          <li>Uhrzeit der Serveranfrage</li>
          <li>IP-Adresse</li>
        </ul>
        <p className="text-muted-foreground mb-4">
          Diese Daten werden nicht mit anderen Datenquellen zusammengeführt. Die
          Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
        </p>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 tracking-wide">
          4. Hosting und externe Dienste
        </h2>

        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 tracking-wide">
          Hosting (Vercel)
        </h3>
        <p className="text-muted-foreground mb-4">
          Diese Website wird bei Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789,
          USA gehostet. Vercel verarbeitet die erhobenen Daten im Auftrag und ist
          vertraglich verpflichtet, geeignete technische und organisatorische
          Massnahmen zum Schutz der Daten zu treffen.
        </p>
        <p className="text-muted-foreground mb-4">
          Datenschutzerklärung:{" "}
          <a
            href="https://vercel.com/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            https://vercel.com/legal/privacy-policy
          </a>
        </p>

        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 mt-8 tracking-wide">
          Content Management (Sanity)
        </h3>
        <p className="text-muted-foreground mb-4">
          Für die Verwaltung der Website-Inhalte verwenden wir Sanity.io. Sanity ist ein
          Content-Management-System mit Sitz in Norwegen/EU. Die Inhalte werden auf
          Servern von Sanity gespeichert. Bei der Nutzung der Website werden keine
          personenbezogenen Daten an Sanity übermittelt – nur redaktionelle Inhalte.
        </p>
        <p className="text-muted-foreground mb-4">
          Anbieter: Sanity AS, Grensen 13, 0159 Oslo, Norwegen.
          Datenschutzerklärung:{" "}
          <a
            href="https://www.sanity.io/legal/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            https://www.sanity.io/legal/privacy
          </a>
        </p>

        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 mt-8 tracking-wide">
          E-Mail-Versand (Resend)
        </h3>
        <p className="text-muted-foreground mb-4">
          Für den Versand von E-Mails (z.B. Kontaktformular-Benachrichtigungen) nutzen wir
          den Dienst Resend. Wenn du das Kontaktformular nutzt, werden deine Angaben
          (Name, E-Mail, Nachricht) über Resend an uns übermittelt.
        </p>
        <p className="text-muted-foreground mb-4">
          Anbieter: Resend, Inc., 2261 Market Street #4990, San Francisco, CA 94114, USA.
          Datenschutzerklärung:{" "}
          <a
            href="https://resend.com/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            https://resend.com/legal/privacy-policy
          </a>
        </p>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 tracking-wide">
          5. Deine Rechte
        </h2>
        <p className="text-muted-foreground mb-4">Du hast jederzeit das Recht:</p>
        <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
          <li>
            <strong>Auskunft</strong> über deine bei mir gespeicherten personenbezogenen
            Daten zu erhalten
          </li>
          <li>
            <strong>Berichtigung</strong> unrichtiger personenbezogener Daten zu
            verlangen
          </li>
          <li>
            <strong>Löschung</strong> deiner bei mir gespeicherten personenbezogenen
            Daten zu verlangen
          </li>
          <li>
            <strong>Einschränkung</strong> der Verarbeitung zu verlangen
          </li>
          <li>
            <strong>Widerspruch</strong> gegen die Verarbeitung einzulegen
          </li>
          <li>
            <strong>Datenübertragbarkeit</strong> deiner Daten zu verlangen
          </li>
        </ul>
        <p className="text-muted-foreground mb-4">
          Wenn du der Meinung bist, dass die Verarbeitung deiner Daten gegen das
          Datenschutzrecht verstösst, hast du das Recht, dich bei der zuständigen
          Aufsichtsbehörde zu beschweren.
        </p>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 tracking-wide">
          6. E-Mail-Kommunikation
        </h2>
        <p className="text-muted-foreground mb-4">
          Wenn du mit mir per E-Mail kommunizierst, werden deine E-Mail-Adresse und der
          Inhalt deiner Nachricht gespeichert, um deine Anfrage bearbeiten zu können.
          Diese Daten werden ohne deine Einwilligung nicht an Dritte weitergegeben.
        </p>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 tracking-wide">
          7. Cookies
        </h2>
        <p className="text-muted-foreground mb-4">
          Diese Website verwendet keine Tracking-Cookies. Es werden nur technisch
          notwendige Cookies verwendet, die für den Betrieb der Website erforderlich
          sind.
        </p>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 tracking-wide">
          8. Analyse-Tools
        </h2>
        <p className="text-muted-foreground mb-4">
          Diese Website verwendet derzeit keine Analyse-Tools. Sollte in Zukunft ein
          datenschutzfreundliches Analyse-Tool wie Plausible Analytics eingesetzt werden,
          wird diese Datenschutzerklärung entsprechend aktualisiert.
        </p>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 tracking-wide">
          9. SSL-/TLS-Verschlüsselung
        </h2>
        <p className="text-muted-foreground mb-4">
          Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung
          vertraulicher Inhalte eine SSL-/TLS-Verschlüsselung. Eine verschlüsselte
          Verbindung erkennst du daran, dass die Adresszeile des Browsers von
          &quot;http://&quot; auf &quot;https://&quot; wechselt und an dem Schloss-Symbol
          in deiner Browserzeile.
        </p>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 tracking-wide">
          10. Änderungen dieser Datenschutzerklärung
        </h2>
        <p className="text-muted-foreground mb-4">
          Ich behalte mir vor, diese Datenschutzerklärung anzupassen, damit sie stets
          den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen meiner
          Leistungen in der Datenschutzerklärung umzusetzen. Für deinen erneuten Besuch
          gilt dann die neue Datenschutzerklärung.
        </p>
      </div>

    </div>
  );
}

export default async function DatenschutzPage() {
  const [pageData, settings] = await Promise.all([
    getDatenschutzData(),
    getSettings(),
  ]);

  return (
    <>
      <Header />
      <main className="pt-20 pb-16">
        <LegalPageContent
          title={pageData?.title || "Datenschutzerklärung"}
          content={pageData?.content || null}
          lastUpdated={pageData?.lastUpdated}
          fallbackContent={<DatenschutzFallback settings={settings} />}
        />
      </main>
      <Footer settings={settings} />
    </>
  );
}
