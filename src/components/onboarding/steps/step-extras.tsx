"use client";

import { Plane, Zap, LayoutGrid, Subtitles, Music, Check } from "lucide-react";
import type { Extras, ServiceType } from "@/lib/onboarding-logic";

interface StepExtrasProps {
  extras: Extras;
  serviceType: ServiceType;
  onChange: (extras: Extras) => void;
}

interface ExtraOption {
  key: keyof Extras;
  label: string;
  description: string;
  price: number;
  icon: typeof Plane;
  hideFor?: ServiceType[];
}

const EXTRAS_OPTIONS: ExtraOption[] = [
  {
    key: "drone",
    label: "Drohnenaufnahmen",
    description: "Spektakuläre Luftaufnahmen für einzigartige Perspektiven",
    price: 400,
    icon: Plane,
    hideFor: ["drohnenaufnahmen"], // Already included in drone service
  },
  {
    key: "expressDelivery",
    label: "Express-Lieferung",
    description: "Schnellere Bearbeitung und Lieferung des fertigen Videos",
    price: 500,
    icon: Zap,
  },
  {
    key: "socialCuts",
    label: "Social Media Schnitte",
    description: "Zusätzliche Kurzversionen für Instagram, LinkedIn, TikTok",
    price: 300,
    icon: LayoutGrid,
    hideFor: ["social-media"], // Already included
  },
  {
    key: "subtitles",
    label: "Untertitel",
    description: "Professionelle Untertitelung für bessere Reichweite",
    price: 200,
    icon: Subtitles,
  },
  {
    key: "music",
    label: "Premium Musik",
    description: "Hochwertige lizenzfreie Musik aus Premium-Bibliotheken",
    price: 150,
    icon: Music,
  },
];

export function StepExtras({ extras, serviceType, onChange }: StepExtrasProps) {
  const toggleExtra = (key: keyof Extras) => {
    onChange({ ...extras, [key]: !extras[key] });
  };

  // Filter out extras that are already included in the service
  const availableExtras = EXTRAS_OPTIONS.filter(
    (option) => !option.hideFor?.includes(serviceType)
  );

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        Wähle optionale Zusatzleistungen für dein Projekt.
      </p>

      {availableExtras.map((option) => {
        const Icon = option.icon;
        const isSelected = extras[option.key];

        return (
          <button
            key={option.key}
            onClick={() => toggleExtra(option.key)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 bg-card"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2.5 rounded-lg transition-colors ${
                  isSelected ? "bg-primary/10" : "bg-muted"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isSelected ? "text-primary" : "text-muted-foreground"
                  }`}
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground">{option.label}</h4>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {option.description}
                </p>
              </div>

              <div className="text-right">
                <p
                  className={`font-semibold ${
                    isSelected ? "text-primary" : "text-foreground"
                  }`}
                >
                  + CHF {option.price}
                </p>
              </div>

              <div
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                }`}
              >
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
          </button>
        );
      })}

      {availableExtras.length === 0 && (
        <p className="text-muted-foreground text-center py-8">
          Alle Extras sind bereits in diesem Service enthalten.
        </p>
      )}
    </div>
  );
}
