"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

// =============================================================================
// NUMBER FORMATTING
// =============================================================================

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  // Use consistent formatting without locale-dependent toLocaleString
  // to prevent hydration mismatches
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

// =============================================================================
// DATE FORMATTING
// =============================================================================

export function formatDate(dateString: string): string {
  // Use UTC methods to prevent hydration mismatches between server and client
  // (server might run in different timezone)
  const date = new Date(dateString);
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}.${month}.${year}`;
}

// =============================================================================
// ANIMATED COUNTER
// =============================================================================

export function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const animationRef = useRef<number | null>(null);
  const previousValueRef = useRef<number>(0);

  useEffect(() => {
    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Skip if not in view yet
    if (!isInView) return;

    const startTime = performance.now();
    const startValue = previousValueRef.current;
    const endValue = value;

    // Store current value for next animation
    previousValueRef.current = value;

    // If same value, just set it
    if (startValue === endValue) {
      setDisplayValue(endValue);
      return;
    }

    // Faster animation for updates (500ms), slower for initial (duration * 1000)
    const animDuration = startValue === 0 ? duration * 1000 : 500;

    // Easing function for smooth deceleration
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animDuration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easedProgress);

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInView, value, duration]);

  return <span ref={ref}>{formatNumber(displayValue)}</span>;
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};
