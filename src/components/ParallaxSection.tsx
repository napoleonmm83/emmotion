import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  backgroundSpeed?: number;
  showGradient?: boolean;
  gradientDirection?: "top" | "bottom" | "both";
}

export const ParallaxSection = ({
  children,
  className = "",
  id,
  backgroundSpeed = 0.3,
  showGradient = true,
  gradientDirection = "both",
}: ParallaxSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-50 * backgroundSpeed}%`, `${50 * backgroundSpeed}%`]
  );

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  return (
    <section ref={sectionRef} id={id} className={`relative overflow-hidden ${className}`}>
      {/* Parallax background elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        {/* Subtle gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </motion.div>

      {/* Top/bottom gradients for depth */}
      {showGradient && (gradientDirection === "top" || gradientDirection === "both") && (
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
      )}
      {showGradient && (gradientDirection === "bottom" || gradientDirection === "both") && (
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
      )}

      {/* Content */}
      <motion.div className="relative z-20" style={{ opacity }}>
        {children}
      </motion.div>
    </section>
  );
};

// Floating decorative elements with parallax
interface FloatingElementProps {
  className?: string;
  speed?: number;
}

export const FloatingElement = ({ className = "", speed = 0.5 }: FloatingElementProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`${-100 * speed}px`, `${100 * speed}px`]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360 * speed]);

  return (
    <motion.div
      ref={ref}
      className={`absolute pointer-events-none ${className}`}
      style={{ y, rotate }}
    />
  );
};
