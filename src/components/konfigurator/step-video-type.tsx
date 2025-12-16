"use client";

import { Film, Users, Package, Smartphone, Calendar, type LucideIcon } from "lucide-react";
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {(Object.entries(VIDEO_TYPES) as [VideoType, typeof VIDEO_TYPES[VideoType]][]).map(
        ([type, info]) => {
          const Icon = ICONS[info.icon] || Film;
          const isSelected = value === type;

          return (
            <button
              key={type}
              onClick={() => onChange(type)}
              className={`p-5 rounded-xl border-2 text-left transition-all duration-300 ${
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
                  <h3
                    className={`font-medium mb-1 ${
                      isSelected ? "text-foreground" : "text-foreground"
                    }`}
                  >
                    {info.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {info.description}
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </button>
          );
        }
      )}
    </div>
  );
}
