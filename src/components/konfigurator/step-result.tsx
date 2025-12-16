"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Clock,
  Send,
  Loader2,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
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

export function StepResult({ formData, priceResult }: StepResultProps) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("idle");
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus("submitting");

    try {
      const response = await fetch("/api/konfigurator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contactData,
          configuration: formData,
          priceResult,
        }),
      });

      if (!response.ok) throw new Error("Anfrage fehlgeschlagen");

      setRequestStatus("success");
    } catch {
      setRequestStatus("error");
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
          Vielen Dank für Ihre Anfrage. Ich melde mich innerhalb von 24 Stunden
          mit einem individuellen Angebot bei Ihnen.
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
        <h4 className="font-medium text-foreground mb-4">Ihre Konfiguration</h4>
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
          <h4 className="font-medium text-foreground">Ihre Kontaktdaten</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name *"
              required
              value={contactData.name}
              onChange={(e) =>
                setContactData({ ...contactData, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
            <input
              type="email"
              placeholder="E-Mail *"
              required
              value={contactData.email}
              onChange={(e) =>
                setContactData({ ...contactData, email: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <input
            type="tel"
            placeholder="Telefon (optional)"
            value={contactData.phone}
            onChange={(e) =>
              setContactData({ ...contactData, phone: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
          <textarea
            placeholder="Zusätzliche Informationen zu Ihrem Projekt (optional)"
            rows={3}
            value={contactData.message}
            onChange={(e) =>
              setContactData({ ...contactData, message: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
          />

          {requestStatus === "error" && (
            <p className="text-red-500 text-sm">
              Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowRequestForm(false)}
              className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={requestStatus === "submitting"}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
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
