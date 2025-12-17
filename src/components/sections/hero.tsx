"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ChevronDown } from "lucide-react";

interface HeroData {
  titleLine1?: string;
  titleHighlight?: string;
  subtitle?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  backgroundVideo?: string;
  backgroundImage?: string;
}

interface HeroSectionProps {
  data?: HeroData | null;
}

export function HeroSection({ data }: HeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Default values (bestehende Texte als Fallback)
  const titleLine1 = data?.titleLine1 || "Videos, die";
  const titleHighlight = data?.titleHighlight || "wirken.";
  const subtitle = data?.subtitle || "Videoproduktion mit TV-Erfahrung – für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz.";
  const ctaPrimaryText = data?.ctaPrimaryText || "Projekt anfragen";
  const ctaPrimaryLink = data?.ctaPrimaryLink || "#kontakt";
  const ctaSecondaryText = data?.ctaSecondaryText || "Portfolio ansehen";
  const ctaSecondaryLink = data?.ctaSecondaryLink || "#portfolio";
  const backgroundVideo = data?.backgroundVideo || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
  const posterImage = data?.backgroundImage || "/images/hero-bg.jpg";

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleButtonClick = (link: string) => {
    if (link.startsWith("#")) {
      // Anchor link - scroll to section
      scrollToSection(link.substring(1));
    } else {
      // Page link - navigate
      window.location.href = link;
    }
  };

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: backgroundY, scale }}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
          poster={posterImage}
          preload="none"
        >
          <source
            src={backgroundVideo}
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 vignette" />
        <div className="absolute inset-0 bg-background/60" />
      </motion.div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display text-foreground tracking-wider mb-6 uppercase">
          {titleLine1}{" "}
          <span className="gradient-text">{titleHighlight}</span>
        </h1>
        <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mb-12 font-normal">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => handleButtonClick(ctaPrimaryLink)}
            className="px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
          >
            {ctaPrimaryText}
          </button>
          <button
            onClick={() => handleButtonClick(ctaSecondaryLink)}
            className="px-8 py-4 bg-transparent text-foreground font-medium rounded-lg border border-foreground/30 hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-400"
          >
            {ctaSecondaryText}
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-8 right-8 z-20 flex gap-2"
      >
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Video pausieren" : "Video abspielen"}
          className="p-3 rounded-full bg-foreground/10 backdrop-blur-sm border border-foreground/20 text-foreground hover:bg-foreground/20 transition-all duration-400"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Ton einschalten" : "Ton ausschalten"}
          className="p-3 rounded-full bg-foreground/10 backdrop-blur-sm border border-foreground/20 text-foreground hover:bg-foreground/20 transition-all duration-400"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        onClick={() => scrollToSection("leistungen")}
        aria-label="Zu Leistungen scrollen"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-foreground/60 hover:text-foreground transition-colors duration-400"
      >
        <ChevronDown size={32} className="animate-scroll-bounce" />
      </motion.button>
    </section>
  );
}
