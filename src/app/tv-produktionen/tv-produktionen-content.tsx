"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/shared";
import {
  Play,
  Eye,
  ThumbsUp,
  MessageCircle,
  Calendar,
  Clock,
  ExternalLink,
  ArrowUpDown,
  TrendingUp,
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
  return num.toLocaleString("de-CH");
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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
      className="bg-card border border-border rounded-xl p-6 text-center"
    >
      <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
      <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
        {typeof value === "number" ? formatNumber(value) : value}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}

function VideoCard({ video, priority = false }: { video: Video; priority?: boolean }) {
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;

  return (
    <motion.a
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      variants={itemVariants}
      className="group block bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={priority}
        />
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white font-medium">
          {video.duration}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {formatNumber(video.viewCount)}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            {formatNumber(video.likeCount)}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {formatNumber(video.commentCount)}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
          <Calendar className="w-3 h-3" />
          {formatDate(video.publishedAt)}
        </div>
      </div>
    </motion.a>
  );
}

export function TVProduktionenContent({
  tvData,
  settings,
}: TVProduktionenContentProps) {
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = tvData.cachedData;

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

  // Sortierte und gefilterte Videos
  const sortedVideos = useMemo(() => {
    let filtered = [...videos];

    // Suchfilter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(query) ||
          v.description.toLowerCase().includes(query)
      );
    }

    // Sortierung
    switch (sortBy) {
      case "views":
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case "likes":
        filtered.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case "date":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
    }

    return filtered;
  }, [videos, sortBy, searchQuery]);

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
        {stats && (
          <section className="pb-12 md:pb-16">
            <Container>
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
                  {new Date(stats.lastSyncedAt).toLocaleString("de-CH")}
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
              className="flex flex-col sm:flex-row gap-4 justify-between items-center"
            >
              {/* Search */}
              <input
                type="text"
                placeholder="Videos durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
              />

              {/* Sort */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
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
                  key={`${sortBy}-${searchQuery}`}
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
                Die gleiche Qualität, die Sie bei TV Rheintal sehen, bringe ich
                auch in Ihr Unternehmensvideo. Kontaktieren Sie mich für ein
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
