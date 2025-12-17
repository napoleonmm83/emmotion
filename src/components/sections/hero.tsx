import { HeroClient, HeroContentAnimated } from "./hero-client";
import Link from "next/link";

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
  // Default values
  const titleLine1 = data?.titleLine1 || "Videos, die";
  const titleHighlight = data?.titleHighlight || "wirken.";
  const subtitle = data?.subtitle || "Videoproduktion mit TV-Erfahrung – für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz.";
  const ctaPrimaryText = data?.ctaPrimaryText || "Projekt anfragen";
  const ctaPrimaryLink = data?.ctaPrimaryLink || "#kontakt";
  const ctaSecondaryText = data?.ctaSecondaryText || "Portfolio ansehen";
  const ctaSecondaryLink = data?.ctaSecondaryLink || "#portfolio";
  const backgroundVideo = data?.backgroundVideo || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
  const posterImage = data?.backgroundImage || "/images/hero-bg.jpg";

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Client component for video background and controls */}
      <HeroClient
        backgroundVideo={backgroundVideo}
        posterImage={posterImage}
      />

      {/* Static server-rendered content - immediate LCP */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display text-foreground tracking-wider mb-6 uppercase">
          {titleLine1}{" "}
          <span className="gradient-text">{titleHighlight}</span>
        </h1>
        <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mb-12 font-normal">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {ctaPrimaryLink.startsWith("#") ? (
            <a
              href={ctaPrimaryLink}
              className="px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
            >
              {ctaPrimaryText}
            </a>
          ) : (
            <Link
              href={ctaPrimaryLink}
              className="px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
            >
              {ctaPrimaryText}
            </Link>
          )}
          {ctaSecondaryLink.startsWith("#") ? (
            <a
              href={ctaSecondaryLink}
              className="px-8 py-4 bg-transparent text-foreground font-medium rounded-lg border border-foreground/30 hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-400"
            >
              {ctaSecondaryText}
            </a>
          ) : (
            <Link
              href={ctaSecondaryLink}
              className="px-8 py-4 bg-transparent text-foreground font-medium rounded-lg border border-foreground/30 hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-400"
            >
              {ctaSecondaryText}
            </Link>
          )}
        </div>
      </div>

      {/* Desktop animated overlay - replaces static content with animations */}
      <HeroContentAnimated
        titleLine1={titleLine1}
        titleHighlight={titleHighlight}
        subtitle={subtitle}
        ctaPrimaryText={ctaPrimaryText}
        ctaPrimaryLink={ctaPrimaryLink}
        ctaSecondaryText={ctaSecondaryText}
        ctaSecondaryLink={ctaSecondaryLink}
      />
    </section>
  );
}
