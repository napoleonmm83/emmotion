"use client";

import { useState, useEffect, useRef } from "react";
import { track } from "@vercel/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { StepVideoType } from "./step-video-type";
import { StepOptions } from "./step-options";
import { StepExtras } from "./step-extras";
import { StepResult } from "./step-result";
import {
  KonfiguratorInput,
  DEFAULT_KONFIGURATOR_INPUT,
  calculatePrice,
} from "@/lib/konfigurator-logic";
import { Card } from "@/components/ui/card";

const STEPS = [
  { id: 1, title: "Video-Typ", description: "Was möchtest du produzieren?" },
  { id: 2, title: "Details", description: "Dauer und Umfang" },
  { id: 3, title: "Extras", description: "Zusätzliche Optionen" },
  { id: 4, title: "Ergebnis", description: "Deine Preisübersicht" },
];

export function Konfigurator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<KonfiguratorInput>(DEFAULT_KONFIGURATOR_INPUT);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const priceResult = calculatePrice(formData);
  const hasTrackedStart = useRef(false);

  // Track konfigurator start
  useEffect(() => {
    if (!hasTrackedStart.current) {
      track("konfigurator_start");
      hasTrackedStart.current = true;
    }
  }, []);

  // Track step changes and result viewing
  useEffect(() => {
    if (currentStep > 1) {
      track("konfigurator_step", {
        step: currentStep,
        stepName: STEPS[currentStep - 1].title,
        videoType: formData.videoType,
      });
    }
    // Track when result step is reached
    if (currentStep === 4) {
      track("konfigurator_result", {
        videoType: formData.videoType,
        duration: formData.duration,
        complexity: formData.complexity,
        totalPrice: priceResult.totalPrice,
      });
    }
  }, [currentStep, formData.videoType, formData.duration, formData.complexity, priceResult.totalPrice]);

  const updateFormData = (updates: Partial<KonfiguratorInput>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Bei Video-Typ-Änderung alle Folgeschritte zurücksetzen
  const handleVideoTypeChange = (videoType: KonfiguratorInput["videoType"]) => {
    setFormData({
      ...DEFAULT_KONFIGURATOR_INPUT,
      videoType,
    });
  };

  const nextStep = () => {
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
    if (step >= 1 && step <= STEPS.length) {
      setDirection(step > currentStep ? 1 : -1);
      setCurrentStep(step);
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8 md:mb-12">
        {/* Kreise und Linien */}
        <div className="flex items-center justify-center">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => goToStep(step.id)}
                className={`flex-shrink-0 ${
                  step.id <= currentStep ? "cursor-pointer" : "cursor-default"
                }`}
                disabled={step.id > currentStep}
              >
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-medium text-sm md:text-base transition-all duration-300 ${
                    step.id < currentStep
                      ? "bg-primary text-primary-foreground"
                      : step.id === currentStep
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
              </button>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-12 md:w-20 lg:w-28 h-1 mx-2 md:mx-3 rounded transition-colors duration-300 ${
                    step.id < currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        {/* Labels */}
        <div className="hidden md:flex items-center justify-center mt-3">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <span
                className={`w-10 md:w-12 text-center text-xs md:text-sm font-medium transition-colors ${
                  step.id === currentStep
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
              {index < STEPS.length - 1 && (
                <div className="w-12 md:w-20 lg:w-28 mx-2 md:mx-3" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-6 md:p-8 min-h-[400px] relative">
        {/* Step Header */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">
            {STEPS[currentStep - 1].title}
          </h2>
          <p className="text-muted-foreground mt-1">
            {STEPS[currentStep - 1].description}
          </p>
        </div>

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
              <StepVideoType
                value={formData.videoType}
                onChange={handleVideoTypeChange}
              />
            )}
            {currentStep === 2 && (
              <StepOptions
                duration={formData.duration}
                complexity={formData.complexity}
                onDurationChange={(duration) => updateFormData({ duration })}
                onComplexityChange={(complexity) => updateFormData({ complexity })}
              />
            )}
            {currentStep === 3 && (
              <StepExtras
                extras={formData.extras}
                onChange={(extras) => updateFormData({ extras })}
              />
            )}
            {currentStep === 4 && (
              <StepResult formData={formData} priceResult={priceResult} />
            )}
          </motion.div>
        </AnimatePresence>
      </Card>

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

        {/* Live Price Preview (except on result step) */}
        {currentStep < 4 && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Geschätzter Preis</p>
            <p className="text-xl md:text-2xl font-bold text-primary">
              CHF {priceResult.totalPrice.toLocaleString("de-CH")}
            </p>
          </div>
        )}

        {currentStep < 4 ? (
          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Weiter
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div /> // Placeholder to maintain layout
        )}
      </div>
    </div>
  );
}
