// Seite alle 60 Sekunden revalidieren für CMS-Updates
export const revalidate = 60;

import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LegalPageContent } from "@/components/legal";
import { client } from "@sanity/lib/client";
import { legalPageBySlugQuery, settingsQuery } from "@sanity/lib/queries";

export const metadata: Metadata = {
  title: "Impressum | emmotion.ch",
  description:
    "Impressum und Angaben zum Anbieter von emmotion.ch - Videoproduktion im Rheintal, Liechtenstein und der Ostschweiz.",
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

async function getImpressumData() {
  try {
    const data = await client.fetch(legalPageBySlugQuery, { slug: "impressum" });
    return data;
  } catch {
    return null;
  }
}

async function getSettings(): Promise<Settings | null> {
  try {
    const data = await client.fetch(settingsQuery);
    return data || null;
  } catch {
    return null;
  }
}

function ImpressumFallback({ settings }: { settings: Settings | null }) {
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
          Angaben gemäss Schweizer Recht
        </h2>
        <div className="text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">{siteName}</p>
          <p className="text-sm text-muted-foreground mb-2">
            Ein Brand von martini.digital
          </p>
          <p>Marcus Martini</p>
          <p>{contact.street}</p>
          <p>{contact.city}</p>
          <p>Schweiz</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 tracking-wide">
          Handelsregister-Informationen
        </h2>
        <div className="text-muted-foreground space-y-1">
          <p>Rechtsform: Einzelunternehmen</p>
          <p>Sitz: Buchs (SG)</p>
          <p>UID: {contact.uid}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 tracking-wide">Kontakt</h2>
        <div className="text-muted-foreground space-y-1">
          <p>
            E-Mail:{" "}
            <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
              {contact.email}
            </a>
          </p>
          <p>
            Telefon:{" "}
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="text-primary hover:underline">
              {contact.phone}
            </a>
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 tracking-wide">
          Verantwortlich für den Inhalt
        </h2>
        <div className="text-muted-foreground space-y-1">
          <p>Marcus Martini</p>
          <p>{contact.street}</p>
          <p>{contact.city}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 tracking-wide">
          Haftungsausschluss
        </h2>

        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 mt-8 tracking-wide">
          Haftung für Inhalte
        </h3>
        <p className="text-muted-foreground mb-4">
          Die Inhalte dieser Seiten wurden mit grösster Sorgfalt erstellt. Für die
          Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann ich jedoch
          keine Gewähr übernehmen. Als Diensteanbieter bin ich für eigene Inhalte auf
          diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Ich bin jedoch
          nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
          überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
          Tätigkeit hinweisen.
        </p>

        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 mt-8 tracking-wide">
          Haftung für Links
        </h3>
        <p className="text-muted-foreground mb-4">
          Mein Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte
          ich keinen Einfluss habe. Deshalb kann ich für diese fremden Inhalte auch
          keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der
          jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten
          Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstösse
          überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht
          erkennbar.
        </p>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 tracking-wide">Urheberrecht</h2>
        <p className="text-muted-foreground">
          Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
          unterliegen dem schweizerischen Urheberrecht. Die Vervielfältigung,
          Bearbeitung, Verbreitung und jede Art der Verwertung ausserhalb der Grenzen
          des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen
          Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den
          privaten, nicht kommerziellen Gebrauch gestattet.
        </p>
      </div>
    </div>
  );
}

export default async function ImpressumPage() {
  const [pageData, settings] = await Promise.all([
    getImpressumData(),
    getSettings(),
  ]);

  return (
    <>
      <Header />
      <main className="pt-20 pb-16">
        <LegalPageContent
          title={pageData?.title || "Impressum"}
          content={pageData?.content || null}
          lastUpdated={pageData?.lastUpdated}
          fallbackContent={<ImpressumFallback settings={settings} />}
        />
      </main>
      <Footer settings={settings} />
    </>
  );
}
