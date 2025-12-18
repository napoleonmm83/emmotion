"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Shield, ExternalLink } from "lucide-react";
import Link from "next/link";

const CONSENT_KEY = "emmotion-cookie-consent";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: true, date: new Date().toISOString() }));
    setIsVisible(false);
  };

  const handleDismiss = () => {
    // Just hide for this session, will show again next visit
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 right-4 left-4 md:left-auto md:max-w-md z-50"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl">
            {/* Gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Schliessen"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-5 pt-6">
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1 pr-6">
                  <h3 className="font-semibold text-foreground text-sm">
                    Datenschutz-freundliche Website
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Keine Tracking-Cookies, keine Werbung
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Diese Website verwendet <strong className="text-foreground">keine Tracking-Cookies</strong>.
                  Wir setzen nur technisch notwendige Funktionen ein.
                </p>

                {/* Expandable details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 pb-1 space-y-2 text-xs text-muted-foreground border-t border-border mt-3">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span><strong>Cloudflare Turnstile</strong> – Spam-Schutz ohne Cookies</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span><strong>Kein Google Analytics</strong> – Keine Datensammlung</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span><strong>DSGVO-konform</strong> – Automatische Datenlöschung</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleAccept}
                    className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl gradient-primary text-white glow-primary hover:opacity-90 transition-opacity"
                  >
                    Verstanden
                  </button>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="px-4 py-2.5 text-sm font-medium rounded-xl border border-border hover:bg-muted transition-colors text-muted-foreground"
                  >
                    {isExpanded ? "Weniger" : "Details"}
                  </button>
                </div>

                {/* Privacy link */}
                <Link
                  href="/datenschutz"
                  className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors pt-1"
                >
                  <span>Datenschutzerklärung</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
