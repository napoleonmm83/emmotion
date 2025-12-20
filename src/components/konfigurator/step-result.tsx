"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Check,
  Clock,
  Send,
  Loader2,
  CheckCircle,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  KonfiguratorInput,
  PriceResult,
  VIDEO_TYPES,
  DURATION_OPTIONS,
  COMPLEXITY_OPTIONS,
} from "@/lib/konfigurator-logic";

interface StepResultProps {
  formData: KonfiguratorInput;
  priceResult: PriceResult;
}

type RequestStatus = "idle" | "submitting" | "success" | "error";

// Turnstile Site Key (public) - Fallback für Vercel Build-Cache Probleme
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAACHcwaC7K73Z2RH3";

export function StepResult({ formData, priceResult }: StepResultProps) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Check Turnstile token if configured
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setRequestStatus("error");
      setErrorMessage("Bitte bestätige, dass du kein Roboter bist.");
      return;
    }

    setRequestStatus("submitting");

    try {
      const response = await fetch("/api/konfigurator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contactData,
          configuration: formData,
          priceResult,
          turnstileToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Anfrage fehlgeschlagen");
      }

      setRequestStatus("success");
    } catch (error) {
      setRequestStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Ein Fehler ist aufgetreten"
      );
      // Reset Turnstile on error
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  };

  if (requestStatus === "success") {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          Anfrage gesendet!
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Vielen Dank für deine Anfrage. Ich melde mich innerhalb von 24 Stunden
          mit einem individuellen Angebot bei dir.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Zurück zur Startseite
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Price Summary */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6">
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground mb-1">Geschätzter Preis</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl md:text-5xl font-bold text-foreground">
              CHF {priceResult.priceRange.min.toLocaleString("de-CH")}
            </span>
            <span className="text-2xl text-muted-foreground">–</span>
            <span className="text-4xl md:text-5xl font-bold text-foreground">
              {priceResult.priceRange.max.toLocaleString("de-CH")}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Der finale Preis wird nach einem persönlichen Gespräch festgelegt.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Geschätzte Lieferzeit: {priceResult.estimatedDays} Werktage</span>
        </div>
      </div>

      {/* Configuration Summary */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h4 className="font-medium text-foreground mb-4">Deine Konfiguration</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Video-Typ:</span>
            <span className="text-foreground font-medium">
              {VIDEO_TYPES[formData.videoType].label}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Länge:</span>
            <span className="text-foreground font-medium">
              {DURATION_OPTIONS[formData.duration].label}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Umfang:</span>
            <span className="text-foreground font-medium">
              {COMPLEXITY_OPTIONS[formData.complexity].label}
            </span>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h4 className="font-medium text-foreground mb-4">Preisaufstellung</h4>
        <div className="space-y-2">
          {priceResult.breakdown.map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-sm py-1.5 border-b border-border last:border-0"
            >
              <span className="text-muted-foreground flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                {item.item}
              </span>
              <span className="text-foreground font-medium">
                CHF {item.price.toLocaleString("de-CH")}
              </span>
            </div>
          ))}
          <div className="flex justify-between pt-3 border-t border-border mt-2">
            <span className="font-semibold text-foreground">Gesamt</span>
            <span className="font-bold text-primary text-lg">
              CHF {priceResult.totalPrice.toLocaleString("de-CH")}
            </span>
          </div>
        </div>
      </div>

      {/* Request Form Toggle */}
      {!showRequestForm ? (
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowRequestForm(true)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Send className="w-5 h-5" />
            Unverbindlich anfragen
          </button>
          <Link
            href="/kontakt"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border border-border rounded-lg hover:bg-muted transition-colors font-medium text-foreground"
          >
            <MessageSquare className="w-5 h-5" />
            Lieber direkt kontaktieren
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmitRequest} className="space-y-4">
          <h4 className="font-medium text-foreground">Deine Kontaktdaten</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Name *"
              required
              value={contactData.name}
              onChange={(e) =>
                setContactData({ ...contactData, name: e.target.value })
              }
            />
            <Input
              type="email"
              placeholder="E-Mail *"
              required
              value={contactData.email}
              onChange={(e) =>
                setContactData({ ...contactData, email: e.target.value })
              }
            />
          </div>
          <Input
            type="tel"
            placeholder="Telefon (optional)"
            value={contactData.phone}
            onChange={(e) =>
              setContactData({ ...contactData, phone: e.target.value })
            }
          />
          <Textarea
            placeholder="Zusätzliche Informationen zu deinem Projekt (optional)"
            rows={3}
            value={contactData.message}
            onChange={(e) =>
              setContactData({ ...contactData, message: e.target.value })
            }
          />

          {/* Cloudflare Turnstile */}
          {TURNSTILE_SITE_KEY && (
            <div className="flex justify-center">
              <Turnstile
                ref={turnstileRef}
                siteKey={TURNSTILE_SITE_KEY}
                onSuccess={(token) => setTurnstileToken(token)}
                onError={() => {
                  setTurnstileToken(null);
                  setErrorMessage("Captcha-Fehler. Bitte lade die Seite neu.");
                }}
                onExpire={() => setTurnstileToken(null)}
                options={{
                  theme: "auto",
                  size: "normal",
                }}
              />
            </div>
          )}

          {requestStatus === "error" && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{errorMessage || "Ein Fehler ist aufgetreten. Bitte versuch es erneut."}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setShowRequestForm(false);
                setTurnstileToken(null);
                turnstileRef.current?.reset();
              }}
              className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={requestStatus === "submitting" || (!!TURNSTILE_SITE_KEY && !turnstileToken)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {requestStatus === "submitting" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Wird gesendet...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Anfrage senden
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
