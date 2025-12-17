"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ChevronDown } from "lucide-react";

interface HeroClientProps {
  backgroundVideo: string;
  posterImage: string;
}

export function HeroClient({ backgroundVideo, posterImage }: HeroClientProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Autoplay video and pause when hero is not visible
  useEffect(() => {
    const video = videoRef.current;
    const hero = heroRef.current;
    if (!video || !hero) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(hero);

    // Initial autoplay
    video.play().catch(() => {});

    return () => observer.disconnect();
  }, []);

  const useAnimations = isMounted && isDesktop;

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

  const videoBackground = (
    <>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        poster={posterImage}
        preload={isDesktop ? "auto" : "metadata"}
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 vignette" />
      <div className="absolute inset-0 bg-background/60" />
    </>
  );

  return (
    <div ref={heroRef} className="absolute inset-0">
      {/* Background with parallax on desktop */}
      {useAnimations ? (
        <motion.div className="absolute inset-0" style={{ y: backgroundY, scale }}>
          {videoBackground}
        </motion.div>
      ) : (
        <div className="absolute inset-0">
          {videoBackground}
        </div>
      )}

      {/* Video Controls */}
      {useAnimations ? (
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
      ) : (
        <div className="absolute bottom-8 right-8 z-20 flex gap-2">
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
        </div>
      )}

      {/* Scroll Button */}
      {useAnimations ? (
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
      ) : (
        <button
          onClick={() => scrollToSection("leistungen")}
          aria-label="Zu Leistungen scrollen"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-foreground/60 hover:text-foreground transition-colors duration-400"
        >
          <ChevronDown size={32} className="animate-scroll-bounce" />
        </button>
      )}
    </div>
  );
}

// Desktop-only animated content overlay
export function HeroContentAnimated({
  titleLine1,
  titleHighlight,
  subtitle,
  ctaPrimaryText,
  ctaPrimaryLink,
  ctaSecondaryText,
  ctaSecondaryLink,
}: {
  titleLine1: string;
  titleHighlight: string;
  subtitle: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const useAnimations = isMounted && isDesktop;

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
      scrollToSection(link.substring(1));
    } else {
      window.location.href = link;
    }
  };

  // On desktop after mount, show animated version over the static content
  if (!useAnimations) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
    >
        <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display text-foreground tracking-wider mb-6 uppercase"
      >
        {titleLine1}{" "}
        <span className="gradient-text">{titleHighlight}</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-lg md:text-xl text-foreground/70 max-w-2xl mb-12 font-normal"
      >
        {subtitle}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4"
      >
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
      </motion.div>
    </motion.div>
  );
}
