"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { cn } from "@/lib/utils";
import { YouTubeEmbed, isEmbeddableVideo } from "./youtube-embed";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
  aspectRatio?: "video" | "square" | "portrait";
  showControls?: boolean;
  title?: string;
}

export function VideoPlayer({
  src,
  poster,
  autoPlay = false,
  muted = true,
  loop = false,
  className,
  aspectRatio = "video",
  showControls = true,
  title,
}: VideoPlayerProps) {
  // Check if the source is a YouTube/Vimeo URL
  if (src && isEmbeddableVideo(src)) {
    return (
      <YouTubeEmbed
        url={src}
        title={title}
        poster={poster}
        className={className}
        aspectRatio={aspectRatio}
      />
    );
  }

  // Native video player for direct URLs
  return (
    <NativeVideoPlayer
      src={src}
      poster={poster}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      className={className}
      aspectRatio={aspectRatio}
      showControls={showControls}
    />
  );
}

interface NativeVideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
  aspectRatio?: "video" | "square" | "portrait";
  showControls?: boolean;
}

function NativeVideoPlayer({
  src,
  poster,
  autoPlay = false,
  muted = true,
  loop = false,
  className,
  aspectRatio = "video",
  showControls = true,
}: NativeVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControlsOverlay, setShowControlsOverlay] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    videoRef.current.currentTime = percentage * videoRef.current.duration;
  };

  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[9/16]",
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative group rounded-xl overflow-hidden bg-black",
        aspectClasses[aspectRatio],
        className
      )}
      onMouseEnter={() => setShowControlsOverlay(true)}
      onMouseLeave={() => setShowControlsOverlay(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        className="w-full h-full object-cover"
        onClick={togglePlay}
        onError={() => setHasError(true)}
      />

      {/* Error fallback */}
      {hasError && poster && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={poster} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Play Button Overlay (when paused and no error) */}
      {!isPlaying && !hasError && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="p-5 rounded-full bg-primary/90 hover:bg-primary transition-colors duration-300">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
      )}

      {/* Controls Overlay (hidden on error) */}
      {showControls && !hasError && (
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300",
            showControlsOverlay || !isPlaying ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Progress Bar */}
          <div
            className="h-1 bg-white/30 rounded-full mb-3 cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-primary rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-300"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-300"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-300"
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
