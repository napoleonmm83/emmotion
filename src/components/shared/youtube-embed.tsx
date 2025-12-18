"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface YouTubeEmbedProps {
  url: string;
  title?: string;
  poster?: string;
  className?: string;
  aspectRatio?: "video" | "square" | "portrait";
}

/**
 * Extracts YouTube video ID from various URL formats
 */
function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^#&?]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

/**
 * Extracts Vimeo video ID from URL
 */
function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match?.[1] || null;
}

/**
 * YouTubeEmbed - Performant YouTube/Vimeo embed with facade pattern
 *
 * Shows a clickable thumbnail first, only loads the iframe when user clicks.
 * This significantly improves page load performance.
 */
export function YouTubeEmbed({
  url,
  title = "Video",
  poster,
  className,
  aspectRatio = "video",
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const youtubeId = getYouTubeId(url);
  const vimeoId = getVimeoId(url);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[9/16]",
  };

  // YouTube thumbnail - use maxresdefault for best quality, fallback to hqdefault
  const youtubeThumbnail = youtubeId
    ? `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`
    : null;

  const thumbnailUrl = poster || youtubeThumbnail;

  if (!youtubeId && !vimeoId) {
    return (
      <div className={cn("relative bg-muted rounded-xl flex items-center justify-center", aspectClasses[aspectRatio], className)}>
        <p className="text-muted-foreground">Ungültige Video-URL</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden bg-black group",
        aspectClasses[aspectRatio],
        className
      )}
    >
      {!isLoaded ? (
        // Facade: Thumbnail + Play button
        <button
          type="button"
          onClick={handleLoad}
          className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={`${title} abspielen`}
        >
          {/* Thumbnail */}
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              // Fallback for YouTube maxresdefault not available
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (youtubeId && target.src.includes("maxresdefault")) {
                  target.src = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
                }
              }}
            />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-primary/50 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Button */}
              <div className="relative p-5 md:p-6 rounded-full bg-primary/90 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 shadow-2xl">
                <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white" />
              </div>
            </div>
          </div>

          {/* Title overlay (optional) */}
          {title && (
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <p className="text-white font-medium text-sm md:text-base truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {title}
              </p>
            </div>
          )}
        </button>
      ) : (
        // Loaded: Actual iframe
        <iframe
          src={
            youtubeId
              ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`
              : `https://player.vimeo.com/video/${vimeoId}?autoplay=1`
          }
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )}
    </div>
  );
}

// Utility function to check if URL is YouTube/Vimeo
export function isEmbeddableVideo(url: string): boolean {
  return Boolean(getYouTubeId(url) || getVimeoId(url));
}

// Utility function to get video provider
export function getVideoProvider(url: string): "youtube" | "vimeo" | "direct" {
  if (getYouTubeId(url)) return "youtube";
  if (getVimeoId(url)) return "vimeo";
  return "direct";
}
