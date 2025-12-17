"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
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
  const [isHovered, setIsHovered] = useState(false);

  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[9/16]",
  };

  return (
    <motion.div
      className={cn(
        "relative group overflow-hidden rounded-xl cursor-pointer",
        aspectClasses[aspectRatio],
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={cn(
          "object-cover transition-transform duration-700",
          isHovered && "scale-110"
        )}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* Hover Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-background/60 flex items-center justify-center transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isHovered ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 will-change-transform"
          style={{ transform: "translateZ(0)" }}
        >
          <Play className="w-8 h-8 text-foreground fill-foreground" />
        </motion.div>
      </div>

      {/* Info Overlay */}
      {(title || category) && (
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background via-background/80 to-transparent">
          {category && (
            <p className="text-primary text-sm font-medium mb-1">{category}</p>
          )}
          {title && (
            <h3 className="text-foreground text-lg font-medium">{title}</h3>
          )}
        </div>
      )}
    </motion.div>
  );
}
