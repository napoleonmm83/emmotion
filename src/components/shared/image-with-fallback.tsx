"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError" | "onLoad"> {
  fallbackClassName?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackClassName,
  ...props
}: ImageWithFallbackProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Check if src is empty or invalid
  const isInvalidSrc = !src || src === "" || src === "undefined" || src === "null";

  if (isInvalidSrc || hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted",
          fallbackClassName || className
        )}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImageOff className="w-8 h-8" />
          <span className="text-xs">Bild nicht verfügbar</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <Skeleton
          className={cn("absolute inset-0", fallbackClassName || className)}
        />
      )}
      <Image
        src={src}
        alt={alt}
        className={cn(
          className,
          isLoading && "opacity-0",
          !isLoading && "opacity-100 transition-opacity duration-300"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        {...props}
      />
    </>
  );
}
