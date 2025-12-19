"use client";

import { Calendar, MapPin, Wallet, FileText } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import type { ProjectDetails, BudgetRange } from "@/lib/onboarding-logic";
import { BUDGET_LABELS } from "@/lib/onboarding-logic";

interface StepProjectDetailsProps {
  projectDetails: ProjectDetails;
  onChange: (details: ProjectDetails) => void;
  errors?: string[];
}

export function StepProjectDetails({ projectDetails, onChange, errors = [] }: StepProjectDetailsProps) {
  const updateField = <K extends keyof ProjectDetails>(
    field: K,
    value: ProjectDetails[K]
  ) => {
    onChange({ ...projectDetails, [field]: value });
  };

  const hasError = (field: string) => errors.includes(field);
  const inputErrorClass = (field: string) =>
    hasError(field)
      ? "border-destructive focus:ring-destructive/50"
      : "border-border focus:ring-primary/50";

  return (
    <div className="space-y-6">
      {/* Project Name */}
      <div id="field-projectName">
        <label className={`block text-sm font-medium mb-2 ${hasError("projectName") ? "text-destructive" : "text-foreground"}`}>
          <FileText className="w-4 h-4 inline-block mr-2" />
          Projektname *
        </label>
        <input
          type="text"
          value={projectDetails.projectName}
          onChange={(e) => updateField("projectName", e.target.value)}
          placeholder="z.B. Imagefilm für Website, Eventdokumentation Firmenjubiläum"
          className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${inputErrorClass("projectName")}`}
        />
      </div>

      {/* Description */}
      <div id="field-description">
        <label className={`block text-sm font-medium mb-2 ${hasError("description") ? "text-destructive" : "text-foreground"}`}>
          Projektbeschreibung *
        </label>
        <textarea
          value={projectDetails.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Beschreiben Sie kurz, was Sie sich vorstellen. Was soll das Video zeigen? Welche Botschaft soll vermittelt werden?"
          rows={4}
          className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 resize-none ${inputErrorClass("description")}`}
        />
      </div>

      {/* Date Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            <Calendar className="w-4 h-4 inline-block mr-2" />
            Gewünschter Drehtermin
          </label>
          <DatePicker
            value={projectDetails.shootingDate}
            onChange={(date) =>
              updateField("shootingDate", date?.toISOString().split("T")[0])
            }
            placeholder="Optional - klären wir gemeinsam"
            minDate={new Date()}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Optional – den genauen Termin stimmen wir persönlich ab
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            <Calendar className="w-4 h-4 inline-block mr-2" />
            Wunsch-Deadline
          </label>
          <DatePicker
            value={projectDetails.deadline}
            onChange={(date) =>
              updateField("deadline", date?.toISOString().split("T")[0])
            }
            placeholder="Optional"
            minDate={new Date()}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Unverbindlicher Richtwert für die Planung
          </p>
        </div>
      </div>

      {/* Budget */}
      <div id="field-budget">
        <label className={`block text-sm font-medium mb-3 ${hasError("budget") ? "text-destructive" : "text-foreground"}`}>
          <Wallet className="w-4 h-4 inline-block mr-2" />
          Budget-Rahmen *
        </label>
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${hasError("budget") ? "p-2 -m-2 rounded-lg ring-2 ring-destructive/50" : ""}`}>
          {(Object.entries(BUDGET_LABELS) as [BudgetRange, string][]).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => updateField("budget", value)}
              className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                projectDetails.budget === value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50 text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Locations */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          <MapPin className="w-4 h-4 inline-block mr-2" />
          Drehorte
        </label>
        <input
          type="text"
          value={projectDetails.locations?.join(", ") || ""}
          onChange={(e) =>
            updateField(
              "locations",
              e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
            )
          }
          placeholder="z.B. Firmensitz Vaduz, Produktionshalle, Outdoor"
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Mehrere Orte mit Komma trennen
        </p>
      </div>
    </div>
  );
}
