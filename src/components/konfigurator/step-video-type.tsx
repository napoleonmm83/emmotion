"use client";

import { Film, Users, Package, Smartphone, Calendar, type LucideIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { VideoType, VIDEO_TYPES } from "@/lib/konfigurator-logic";

const ICONS: Record<string, LucideIcon> = {
  Film,
  Users,
  Package,
  Smartphone,
  Calendar,
};

interface StepVideoTypeProps {
  value: VideoType;
  onChange: (value: VideoType) => void;
}

export function StepVideoType({ value, onChange }: StepVideoTypeProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(newValue) => onChange(newValue as VideoType)}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {(Object.entries(VIDEO_TYPES) as [VideoType, typeof VIDEO_TYPES[VideoType]][]).map(
        ([type, info]) => {
          const Icon = ICONS[info.icon] || Film;
          const isSelected = value === type;

          return (
            <label
              key={type}
              className={`p-5 rounded-xl border-2 text-left transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 bg-card"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-lg transition-colors ${
                    isSelected ? "bg-primary/10" : "bg-muted"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isSelected ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1 text-foreground">
                    {info.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {info.description}
                  </p>
                </div>
                <RadioGroupItem
                  value={type}
                  className={`w-5 h-5 border-2 ${
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-muted-foreground/30"
                  }`}
                />
              </div>
            </label>
          );
        }
      )}
    </RadioGroup>
  );
}
