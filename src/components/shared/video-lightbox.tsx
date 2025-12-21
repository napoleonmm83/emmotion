"use client";

import { useState } from "react";
import { X, Share2, Check } from "lucide-react";
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
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")
      ? videoUrl
      : window.location.href;

    // Try native share first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or error, fall back to clipboard
      }
    }

    // Fall back to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard failed silently
    }
  };

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

          {/* Buttons outside lightbox - positioned to the right */}
          <div className="absolute -top-2 -right-14 flex flex-col gap-2 z-50">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
              title="Schliessen"
            >
              <X className="w-5 h-5" />
            </button>
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
              title={copied ? "Link kopiert!" : "Teilen"}
            >
              {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
            </button>
          </div>

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
