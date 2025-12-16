"use client";

import { Clock, Layers } from "lucide-react";
import {
  Duration,
  Complexity,
  DURATION_OPTIONS,
  COMPLEXITY_OPTIONS,
} from "@/lib/konfigurator-logic";

interface StepOptionsProps {
  duration: Duration;
  complexity: Complexity;
  onDurationChange: (value: Duration) => void;
  onComplexityChange: (value: Complexity) => void;
}

export function StepOptions({
  duration,
  complexity,
  onDurationChange,
  onComplexityChange,
}: StepOptionsProps) {
  return (
    <div className="space-y-8">
      {/* Dauer */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-foreground">Videolänge</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(Object.entries(DURATION_OPTIONS) as [Duration, typeof DURATION_OPTIONS[Duration]][]).map(
            ([key, option]) => {
              const isSelected = duration === key;
              return (
                <button
                  key={key}
                  onClick={() => onDurationChange(key)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{option.label}</h4>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Komplexität */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-foreground">Produktionsumfang</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(Object.entries(COMPLEXITY_OPTIONS) as [Complexity, typeof COMPLEXITY_OPTIONS[Complexity]][]).map(
            ([key, option]) => {
              const isSelected = complexity === key;
              return (
                <button
                  key={key}
                  onClick={() => onComplexityChange(key)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{option.label}</h4>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </button>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
