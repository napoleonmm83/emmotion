"use client";

import { Plane, Music, Subtitles, LayoutGrid, Zap, Check } from "lucide-react";
import { KonfiguratorExtras, EXTRAS_INFO } from "@/lib/konfigurator-logic";

const ICONS: Record<keyof KonfiguratorExtras, typeof Plane> = {
  drone: Plane,
  music: Music,
  subtitles: Subtitles,
  socialCuts: LayoutGrid,
  expressDelivery: Zap,
};

interface StepExtrasProps {
  extras: KonfiguratorExtras;
  onChange: (extras: KonfiguratorExtras) => void;
}

export function StepExtras({ extras, onChange }: StepExtrasProps) {
  const toggleExtra = (key: keyof KonfiguratorExtras) => {
    onChange({ ...extras, [key]: !extras[key] });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        Wählen Sie optionale Zusatzleistungen für Ihr Video.
      </p>

      {(Object.entries(EXTRAS_INFO) as [keyof KonfiguratorExtras, typeof EXTRAS_INFO[keyof KonfiguratorExtras]][]).map(
        ([key, info]) => {
          const Icon = ICONS[key];
          const isSelected = extras[key];

          return (
            <button
              key={key}
              onClick={() => toggleExtra(key)}
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
                    <h4 className="font-medium text-foreground">{info.label}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {info.description}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      isSelected ? "text-primary" : "text-foreground"
                    }`}
                  >
                    + CHF {info.price}
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
        }
      )}
    </div>
  );
}
