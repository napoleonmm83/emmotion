"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, AlertCircle } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/shared";
import { StepProjectDetails } from "@/components/onboarding/steps/step-project-details";
import { StepServiceQuestions } from "@/components/onboarding/steps/step-service-questions";
import { StepExtras } from "@/components/onboarding/steps/step-extras";
import { StepContactInfo } from "@/components/onboarding/steps/step-contact-info";
import { StepContractReview } from "@/components/onboarding/steps/step-contract-review";
import { StepSignature } from "@/components/onboarding/steps/step-signature";
import {
  type ServiceType,
  type OnboardingFormData,
  type PricingResult,
  DEFAULT_ONBOARDING_DATA,
  calculatePricing,
  formatPrice,
  SERVICE_LABELS,
  type Complexity,
  type Duration,
} from "@/lib/onboarding-logic";

// Validation error messages (German)
const FIELD_LABELS: Record<string, string> = {
  projectName: "Projektname",
  description: "Projektbeschreibung",
  shootingDate: "Drehtermin",
  deadline: "Deadline",
  budget: "Budget",
  duration: "Videolänge",
  complexity: "Produktionsumfang",
  name: "Name",
  email: "E-Mail",
  phone: "Telefon",
  street: "Strasse",
  zipCity: "PLZ / Ort",
};

// Types for Sanity data
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
  depositRules?: {
    minPercentage: number;
    maxPercentage: number;
    thresholds?: Array<{ upTo: number; percentage: number }>;
  };
  cancellationDays?: number;
}

interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  priceFrom?: number;
}

interface Settings {
  siteName?: string;
  contact?: { email?: string; phone?: string; street?: string; city?: string };
  social?: { instagram?: string; linkedin?: string; youtube?: string };
  footer?: { tagline?: string; ctaText?: string; copyrightName?: string };
}

interface OnboardingContentProps {
  serviceSlug: ServiceType;
  service: Service | null;
  questionnaire: Questionnaire | null;
  contractTemplate: ContractTemplate | null;
  settings: Settings | null;
}

const STEPS = [
  { id: 1, title: "Projekt", description: "Grundlegende Projektinformationen" },
  { id: 2, title: "Details", description: "Service-spezifische Fragen" },
  { id: 3, title: "Extras", description: "Zusatzleistungen wählen" },
  { id: 4, title: "Kontakt", description: "Ihre Kontaktdaten" },
  { id: 5, title: "Vertrag", description: "Vertrag prüfen" },
  { id: 6, title: "Signatur", description: "Digital unterschreiben" },
];

export function OnboardingContent({
  serviceSlug,
  service,
  questionnaire,
  contractTemplate,
  settings,
}: OnboardingContentProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OnboardingFormData>({
    ...DEFAULT_ONBOARDING_DATA,
    serviceType: serviceSlug,
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Calculate pricing based on form data
  const complexity: Complexity = (formData.serviceSpecificData.complexity as Complexity) || "standard";
  const duration: Duration = (formData.serviceSpecificData.duration as Duration) || "medium";
  const pricing: PricingResult = calculatePricing(serviceSlug, complexity, duration, formData.extras);

  const updateFormData = useCallback((updates: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setValidationErrors([]); // Clear errors when data changes
  }, []);

  const updateServiceData = useCallback((updates: Record<string, unknown>) => {
    setFormData((prev) => ({
      ...prev,
      serviceSpecificData: { ...prev.serviceSpecificData, ...updates },
    }));
    setValidationErrors([]); // Clear errors when data changes
  }, []);

  // Validation functions for each step
  const validateStep1 = (): string[] => {
    const errors: string[] = [];
    const { projectDetails } = formData;

    if (!projectDetails.projectName?.trim()) errors.push("projectName");
    if (!projectDetails.description?.trim()) errors.push("description");
    // shootingDate und deadline sind optional - werden direkt mit dem Kunden abgestimmt
    if (!projectDetails.budget) errors.push("budget");

    return errors;
  };

  const validateStep2 = (): string[] => {
    const errors: string[] = [];
    const { serviceSpecificData } = formData;

    if (!serviceSpecificData.duration) errors.push("duration");
    if (!serviceSpecificData.complexity) errors.push("complexity");

    return errors;
  };

  const validateStep4 = (): string[] => {
    const errors: string[] = [];
    const { clientInfo } = formData;

    if (!clientInfo.name?.trim()) errors.push("name");
    if (!clientInfo.email?.trim()) errors.push("email");
    if (!clientInfo.phone?.trim()) errors.push("phone");
    if (!clientInfo.street?.trim()) errors.push("street");
    if (!clientInfo.zipCity?.trim()) errors.push("zipCity");

    // Basic email validation
    if (clientInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientInfo.email)) {
      errors.push("email");
    }

    return errors;
  };

  const validateCurrentStep = (): string[] => {
    switch (currentStep) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 4:
        return validateStep4();
      default:
        return [];
    }
  };

  const nextStep = () => {
    const errors = validateCurrentStep();

    if (errors.length > 0) {
      setValidationErrors(errors);
      // Scroll to first error field on mobile
      setTimeout(() => {
        const firstErrorField = document.getElementById(`field-${errors[0]}`);
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return;
    }

    setValidationErrors([]);
    if (currentStep < STEPS.length) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= currentStep) {
      setDirection(step > currentStep ? 1 : -1);
      setCurrentStep(step);
    }
  };

  const handleSubmit = async (signatureDataUrl: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/projekt-anfrage/submit-signed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          pricing,
          signatureDataUrl,
          contractVersion: contractTemplate?.version || "1.0",
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      // Track successful submission
      track("onboarding_complete", {
        service: serviceSlug,
        totalPrice: pricing.totalPrice,
        extras: Object.entries(formData.extras)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(","),
      });

      // Redirect to confirmation page
      router.push("/projekt-anfrage/bestaetigung");
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const serviceLabel = SERVICE_LABELS[serviceSlug];

  // Track initial page load (step 1)
  useEffect(() => {
    track("onboarding_start", {
      service: serviceSlug,
      serviceLabel: serviceLabel,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track step changes
  useEffect(() => {
    if (currentStep > 1) {
      track("onboarding_step", {
        step: currentStep,
        stepName: STEPS[currentStep - 1].title,
        service: serviceSlug,
      });
    }
  }, [currentStep, serviceSlug]);

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <Container>
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display text-foreground mb-2">
              {serviceLabel} anfragen
            </h1>
            <p className="text-muted-foreground">
              {service?.shortDescription || `Konfigurieren Sie Ihr ${serviceLabel}-Projekt`}
            </p>
          </motion.div>

          <div className="w-full max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8 md:mb-12">
              <div className="flex items-center justify-center overflow-x-auto pb-2">
                {STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center flex-shrink-0">
                    <button
                      onClick={() => goToStep(step.id)}
                      className={`flex-shrink-0 ${
                        step.id <= currentStep ? "cursor-pointer" : "cursor-default"
                      }`}
                      disabled={step.id > currentStep}
                    >
                      <div
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-medium text-xs md:text-sm transition-all duration-300 ${
                          step.id < currentStep
                            ? "bg-primary text-primary-foreground"
                            : step.id === currentStep
                            ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step.id < currentStep ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          step.id
                        )}
                      </div>
                    </button>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`w-6 md:w-12 lg:w-16 h-1 mx-1 md:mx-2 rounded transition-colors duration-300 ${
                          step.id < currentStep ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              {/* Labels - Desktop only */}
              <div className="hidden lg:flex items-center justify-center mt-3">
                {STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <span
                      className={`w-10 text-center text-xs font-medium transition-colors ${
                        step.id === currentStep
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </span>
                    {index < STEPS.length - 1 && (
                      <div className="w-12 lg:w-16 mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="card-surface rounded-xl p-6 md:p-8 overflow-hidden min-h-[450px] relative">
              {/* Step Header */}
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                  {STEPS[currentStep - 1].title}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {STEPS[currentStep - 1].description}
                </p>
              </div>

              {/* Validation Error Messages */}
              {validationErrors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive mb-2">
                        Bitte füllen Sie folgende Pflichtfelder aus:
                      </p>
                      <ul className="list-disc list-inside text-sm text-destructive/80 space-y-1">
                        {validationErrors.map((field) => (
                          <li key={field}>{FIELD_LABELS[field] || field}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Animated Step Content */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {currentStep === 1 && (
                    <StepProjectDetails
                      projectDetails={formData.projectDetails}
                      onChange={(details) => updateFormData({ projectDetails: details })}
                      errors={validationErrors}
                    />
                  )}
                  {currentStep === 2 && (
                    <StepServiceQuestions
                      questionnaire={questionnaire}
                      serviceData={formData.serviceSpecificData}
                      onChange={updateServiceData}
                      errors={validationErrors}
                    />
                  )}
                  {currentStep === 3 && (
                    <StepExtras
                      extras={formData.extras}
                      serviceType={serviceSlug}
                      onChange={(extras) => updateFormData({ extras })}
                    />
                  )}
                  {currentStep === 4 && (
                    <StepContactInfo
                      clientInfo={formData.clientInfo}
                      onChange={(info) => updateFormData({ clientInfo: info })}
                      errors={validationErrors}
                    />
                  )}
                  {currentStep === 5 && (
                    <StepContractReview
                      formData={formData}
                      pricing={pricing}
                      contractTemplate={contractTemplate}
                      termsAccepted={formData.termsAccepted}
                      onTermsChange={(accepted) => updateFormData({ termsAccepted: accepted })}
                    />
                  )}
                  {currentStep === 6 && (
                    <StepSignature
                      formData={formData}
                      pricing={pricing}
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentStep === 1
                    ? "opacity-0 pointer-events-none"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Zurück
              </button>

              {/* Live Price Preview */}
              {currentStep < 5 && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Geschätzter Preis</p>
                  <p className="text-xl md:text-2xl font-bold text-primary">
                    {formatPrice(pricing.totalPrice)}
                  </p>
                </div>
              )}

              {currentStep < 5 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Weiter
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : currentStep === 5 ? (
                <button
                  onClick={nextStep}
                  disabled={!formData.termsAccepted}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    formData.termsAccepted
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  Zur Unterschrift
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div /> // Placeholder for signature step (submit button is in StepSignature)
              )}
            </div>
          </div>
        </Container>
      </main>
      <Footer settings={settings} />
    </>
  );
}
