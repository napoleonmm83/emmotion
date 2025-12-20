"use client";

import { Plane, Music, Subtitles, LayoutGrid, Zap } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
        Wähle optionale Zusatzleistungen für dein Video.
      </p>

      {(Object.entries(EXTRAS_INFO) as [keyof KonfiguratorExtras, typeof EXTRAS_INFO[keyof KonfiguratorExtras]][]).map(
        ([key, info]) => {
          const Icon = ICONS[key];
          const isSelected = extras[key];

          return (
            <label
              key={key}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 cursor-pointer block ${
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

                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleExtra(key)}
                  className="w-6 h-6 rounded-md border-2"
                />
              </div>
            </label>
          );
        }
      )}
    </div>
  );
}
