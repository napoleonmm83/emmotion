"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Trash2, Send, CheckCircle2 } from "lucide-react";
import type { OnboardingFormData, PricingResult } from "@/lib/onboarding-logic";
import { SERVICE_LABELS, formatPrice } from "@/lib/onboarding-logic";

interface StepSignatureProps {
  formData: OnboardingFormData;
  pricing: PricingResult;
  onSubmit: (signatureDataUrl: string) => void;
  isSubmitting: boolean;
}

export function StepSignature({
  formData,
  pricing,
  onSubmit,
  isSubmitting,
}: StepSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Set drawing style
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const pos = getPos(e);
      setIsDrawing(true);
      setLastPos(pos);
    },
    [getPos]
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;

      const pos = getPos(e);

      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      setLastPos(pos);
      setHasSignature(true);
    },
    [isDrawing, lastPos, getPos]
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  }, []);

  const handleSubmit = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    const signatureDataUrl = canvas.toDataURL("image/png");
    onSubmit(signatureDataUrl);
  }, [hasSignature, onSubmit]);

  const today = new Date().toLocaleDateString("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        <h3 className="font-semibold text-foreground mb-3">Zusammenfassung</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Auftraggeber:</span>
            <p className="text-foreground font-medium">
              {formData.clientInfo.name}
              {formData.clientInfo.company && ` (${formData.clientInfo.company})`}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Service:</span>
            <p className="text-foreground font-medium">
              {SERVICE_LABELS[formData.serviceType]}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Gesamtpreis:</span>
            <p className="text-foreground font-medium">
              {formatPrice(pricing.totalPrice)}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Anzahlung ({pricing.depositPercentage}%):</span>
            <p className="text-primary font-bold">
              {formatPrice(pricing.depositAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* Signature Canvas */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Ihre Unterschrift
        </label>
        <div className="relative">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-40 border-2 border-dashed border-border rounded-lg bg-white cursor-crosshair touch-none"
            style={{ touchAction: "none" }}
          />
          {!hasSignature && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-muted-foreground text-sm">
                Hier unterschreiben (mit Maus oder Finger)
              </span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">Datum: {today}</span>
          <button
            type="button"
            onClick={clearSignature}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Löschen
          </button>
        </div>
      </div>

      {/* Legal Notice */}
      <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
        <p>
          Mit Ihrer digitalen Unterschrift bestätigen Sie, dass Sie die Vertragsbedingungen
          gelesen und akzeptiert haben. Die Unterschrift ist rechtlich bindend.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!hasSignature || isSubmitting}
        className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold text-lg transition-all ${
          hasSignature && !isSubmitting
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Wird gesendet...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Vertrag unterzeichnen & absenden
          </>
        )}
      </button>

      <p className="text-xs text-center text-muted-foreground">
        Nach dem Absenden erhalten Sie eine Bestätigung per E-Mail mit dem
        signierten Vertrag als PDF.
      </p>
    </div>
  );
}
