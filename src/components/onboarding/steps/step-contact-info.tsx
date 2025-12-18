"use client";

import { User, Building2, Mail, Phone, MapPin } from "lucide-react";
import type { ClientInfo } from "@/lib/onboarding-logic";

interface StepContactInfoProps {
  clientInfo: ClientInfo;
  onChange: (info: ClientInfo) => void;
  errors?: string[];
}

export function StepContactInfo({ clientInfo, onChange, errors = [] }: StepContactInfoProps) {
  const updateField = <K extends keyof ClientInfo>(
    field: K,
    value: ClientInfo[K]
  ) => {
    onChange({ ...clientInfo, [field]: value });
  };

  const hasError = (field: string) => errors.includes(field);
  const inputErrorClass = (field: string) =>
    hasError(field)
      ? "border-destructive focus:ring-destructive/50"
      : "border-border focus:ring-primary/50";

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground mb-4">
        Bitte geben Sie Ihre Kontaktdaten für den Vertrag an.
      </p>

      {/* Name & Company */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${hasError("name") ? "text-destructive" : "text-foreground"}`}>
            <User className="w-4 h-4 inline-block mr-2" />
            Name *
          </label>
          <input
            type="text"
            value={clientInfo.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Vor- und Nachname"
            className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${inputErrorClass("name")}`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <Building2 className="w-4 h-4 inline-block mr-2" />
            Firma
          </label>
          <input
            type="text"
            value={clientInfo.company || ""}
            onChange={(e) => updateField("company", e.target.value)}
            placeholder="Firmenname (optional)"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${hasError("email") ? "text-destructive" : "text-foreground"}`}>
            <Mail className="w-4 h-4 inline-block mr-2" />
            E-Mail *
          </label>
          <input
            type="email"
            value={clientInfo.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="ihre@email.ch"
            className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${inputErrorClass("email")}`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${hasError("phone") ? "text-destructive" : "text-foreground"}`}>
            <Phone className="w-4 h-4 inline-block mr-2" />
            Telefon *
          </label>
          <input
            type="tel"
            value={clientInfo.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+41 79 123 45 67"
            className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${inputErrorClass("phone")}`}
          />
        </div>
      </div>

      {/* Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${hasError("street") ? "text-destructive" : "text-foreground"}`}>
            <MapPin className="w-4 h-4 inline-block mr-2" />
            Strasse / Nr. *
          </label>
          <input
            type="text"
            value={clientInfo.street || ""}
            onChange={(e) => updateField("street", e.target.value)}
            placeholder="Musterstrasse 123"
            className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${inputErrorClass("street")}`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${hasError("zipCity") ? "text-destructive" : "text-foreground"}`}>
            PLZ / Ort *
          </label>
          <input
            type="text"
            value={clientInfo.zipCity || ""}
            onChange={(e) => updateField("zipCity", e.target.value)}
            placeholder="9490 Vaduz"
            className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${inputErrorClass("zipCity")}`}
          />
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 mt-6">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Datenschutz:</strong> Ihre Daten werden
          ausschliesslich zur Vertragsabwicklung verwendet und nicht an Dritte
          weitergegeben.
        </p>
      </div>
    </div>
  );
}
