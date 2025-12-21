"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container, VideoPlayer } from "@/components/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Play,
  Eye,
  ThumbsUp,
  MessageCircle,
  Calendar,
  ExternalLink,
  ArrowUpDown,
  TrendingUp,
  Filter,
  X,
  ListOrdered,
} from "lucide-react";

interface Video {
  youtubeId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

interface TVProductionsData {
  _id: string;
  enabled: boolean;
  playlistId: string;
  title: string;
  subtitle: string;
  description: string;
  channelInfo?: {
    channelName: string;
    channelUrl: string;
    role: string;
  };
  cachedData?: {
    lastSyncedAt: string;
    totalVideos: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    videos: Video[];
  };
}

interface TVProduktionenContentProps {
  tvData: TVProductionsData;
  settings?: {
    siteName?: string;
    contact?: {
      email?: string;
      phone?: string;
      street?: string;
      city?: string;
      uid?: string;
      region?: string;
    };
    social?: {
      linkedin?: string;
      instagram?: string;
      youtube?: string;
    };
    footer?: {
      tagline?: string;
      ctaText?: string;
      copyrightName?: string;
    };
  } | null;
}

type SortOption = "date" | "views" | "likes";
type SortDirection = "asc" | "desc";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  // Use consistent formatting without locale-dependent toLocaleString
  // to prevent hydration mismatches
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const animationRef = useRef<number | null>(null);
  const previousValueRef = useRef<number>(0);

  useEffect(() => {
    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Skip if not in view yet
    if (!isInView) return;

    const startTime = performance.now();
    const startValue = previousValueRef.current;
    const endValue = value;

    // Store current value for next animation
    previousValueRef.current = value;

    // If same value, just set it
    if (startValue === endValue) {
      setDisplayValue(endValue);
      return;
    }

    // Faster animation for updates (500ms), slower for initial (duration * 1000)
    const animDuration = startValue === 0 ? duration * 1000 : 500;

    // Easing function for smooth deceleration
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animDuration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easedProgress);

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInView, value, duration]);

  return <span ref={ref}>{formatNumber(displayValue)}</span>;
}

function formatDate(dateString: string): string {
  // Use UTC methods to prevent hydration mismatches between server and client
  // (server might run in different timezone)
  const date = new Date(dateString);
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}.${month}.${year}`;
}

function StatCard({
  icon: Icon,
  label,
  value,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="p-6 text-center">
        <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
        <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
          {typeof value === "number" ? (
            <AnimatedCounter value={value} duration={2 + delay} />
          ) : (
            value
          )}
        </p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </Card>
    </motion.div>
  );
}

function VideoCard({ video, priority = false, number }: { video: Video; priority?: boolean; number?: number }) {
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

      {/* Lightbox Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[70vw] h-[70vh] !max-w-none p-0 bg-black border-none overflow-hidden flex flex-col" showCloseButton={false}>
          {/* Screen reader only title */}
          <DialogTitle className="sr-only">{safeTitle}</DialogTitle>

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
                src={youtubeUrl}
                poster={imgSrc}
                title={video.title}
                aspectRatio="video"
                showControls
                className="w-full h-full [&>div]:h-full [&>div]:flex [&>div]:items-center [&>div]:justify-center"
              />
            </div>
          </div>

          {/* Title Bar */}
          <div className="p-4 bg-black/90 flex-shrink-0">
            <h3 className="text-lg font-medium text-white">{safeTitle}</h3>
            <div className="flex items-center gap-4 text-sm text-white/60 mt-1">
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
        </DialogContent>
      </Dialog>
    </>
  );
}

export function TVProduktionenContent({
  tvData,
  settings,
}: TVProduktionenContentProps) {
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch for locale-dependent formatting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Duplikate entfernen (falls Video mehrfach in Playlist)
  const videos = useMemo(() => {
    const raw = tvData.cachedData?.videos || [];
    const seen = new Set<string>();
    return raw.filter((video) => {
      if (seen.has(video.youtubeId)) return false;
      seen.add(video.youtubeId);
      return true;
    });
  }, [tvData.cachedData?.videos]);

  // Verfügbare Jahre aus den Videos extrahieren (absteigend sortiert)
  // Use UTC to ensure consistent year extraction between server and client
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    videos.forEach((video) => {
      const year = new Date(video.publishedAt).getUTCFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [videos]);

  // Videos nach Jahr filtern
  const videosFilteredByYear = useMemo(() => {
    if (!selectedYear) return videos;
    return videos.filter((video) => {
      const year = new Date(video.publishedAt).getUTCFullYear();
      return year === selectedYear;
    });
  }, [videos, selectedYear]);

  // Dynamische Statistiken basierend auf gefiltertem Jahr
  const stats = useMemo(() => {
    const baseVideos = videosFilteredByYear;
    return {
      totalVideos: baseVideos.length,
      totalViews: baseVideos.reduce((sum, v) => sum + v.viewCount, 0),
      totalLikes: baseVideos.reduce((sum, v) => sum + v.likeCount, 0),
      totalComments: baseVideos.reduce((sum, v) => sum + v.commentCount, 0),
      lastSyncedAt: tvData.cachedData?.lastSyncedAt,
    };
  }, [videosFilteredByYear, tvData.cachedData?.lastSyncedAt]);

  // Sortierte und gefilterte Videos
  const sortedVideos = useMemo(() => {
    let filtered = [...videosFilteredByYear];

    // Suchfilter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(query) ||
          v.description.toLowerCase().includes(query)
      );
    }

    // Sortierung mit Richtung
    const direction = sortDirection === "asc" ? 1 : -1;
    switch (sortBy) {
      case "views":
        filtered.sort((a, b) => (a.viewCount - b.viewCount) * direction);
        break;
      case "likes":
        filtered.sort((a, b) => (a.likeCount - b.likeCount) * direction);
        break;
      case "date":
      default:
        filtered.sort(
          (a, b) =>
            (new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()) * direction
        );
    }

    return filtered;
  }, [videosFilteredByYear, sortBy, sortDirection, searchQuery]);

  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground mb-6 tracking-wide">
                {tvData.title || "TV Produktionen"}
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                {tvData.subtitle}
              </p>
              {tvData.channelInfo && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span>{tvData.channelInfo.role} bei</span>
                  {tvData.channelInfo.channelUrl ? (
                    <a
                      href={tvData.channelInfo.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                    >
                      {tvData.channelInfo.channelName}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-foreground font-medium">
                      {tvData.channelInfo.channelName}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          </Container>
        </section>

        {/* Statistics Section */}
        {stats.totalVideos > 0 && (
          <section className="pb-12 md:pb-16">
            <Container>
              {selectedYear && (
                <motion.p
                  key={selectedYear}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-primary font-medium mb-4"
                >
                  Statistiken für {selectedYear}
                </motion.p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                  icon={Play}
                  label="Produzierte Videos"
                  value={stats.totalVideos}
                  delay={0}
                />
                <StatCard
                  icon={Eye}
                  label="Gesamte Views"
                  value={stats.totalViews}
                  delay={0.1}
                />
                <StatCard
                  icon={ThumbsUp}
                  label="Gesamte Likes"
                  value={stats.totalLikes}
                  delay={0.2}
                />
                <StatCard
                  icon={MessageCircle}
                  label="Kommentare"
                  value={stats.totalComments}
                  delay={0.3}
                />
              </div>
              {stats.lastSyncedAt && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-xs text-muted-foreground mt-4"
                >
                  Letzte Aktualisierung:{" "}
                  {isMounted
                    ? new Date(stats.lastSyncedAt).toLocaleString("de-CH")
                    : "–"}
                </motion.p>
              )}
            </Container>
          </section>
        )}

        {/* Description */}
        {tvData.description && (
          <section className="pb-12">
            <Container size="small">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-muted-foreground text-center"
              >
                {tvData.description}
              </motion.p>
            </Container>
          </section>
        )}

        {/* Filters */}
        <section className="pb-8">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col gap-4"
            >
              {/* Top row: Search and Year Filter */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                {/* Search */}
                <input
                  type="text"
                  placeholder="Videos durchsuchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                />

                {/* Year Filter Dropdown */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Jahr:</span>
                  <Select
                    value={selectedYear?.toString() || "all"}
                    onValueChange={(value) =>
                      setSelectedYear(value === "all" ? null : Number(value))
                    }
                  >
                    <SelectTrigger className="w-[120px] bg-card border-border">
                      <SelectValue placeholder="Alle Jahre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Jahre</SelectItem>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bottom row: Sort */}
              <div className="flex items-center justify-start sm:justify-end gap-2 flex-wrap">
                <ListOrdered className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Sortieren:</span>
                <div className="flex gap-2">
                  {[
                    { value: "date", label: "Datum", icon: Calendar },
                    { value: "views", label: "Views", icon: TrendingUp },
                    { value: "likes", label: "Likes", icon: ThumbsUp },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value as SortOption)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
                        sortBy === option.value
                          ? "gradient-primary text-foreground"
                          : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      <option.icon className="w-3 h-3" />
                      {option.label}
                    </button>
                  ))}
                </div>
                {/* Sort Direction Toggle */}
                <button
                  onClick={() => setSortDirection(prev => prev === "desc" ? "asc" : "desc")}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1.5 bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  title={sortDirection === "desc" ? "Absteigend (höchste zuerst)" : "Aufsteigend (niedrigste zuerst)"}
                >
                  <ArrowUpDown className={`w-3 h-3 transition-transform ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  {sortDirection === "desc" ? "Absteigend" : "Aufsteigend"}
                </button>
              </div>
            </motion.div>
          </Container>
        </section>

        {/* Videos Grid */}
        <section className="py-8 md:py-12">
          <Container>
            <AnimatePresence mode="wait">
              {sortedVideos.length > 0 ? (
                <motion.div
                  key={`${sortBy}-${sortDirection}-${searchQuery}-${selectedYear || "all"}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {sortedVideos.map((video, index) => (
                    <VideoCard
                      key={video.youtubeId}
                      video={video}
                      priority={index < 6}
                      number={sortedVideos.length - index}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <p className="text-muted-foreground text-lg">
                    {searchQuery
                      ? "Keine Videos für diese Suche gefunden."
                      : "Noch keine Videos verfügbar."}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-4 text-primary hover:text-primary/80 transition-colors"
                    >
                      Suche zurücksetzen
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 border-t border-border">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-display text-foreground mb-6 tracking-wide">
                Professionelle Videoproduktion
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Die gleiche Qualität, die du bei TV Rheintal siehst, bringe ich
                auch in dein Unternehmensvideo. Kontaktiere mich für ein
                unverbindliches Gespräch.
              </p>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
              >
                Projekt anfragen
              </Link>
            </motion.div>
          </Container>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
