"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// CMS Contact Form Settings Interface
interface ContactFormSettings {
  subjectOptions?: Array<{ value: string; label: string }>;
  placeholders?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    message?: string;
  };
  submitButtonText?: string;
  successMessage?: string;
  privacyText?: string;
}

interface ContactFormProps {
  className?: string;
  variant?: "default" | "compact";
  settings?: ContactFormSettings;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  // Honeypot field - should remain empty
  website: string;
  // Timestamp for time-based validation
  _timestamp: number;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

// Default subject options as fallback
const DEFAULT_SUBJECT_OPTIONS = [
  { value: "", label: "Bitte auswählen" },
  { value: "general", label: "Allgemeine Anfrage" },
  { value: "project", label: "Projektanfrage" },
  { value: "pricing", label: "Preisanfrage" },
  { value: "collaboration", label: "Zusammenarbeit" },
  { value: "other", label: "Sonstiges" },
];

// Default placeholders as fallback
const DEFAULT_PLACEHOLDERS = {
  name: "Dein Name",
  email: "deine@email.ch",
  phone: "+41 79 123 45 67",
  company: "Deine Firma",
  message: "Erzähl mir von deinem Projekt...",
};

const DEFAULT_SUCCESS_MESSAGE = "Vielen Dank für deine Nachricht! Ich melde mich innerhalb von 24 Stunden bei dir.";
const DEFAULT_SUBMIT_TEXT = "Nachricht senden";
const DEFAULT_PRIVACY_TEXT = "Mit dem Absenden stimmst du der Verarbeitung deiner Daten gemäss unserer Datenschutzerklärung zu.";

// Turnstile Site Key (public) - Fallback für Vercel Build-Cache Probleme
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAACHcwaC7K73Z2RH3";

export function ContactForm({ className = "", variant = "default", settings }: ContactFormProps) {
  // Merge CMS settings with defaults
  const subjectOptions = settings?.subjectOptions?.length
    ? [{ value: "", label: "Bitte auswählen" }, ...settings.subjectOptions]
    : DEFAULT_SUBJECT_OPTIONS;

  const placeholders = {
    name: settings?.placeholders?.name || DEFAULT_PLACEHOLDERS.name,
    email: settings?.placeholders?.email || DEFAULT_PLACEHOLDERS.email,
    phone: settings?.placeholders?.phone || DEFAULT_PLACEHOLDERS.phone,
    company: settings?.placeholders?.company || DEFAULT_PLACEHOLDERS.company,
    message: settings?.placeholders?.message || DEFAULT_PLACEHOLDERS.message,
  };

  const submitButtonText = settings?.submitButtonText || DEFAULT_SUBMIT_TEXT;
  const configuredSuccessMessage = settings?.successMessage || DEFAULT_SUCCESS_MESSAGE;
  const privacyText = settings?.privacyText || DEFAULT_PRIVACY_TEXT;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    website: "", // Honeypot
    _timestamp: 0,
  });

  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  // Set timestamp when component mounts (for time-based spam detection)
  useEffect(() => {
    setFormData((prev) => ({ ...prev, _timestamp: Date.now() }));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check Turnstile token if configured
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setStatus("error");
      setErrorMessage("Bitte bestätige, dass du kein Roboter bist.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Ein Fehler ist aufgetreten");
      }

      setStatus("success");
      setSuccessMessage(
        result.message || configuredSuccessMessage
      );

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
        website: "",
        _timestamp: Date.now(),
      });
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Ein Fehler ist aufgetreten"
      );
      // Reset Turnstile on error
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  };

  if (status === "success") {
    return (
      <div className={`card-surface rounded-xl p-8 text-center ${className}`}>
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-foreground mb-2">
          Nachricht gesendet!
        </h3>
        <p className="text-muted-foreground mb-6">{successMessage}</p>
        <button
          onClick={() => setStatus("idle")}
          className="px-6 py-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Weitere Nachricht senden
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-5 ${className}`}>
      {/* Honeypot field - hidden from users, visible to bots */}
      <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder={placeholders.name}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-2"
          >
            E-Mail <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder={placeholders.email}
          />
        </div>
      </div>

      {variant === "default" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Telefon
            </label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={placeholders.phone}
            />
          </div>
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Firma
            </label>
            <Input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder={placeholders.company}
            />
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Betreff <span className="text-red-500">*</span>
        </label>
        <Select
          value={formData.subject}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, subject: value }))
          }
          required
        >
          <SelectTrigger className="w-full bg-card border-border">
            <SelectValue placeholder="Bitte auswählen" />
          </SelectTrigger>
          <SelectContent>
            {subjectOptions
              .filter((option) => option.value !== "")
              .map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Nachricht <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={variant === "compact" ? 4 : 6}
          placeholder={placeholders.message}
        />
      </div>

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

      {status === "error" && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting" || (!!TURNSTILE_SITE_KEY && !turnstileToken)}
        className="w-full px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Wird gesendet...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            {submitButtonText}
          </>
        )}
      </button>

      <p className="text-xs text-muted-foreground text-center">
        {privacyText.includes("Datenschutzerklärung") ? (
          <>
            {privacyText.split("Datenschutzerklärung")[0]}
            <a href="/datenschutz" className="text-primary hover:underline">
              Datenschutzerklärung
            </a>
            {privacyText.split("Datenschutzerklärung")[1]}
          </>
        ) : (
          <>
            {privacyText}{" "}
            <a href="/datenschutz" className="text-primary hover:underline">
              Datenschutzerklärung
            </a>
          </>
        )}
      </p>
    </form>
  );
}
