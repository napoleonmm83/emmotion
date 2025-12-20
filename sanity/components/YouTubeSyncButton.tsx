"use client";

import { useState } from "react";
import { Button, Card, Stack, Text, Spinner, Badge } from "@sanity/ui";
import { SyncIcon, CheckmarkCircleIcon, WarningOutlineIcon } from "@sanity/icons";

type SyncStatus = "idle" | "loading" | "success" | "error";

interface SyncResult {
  success?: boolean;
  message?: string;
  stats?: {
    totalVideos: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    lastSyncedAt: string;
  };
  error?: string;
  details?: string;
}

export function YouTubeSyncButton() {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [result, setResult] = useState<SyncResult | null>(null);

  const handleSync = async () => {
    setStatus("loading");
    setResult(null);

    try {
      const baseUrl = window.location.origin.includes("localhost")
        ? "http://localhost:3000"
        : window.location.origin.replace("/studio", "");

      const syncSecret = process.env.NEXT_PUBLIC_SYNC_SECRET;
      const url = syncSecret
        ? `${baseUrl}/api/cron/sync-youtube?secret=${syncSecret}`
        : `${baseUrl}/api/cron/sync-youtube?manual=true`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setResult(data);
      } else {
        setStatus("error");
        setResult(data);
      }
    } catch (error) {
      setStatus("error");
      setResult({
        error: "Verbindungsfehler",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
  };

  return (
    <Card padding={4} radius={2} shadow={1} tone="primary">
      <Stack space={4}>
        <Stack space={2}>
          <Text size={2} weight="semibold">
            YouTube Sync
          </Text>
          <Text size={1} muted>
            Aktualisiert die Video-Statistiken aus der YouTube-Playlist.
            Läuft automatisch täglich um 4:00 Uhr.
          </Text>
        </Stack>

        <Button
          onClick={handleSync}
          disabled={status === "loading"}
          tone="primary"
          icon={status === "loading" ? Spinner : SyncIcon}
          text={status === "loading" ? "Synchronisiere..." : "Jetzt synchronisieren"}
        />

        {status === "success" && result?.stats && (
          <Card padding={3} radius={2} tone="positive">
            <Stack space={3}>
              <Stack space={2} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckmarkCircleIcon />
                <Text size={1} weight="semibold">
                  Erfolgreich synchronisiert
                </Text>
              </Stack>
              <Stack space={2}>
                <Text size={1} muted>
                  {result.stats.totalVideos} Videos • {result.stats.totalViews.toLocaleString("de-CH")} Views
                </Text>
                <Text size={1} muted>
                  {result.stats.totalLikes.toLocaleString("de-CH")} Likes • {result.stats.totalComments.toLocaleString("de-CH")} Kommentare
                </Text>
              </Stack>
            </Stack>
          </Card>
        )}

        {status === "error" && (
          <Card padding={3} radius={2} tone="critical">
            <Stack space={2} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <WarningOutlineIcon />
              <Text size={1} weight="semibold">
                {result?.error || "Fehler beim Synchronisieren"}
              </Text>
            </Stack>
            {result?.details && (
              <Text size={1} muted>
                {result.details}
              </Text>
            )}
            {result?.message && (
              <Text size={1} muted>
                {result.message}
              </Text>
            )}
          </Card>
        )}
      </Stack>
    </Card>
  );
}
