"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VideoPlayer } from "./video-player";
import { VideoThumbnail } from "./video-thumbnail";

interface VideoLightboxProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
  category?: string;
  priority?: boolean;
  /** Fallback content when lightbox is not used (e.g., Link wrapper for mobile) */
  fallbackWrapper?: (children: React.ReactNode) => React.ReactNode;
}

export function VideoLightbox({
  videoUrl,
  thumbnail,
  title,
  category,
  priority = false,
  fallbackWrapper,
}: VideoLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  const thumbnailElement = (
    <VideoThumbnail
      src={thumbnail}
      alt={title}
      title={title}
      category={category}
      priority={priority}
      onClick={() => setIsOpen(true)}
    />
  );

  return (
    <>
      {/* On mobile, use fallback wrapper (usually a Link), on desktop use lightbox */}
      <div className="hidden md:block">
        {thumbnailElement}
      </div>
      <div className="md:hidden">
        {fallbackWrapper ? fallbackWrapper(thumbnailElement) : thumbnailElement}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 bg-black border-none overflow-hidden">
          {/* Screen reader only title */}
          <DialogTitle className="sr-only">{title}</DialogTitle>

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Video Player */}
          <div className="w-full">
            <VideoPlayer
              src={videoUrl}
              poster={thumbnail}
              title={title}
              aspectRatio="video"
              showControls
              autoPlay
              muted={false}
            />
          </div>

          {/* Title Bar */}
          <div className="p-4 bg-black/90">
            <h3 className="text-lg font-medium text-white">{title}</h3>
            {category && (
              <p className="text-sm text-white/60">{category}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
