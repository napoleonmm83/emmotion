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

      {/* Dialog only renders on desktop (md+) */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[70vw] h-[70vh] !max-w-none p-0 bg-black border-none overflow-hidden flex flex-col" showCloseButton={false}>
          {/* Screen reader only title */}
          <DialogTitle className="sr-only">{title}</DialogTitle>

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Video Player - fills the lightbox */}
          <div className="flex-1 min-h-0 flex items-center justify-center bg-black">
            <div className="w-full h-full">
              <VideoPlayer
                src={videoUrl}
                poster={thumbnail}
                title={title}
                aspectRatio="video"
                showControls
                autoPlay
                muted={false}
                className="w-full h-full [&>div]:h-full [&>div]:flex [&>div]:items-center [&>div]:justify-center"
              />
            </div>
          </div>

          {/* Title Bar */}
          <div className="p-4 bg-black/90 flex-shrink-0">
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
