"use client";

import { Check, Clock, Layers, HelpCircle } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import type { Duration, Complexity } from "@/lib/onboarding-logic";

interface Question {
  id: string;
  question: string;
  type: "text" | "textarea" | "select" | "multiselect" | "number" | "date" | "checkbox";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
  conditionalOn?: {
    questionId: string;
    value: string;
  };
}

interface Questionnaire {
  _id: string;
  serviceSlug: string;
  title?: string;
  description?: string;
  questions?: Question[];
}

interface StepServiceQuestionsProps {
  questionnaire: Questionnaire | null;
  serviceData: Record<string, unknown>;
  onChange: (updates: Record<string, unknown>) => void;
  errors?: string[];
}

const DURATION_OPTIONS: { value: Duration; label: string; description: string }[] = [
  { value: "short", label: "Kurz (bis 1 Min)", description: "Social Clips, Teaser" },
  { value: "medium", label: "Mittel (1-2 Min)", description: "Standard Imagefilm" },
  { value: "long", label: "Lang (2-4 Min)", description: "Ausführliche Doku" },
];

const COMPLEXITY_OPTIONS: { value: Complexity; label: string; description: string }[] = [
  { value: "simple", label: "Einfach", description: "1 Drehtag, wenig Schnitt" },
  { value: "standard", label: "Standard", description: "1-2 Drehtage, professionelle Nachbearbeitung" },
  { value: "premium", label: "Premium", description: "Mehrere Drehtage, aufwändige Postproduktion" },
];

export function StepServiceQuestions({
  questionnaire,
  serviceData,
  onChange,
  errors = [],
}: StepServiceQuestionsProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ [field]: value });
  };

  const hasError = (field: string) => errors.includes(field);

  // Check if a conditional question should be shown
  const shouldShowQuestion = (question: Question): boolean => {
    if (!question.conditionalOn) return true;
    const dependentValue = serviceData[question.conditionalOn.questionId];
    return dependentValue === question.conditionalOn.value;
  };

  const renderQuestion = (question: Question) => {
    if (!shouldShowQuestion(question)) return null;

    const value = serviceData[question.id];

    switch (question.type) {
      case "text":
        return (
          <div key={question.id}>
            <label className="block text-sm font-medium text-foreground mb-2">
              {question.question}
              {question.required && " *"}
            </label>
            <input
              type="text"
              value={(value as string) || ""}
              onChange={(e) => updateField(question.id, e.target.value)}
              placeholder={question.placeholder}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {question.helpText && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                {question.helpText}
              </p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div key={question.id}>
            <label className="block text-sm font-medium text-foreground mb-2">
              {question.question}
              {question.required && " *"}
            </label>
            <textarea
              value={(value as string) || ""}
              onChange={(e) => updateField(question.id, e.target.value)}
              placeholder={question.placeholder}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
            {question.helpText && (
              <p className="text-xs text-muted-foreground mt-1">{question.helpText}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={question.id}>
            <label className="block text-sm font-medium text-foreground mb-2">
              {question.question}
              {question.required && " *"}
            </label>
            <select
              value={(value as string) || ""}
              onChange={(e) => updateField(question.id, e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">{question.placeholder || "Bitte wählen..."}</option>
              {question.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {question.helpText && (
              <p className="text-xs text-muted-foreground mt-1">{question.helpText}</p>
            )}
          </div>
        );

      case "multiselect":
        const selectedValues = (value as string[]) || [];
        return (
          <div key={question.id}>
            <label className="block text-sm font-medium text-foreground mb-2">
              {question.question}
              {question.required && " *"}
            </label>
            <div className="space-y-2">
              {question.options?.map((option) => {
                const isSelected = selectedValues.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      const newValues = isSelected
                        ? selectedValues.filter((v) => v !== option)
                        : [...selectedValues, option];
                      updateField(question.id, newValues);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-foreground">{option}</span>
                  </button>
                );
              })}
            </div>
            {question.helpText && (
              <p className="text-xs text-muted-foreground mt-1">{question.helpText}</p>
            )}
          </div>
        );

      case "number":
        return (
          <div key={question.id}>
            <label className="block text-sm font-medium text-foreground mb-2">
              {question.question}
              {question.required && " *"}
            </label>
            <input
              type="number"
              value={(value as number) || ""}
              onChange={(e) => updateField(question.id, parseInt(e.target.value) || 0)}
              placeholder={question.placeholder}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {question.helpText && (
              <p className="text-xs text-muted-foreground mt-1">{question.helpText}</p>
            )}
          </div>
        );

      case "date":
        return (
          <div key={question.id}>
            <label className="block text-sm font-medium text-foreground mb-2">
              {question.question}
              {question.required && " *"}
            </label>
            <DatePicker
              value={value as string | undefined}
              onChange={(date) =>
                updateField(question.id, date?.toISOString().split("T")[0])
              }
              placeholder={question.placeholder || "Datum wählen"}
            />
            {question.helpText && (
              <p className="text-xs text-muted-foreground mt-1">{question.helpText}</p>
            )}
          </div>
        );

      case "checkbox":
        const isChecked = Boolean(value);
        return (
          <div key={question.id}>
            <button
              type="button"
              onClick={() => updateField(question.id, !isChecked)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-left transition-all ${
                isChecked
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  isChecked
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                }`}
              >
                {isChecked && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-foreground">{question.question}</span>
            </button>
            {question.helpText && (
              <p className="text-xs text-muted-foreground mt-1 ml-8">{question.helpText}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Always show Duration & Complexity */}
      <div id="field-duration">
        <label className={`block text-sm font-medium mb-3 ${hasError("duration") ? "text-destructive" : "text-foreground"}`}>
          <Clock className="w-4 h-4 inline-block mr-2" />
          Gewünschte Videolänge *
        </label>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${hasError("duration") ? "p-2 -m-2 rounded-lg ring-2 ring-destructive/50" : ""}`}>
          {DURATION_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField("duration", option.value)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                serviceData.duration === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="font-medium text-foreground">{option.label}</div>
              <div className="text-sm text-muted-foreground">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div id="field-complexity">
        <label className={`block text-sm font-medium mb-3 ${hasError("complexity") ? "text-destructive" : "text-foreground"}`}>
          <Layers className="w-4 h-4 inline-block mr-2" />
          Produktionsumfang *
        </label>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${hasError("complexity") ? "p-2 -m-2 rounded-lg ring-2 ring-destructive/50" : ""}`}>
          {COMPLEXITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField("complexity", option.value)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                serviceData.complexity === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="font-medium text-foreground">{option.label}</div>
              <div className="text-sm text-muted-foreground">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* CMS Questions */}
      {questionnaire?.description && (
        <p className="text-muted-foreground border-t border-border pt-6">
          {questionnaire.description}
        </p>
      )}

      {questionnaire?.questions?.map(renderQuestion)}

      {/* Fallback if no CMS questionnaire */}
      {!questionnaire?.questions?.length && (
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Haben Sie spezifische Wünsche oder Anforderungen? Teilen Sie uns diese
            gerne im nächsten Schritt mit.
          </p>
        </div>
      )}
    </div>
  );
}
