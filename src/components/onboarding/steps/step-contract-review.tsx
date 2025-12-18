"use client";

import { Check, FileText, AlertTriangle, CreditCard, Calendar } from "lucide-react";
import type { OnboardingFormData, PricingResult } from "@/lib/onboarding-logic";
import { SERVICE_LABELS, formatPrice, formatDate } from "@/lib/onboarding-logic";

interface ContractTemplate {
  _id: string;
  version: string;
  companyInfo?: {
    name: string;
    owner: string;
    address: string;
    email: string;
    phone: string;
    uid?: string;
    bank?: {
      name: string;
      iban: string;
      bic?: string;
    };
  };
  clauses?: {
    preamble?: string;
    scopeOfWork?: string;
    deposit?: string;
    cancellation?: string;
    clientObligations?: string;
    forceMajeure?: string;
    scopeChanges?: string;
    paymentTerms?: string;
    liability?: string;
    usageRights?: string;
    jurisdiction?: string;
  };
  cancellationDays?: number;
}

interface StepContractReviewProps {
  formData: OnboardingFormData;
  pricing: PricingResult;
  contractTemplate: ContractTemplate | null;
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
}

// Default contract clauses if no template from CMS
const DEFAULT_CLAUSES = {
  preamble: `Dieser Vertrag regelt die Zusammenarbeit zwischen dem Auftraggeber und emmotion.ch für die Erstellung von Videoinhalten.`,
  scopeOfWork: `Der Auftragnehmer erstellt das vereinbarte Video gemäss den in diesem Onboarding erfassten Spezifikationen. Änderungen am Leistungsumfang bedürfen der schriftlichen Vereinbarung und können zu Mehrkosten führen.`,
  deposit: `Die Anzahlung ist innerhalb von 7 Tagen nach Vertragsunterzeichnung fällig. Die Produktion beginnt erst nach Eingang der Anzahlung.`,
  cancellation: `Bei Stornierung bis 14 Tage vor dem vereinbarten Drehtermin wird die Anzahlung abzüglich einer Bearbeitungsgebühr von CHF 200 erstattet. Bei Stornierung innerhalb von 14 Tagen vor dem Drehtermin verfällt die Anzahlung. Bei Stornierung am Drehtag oder danach ist die volle Vergütung geschuldet.`,
  clientObligations: `Der Auftraggeber stellt alle für die Produktion notwendigen Zugänge, Personen und Materialien termingerecht zur Verfügung. Bei Verzögerungen oder Ausfall durch den Auftraggeber (z.B. Nichterscheinen am Drehtag, fehlende Locations, technische Probleme auf Kundenseite) ist die volle Tagesgage fällig.`,
  forceMajeure: `Bei höherer Gewalt (Naturkatastrophen, behördliche Massnahmen, Pandemie etc.) sind beide Parteien von ihren Verpflichtungen befreit. Bereits erbrachte Leistungen werden vergütet.`,
  paymentTerms: `Die Restzahlung ist innerhalb von 14 Tagen nach Lieferung des fertigen Videos fällig. Bei Zahlungsverzug werden Verzugszinsen von 5% p.a. berechnet.`,
  liability: `Die Haftung des Auftragnehmers ist auf den Auftragswert begrenzt. Für indirekte Schäden, entgangenen Gewinn oder Folgeschäden wird keine Haftung übernommen.`,
  usageRights: `Nach vollständiger Bezahlung erhält der Auftraggeber die uneingeschränkten Nutzungsrechte am erstellten Video für alle Medien und Zwecke. Der Auftragnehmer behält das Recht, das Video zu Referenzzwecken zu verwenden.`,
  jurisdiction: `Es gilt Schweizer Recht. Gerichtsstand ist der Sitz des Auftragnehmers.`,
};

export function StepContractReview({
  formData,
  pricing,
  contractTemplate,
  termsAccepted,
  onTermsChange,
}: StepContractReviewProps) {
  const clauses = contractTemplate?.clauses || DEFAULT_CLAUSES;
  const companyInfo = contractTemplate?.companyInfo || {
    name: "emmotion.ch",
    owner: "Marcus",
    address: "Rheintal, Schweiz",
    email: "hallo@emmotion.ch",
    phone: "",
  };
  const cancellationDays = contractTemplate?.cancellationDays || 14;

  return (
    <div className="space-y-6">
      {/* Pricing Summary */}
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
          <CreditCard className="w-5 h-5 text-primary" />
          Preisübersicht
        </h3>
        <div className="space-y-2 text-sm">
          {pricing.breakdown.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-muted-foreground">{item.item}</span>
              <span className="text-foreground">{formatPrice(item.price)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span className="text-foreground">Gesamtpreis</span>
              <span className="text-primary">{formatPrice(pricing.totalPrice)}</span>
            </div>
          </div>
          <div className="border-t border-border pt-2 mt-2 space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Anzahlung ({pricing.depositPercentage}%)
              </span>
              <span className="text-foreground font-medium">
                {formatPrice(pricing.depositAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Restzahlung nach Lieferung</span>
              <span className="text-foreground">{formatPrice(pricing.remainingAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Summary */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5" />
          Projektübersicht
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Service:</span>
            <p className="text-foreground">{SERVICE_LABELS[formData.serviceType]}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Projektname:</span>
            <p className="text-foreground">{formData.projectDetails.projectName || "-"}</p>
          </div>
          {formData.projectDetails.shootingDate && (
            <div>
              <span className="text-muted-foreground">Drehtermin:</span>
              <p className="text-foreground">
                {formatDate(formData.projectDetails.shootingDate)}
              </p>
            </div>
          )}
          <div>
            <span className="text-muted-foreground">Geschätzte Lieferzeit:</span>
            <p className="text-foreground">{pricing.estimatedDays} Arbeitstage</p>
          </div>
        </div>
      </div>

      {/* Contract Clauses */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-muted/30 px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Vertragsbedingungen
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Version {contractTemplate?.version || "1.0"}
          </p>
        </div>

        <div className="p-4 max-h-[300px] overflow-y-auto text-sm space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-1">Präambel</h4>
            <p className="text-muted-foreground">{clauses.preamble}</p>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-1">§1 Leistungsumfang</h4>
            <p className="text-muted-foreground">{clauses.scopeOfWork}</p>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-1">§2 Anzahlung</h4>
            <p className="text-muted-foreground">{clauses.deposit}</p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
            <h4 className="font-medium text-foreground mb-1 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              §3 Stornierung
            </h4>
            <p className="text-muted-foreground">{clauses.cancellation}</p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
            <h4 className="font-medium text-foreground mb-1 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              §4 Mitwirkungspflichten des Auftraggebers
            </h4>
            <p className="text-muted-foreground">{clauses.clientObligations}</p>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-1">§5 Höhere Gewalt</h4>
            <p className="text-muted-foreground">{clauses.forceMajeure}</p>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-1">§6 Zahlungsbedingungen</h4>
            <p className="text-muted-foreground">{clauses.paymentTerms}</p>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-1">§7 Haftung</h4>
            <p className="text-muted-foreground">{clauses.liability}</p>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-1">§8 Nutzungsrechte</h4>
            <p className="text-muted-foreground">{clauses.usageRights}</p>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-1">§9 Gerichtsstand</h4>
            <p className="text-muted-foreground">{clauses.jurisdiction}</p>
          </div>
        </div>
      </div>

      {/* Accept Terms */}
      <button
        type="button"
        onClick={() => onTermsChange(!termsAccepted)}
        className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg border-2 text-left transition-all ${
          termsAccepted
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
      >
        <div
          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
            termsAccepted
              ? "border-primary bg-primary"
              : "border-muted-foreground/30"
          }`}
        >
          {termsAccepted && <Check className="w-4 h-4 text-white" />}
        </div>
        <span className="text-foreground">
          Ich habe die Vertragsbedingungen gelesen und akzeptiere diese.
        </span>
      </button>

      {/* Important Notes */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Wichtige Hinweise
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • Stornierung bis {cancellationDays} Tage vor Drehtermin: Anzahlung abzgl. CHF 200
          </li>
          <li>• Stornierung innerhalb {cancellationDays} Tagen: Anzahlung verfällt</li>
          <li>• Nichterscheinen am Drehtag: Volle Vergütung</li>
          <li>• Anzahlung fällig innerhalb 7 Tagen nach Unterschrift</li>
        </ul>
      </div>
    </div>
  );
}
