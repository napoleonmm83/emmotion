"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CardContent } from "@/components/ui/card";
import { VideoPlayer } from "@/components/shared";
import {
  Play,
  Eye,
  ThumbsUp,
  MessageCircle,
  Calendar,
  X,
  Share2,
  Check,
} from "lucide-react";
import { formatNumber, formatDate, itemVariants } from "./tv-helpers";
import type { Video } from "./tv-types";

interface VideoCardProps {
  video: Video;
  priority?: boolean;
  number?: number;
}

export function VideoCard({ video, priority = false, number }: VideoCardProps) {
  // Defensive: ensure all fields are strings/numbers to prevent hydration errors
  const safeTitle = typeof video.title === "string" ? video.title : String(video.title || "");
  const safeDuration = typeof video.duration === "string" ? video.duration : String(video.duration || "");
  const safeViewCount = typeof video.viewCount === "number" ? video.viewCount : 0;
  const safeLikeCount = typeof video.likeCount === "number" ? video.likeCount : 0;
  const safeCommentCount = typeof video.commentCount === "number" ? video.commentCount : 0;

  const youtubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;
  const [imgSrc, setImgSrc] = useState(video.thumbnailUrl || "");
  const [imgError, setImgError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Try native share first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: safeTitle,
          url: youtubeUrl,
        });
        return;
      } catch {
        // User cancelled or error, fall back to clipboard
      }
    }

    // Fall back to clipboard
    try {
      await navigator.clipboard.writeText(youtubeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard failed silently
    }
  };

  // Fallback-Kette für Thumbnails
  const handleImageError = () => {
    if (!imgError) {
      // Versuche hqdefault als Fallback
      setImgSrc(`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`);
      setImgError(true);
    }
  };

  const cardContent = (
    <>
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={imgSrc}
          alt={safeTitle}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={priority}
          onError={handleImageError}
          unoptimized={imgError}
        />
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white font-medium">
          {safeDuration}
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {safeTitle}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {formatNumber(safeViewCount)}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            {formatNumber(safeLikeCount)}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {formatNumber(safeCommentCount)}
          </span>
        </div>

        {/* Date and Number */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(video.publishedAt)}
          </div>
          {number && (
            <span className="text-muted-foreground/50">#{number}</span>
          )}
        </div>
      </CardContent>
    </>
  );

  return (
    <>
      {/* Desktop: Opens lightbox */}
      <motion.div
        variants={itemVariants}
        className="hidden md:block group cursor-pointer bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300"
        onClick={() => setIsOpen(true)}
      >
        {cardContent}
      </motion.div>

      {/* Mobile: Direct link to YouTube */}
      <motion.a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        variants={itemVariants}
        className="md:hidden group block bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300"
      >
        {cardContent}
      </motion.a>

      {/* Framer Motion Lightbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
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

              {/* Video Container */}
              <div className="aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
                <VideoPlayer
                  src={youtubeUrl}
                  poster={imgSrc}
                  title={video.title}
                  aspectRatio="video"
                  showControls
                  className="w-full h-full"
                />
              </div>

              {/* Title Bar */}
              <div className="mt-4 text-center">
                <h3 className="text-lg font-medium text-foreground">{safeTitle}</h3>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {formatNumber(safeViewCount)} Views
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {formatNumber(safeLikeCount)} Likes
                  </span>
                  <span>{safeDuration}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
