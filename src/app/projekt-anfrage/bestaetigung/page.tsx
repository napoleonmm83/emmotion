import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Mail, CreditCard, Calendar, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container, TrackPageView } from "@/components/shared";
import { getSettings } from "@sanity/lib/data";

export const metadata: Metadata = {
  title: "Anfrage bestätigt | emmotion.ch",
  description: "Deine Projektanfrage wurde erfolgreich eingereicht.",
};

// =============================================================================
// ASYNC CONTENT COMPONENT
// =============================================================================

async function BestaetigungContent() {
  const settings = await getSettings();

  return (
    <>
      <TrackPageView event="onboarding_confirmation" />
      <Header />
      <main className="pt-24 pb-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-display text-foreground mb-4">
              Vielen Dank für deinen Auftrag!
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Dein Vertrag wurde erfolgreich unterzeichnet. Du erhältst in Kürze
              eine Bestätigung per E-Mail mit allen Details.
            </p>

            {/* Next Steps */}
            <div className="bg-card rounded-xl p-6 md:p-8 border border-border text-left mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Nächste Schritte
              </h2>
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">E-Mail prüfen</h3>
                    <p className="text-sm text-muted-foreground">
                      Du erhältst eine Bestätigung mit deinem signierten Vertrag als
                      PDF-Anhang.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      Anzahlung überweisen
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Bitte überweise die Anzahlung innerhalb von 7 Tagen. Die
                      Bankdaten findest du in der E-Mail.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      Terminplanung
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Nach Zahlungseingang melde ich mich bei dir, um den
                      Drehtermin und weitere Details zu besprechen.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Zur Startseite
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-foreground font-medium rounded-lg border border-foreground/30 hover:border-foreground/60 hover:bg-foreground/5 transition-all"
              >
                Portfolio ansehen
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Fragen? Kontaktiere mich unter{" "}
                <a
                  href={`mailto:${settings?.contact?.email || "hallo@emmotion.ch"}`}
                  className="text-primary hover:underline"
                >
                  {settings?.contact?.email || "hallo@emmotion.ch"}
                </a>
                {settings?.contact?.phone && (
                  <>
                    {" "}
                    oder{" "}
                    <a
                      href={`tel:${settings.contact.phone}`}
                      className="text-primary hover:underline"
                    >
                      {settings.contact.phone}
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer settings={settings} />
    </>
  );
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

function BestaetigungSkeleton() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-muted animate-pulse" />
            <div className="h-10 w-80 mx-auto bg-muted animate-pulse rounded mb-4" />
            <div className="h-6 w-96 mx-auto bg-muted animate-pulse rounded mb-8" />
            <div className="bg-card rounded-xl p-6 md:p-8 border border-border">
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                    <div className="flex-1">
                      <div className="h-5 w-32 bg-muted animate-pulse rounded mb-2" />
                      <div className="h-4 w-full bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </main>
      <footer className="h-64 bg-muted/10 animate-pulse" />
    </>
  );
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function BestaetigungPage() {
  return (
    <Suspense fallback={<BestaetigungSkeleton />}>
      <BestaetigungContent />
    </Suspense>
  );
}
