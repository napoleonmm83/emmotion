"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/shared";
import { Play, Eye, ThumbsUp, MessageCircle, ExternalLink } from "lucide-react";
import {
  StatCard,
  VideoCard,
  TVFilters,
  containerVariants,
} from "./components";
import type {
  TVProductionsData,
  TVSettings,
  SortOption,
  SortDirection,
} from "./components";

// =============================================================================
// PROPS
// =============================================================================

interface TVProduktionenContentProps {
  tvData: TVProductionsData;
  settings?: TVSettings | null;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

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
            <TVFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              availableYears={availableYears}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortDirection={sortDirection}
              onSortDirectionChange={setSortDirection}
            />
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
