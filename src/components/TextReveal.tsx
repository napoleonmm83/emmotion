import { motion, Variants } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  duration?: number;
}

const letterVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    rotateX: -90,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    rotateX: 0,
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: (custom: { delay: number; staggerDelay: number }) => ({
    opacity: 1,
    transition: {
      delayChildren: custom.delay,
      staggerChildren: custom.staggerDelay,
    },
  }),
};

export const TextReveal = ({ 
  text, 
  className = "", 
  delay = 0.2,
  staggerDelay = 0.03,
  duration = 0.5
}: TextRevealProps) => {
  const words = text.split(" ");

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={{ delay, staggerDelay }}
      style={{ perspective: 1000 }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split("").map((letter, letterIndex) => (
            <motion.span
              key={`${wordIndex}-${letterIndex}`}
              className="inline-block"
              variants={letterVariants}
              transition={{
                duration,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              style={{ 
                transformOrigin: "bottom",
                display: "inline-block",
              }}
            >
              {letter}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </motion.span>
  );
};

// Alternative with blur effect
export const TextRevealBlur = ({ 
  text, 
  className = "", 
  delay = 0.2,
  staggerDelay = 0.04,
}: TextRevealProps) => {
  const words = text.split(" ");

  return (
    <motion.span
      className={`inline-block ${className}`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split("").map((letter, letterIndex) => (
            <motion.span
              key={`${wordIndex}-${letterIndex}`}
              className="inline-block"
              variants={{
                hidden: { 
                  opacity: 0, 
                  y: 20,
                  filter: "blur(10px)",
                },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  filter: "blur(0px)",
                },
              }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {letter}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </motion.span>
  );
};
