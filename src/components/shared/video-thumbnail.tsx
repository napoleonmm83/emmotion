"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoThumbnailProps {
  src: string;
  alt: string;
  title?: string;
  category?: string;
  onClick?: () => void;
  className?: string;
  aspectRatio?: "video" | "square" | "portrait";
  priority?: boolean;
}

export function VideoThumbnail({
  src,
  alt,
  title,
  category,
  onClick,
  className,
  aspectRatio = "video",
  priority = false,
}: VideoThumbnailProps) {
  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[9/16]",
  };

  return (
    <div
      className={cn("group cursor-pointer", className)}
      onClick={onClick}
    >
      {/* Image Container */}
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-muted",
          aspectClasses[aspectRatio]
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Category Badge */}
        {category && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-medium bg-black/60 backdrop-blur-sm text-white rounded">
              {category}
            </span>
          </div>
        )}

        {/* Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </div>
      </div>

      {/* Text Below */}
      {title && (
        <div className="mt-3 px-1">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>
      )}
    </div>
  );
}
