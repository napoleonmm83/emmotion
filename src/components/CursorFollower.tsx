import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export const CursorFollower = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  const cursorX = useSpring(0, { stiffness: 300, damping: 30 });
  const cursorY = useSpring(0, { stiffness: 300, damping: 30 });
  
  const trailX = useSpring(0, { stiffness: 150, damping: 25 });
  const trailY = useSpring(0, { stiffness: 150, damping: 25 });

  useEffect(() => {
    // Check if device has fine pointer (mouse)
    const hasFinPointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinPointer) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Detect hoverable elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[role='button']") ||
        window.getComputedStyle(target).cursor === "pointer";
      
      setIsPointer(!!isInteractive);
      setIsHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleElementHover);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleElementHover);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY, trailX, trailY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground"
          animate={{
            width: isHovering ? 12 : 6,
            height: isHovering ? 12 : 6,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </motion.div>

      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: trailX,
          y: trailY,
        }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/50"
          animate={{
            width: isHovering ? 50 : 32,
            height: isHovering ? 50 : 32,
            borderColor: isHovering ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.3)",
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </motion.div>

      {/* Glow effect on hover */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{
          x: trailX,
          y: trailY,
        }}
        animate={{
          opacity: isPointer ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-primary/10 blur-xl" />
      </motion.div>

      {/* Hide default cursor via style tag */}
      <style>{`
        @media (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
};
