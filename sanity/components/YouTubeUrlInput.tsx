"use client";

import { useState, useCallback } from "react";
import { Stack, Button, Text, Card, Flex, Spinner } from "@sanity/ui";
import { set, unset, type StringInputProps } from "sanity";
import { useFormValue, useClient } from "sanity";

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  // Various YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Just the ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Get the best available YouTube thumbnail URL
 */
function getYouTubeThumbnailUrl(videoId: string): string {
  // maxresdefault is the highest quality, but not always available
  // We'll try to fetch it and fall back if needed
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/**
 * Custom input component for video URLs with YouTube thumbnail fetching
 */
export function YouTubeUrlInput(props: StringInputProps) {
  const { value, onChange, elementProps } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const client = useClient({ apiVersion: "2024-01-01" });

  // Get the document ID to patch the thumbnail
  const documentId = useFormValue(["_id"]) as string | undefined;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.currentTarget.value;
      onChange(nextValue ? set(nextValue) : unset());
      setError(null);
      setSuccess(null);
    },
    [onChange]
  );

  const fetchAndSetThumbnail = useCallback(async () => {
    if (!value) {
      setError("Bitte zuerst eine YouTube URL eingeben");
      return;
    }

    const videoId = extractYouTubeId(value);
    if (!videoId) {
      setError("Keine gültige YouTube URL erkannt");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Get thumbnail URL
      const thumbnailUrl = getYouTubeThumbnailUrl(videoId);

      // Fetch the image
      const response = await fetch(thumbnailUrl);
      if (!response.ok) {
        // Try fallback to hqdefault if maxresdefault doesn't exist
        const fallbackUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        const fallbackResponse = await fetch(fallbackUrl);
        if (!fallbackResponse.ok) {
          throw new Error("YouTube Thumbnail konnte nicht geladen werden");
        }
        // Use fallback
        const blob = await fallbackResponse.blob();
        await uploadThumbnail(blob, videoId);
      } else {
        const blob = await response.blob();
        await uploadThumbnail(blob, videoId);
      }
    } catch (err) {
      console.error("Error fetching thumbnail:", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden des Thumbnails");
    } finally {
      setIsLoading(false);
    }
  }, [value, client, documentId]);

  const uploadThumbnail = async (blob: Blob, videoId: string) => {
    if (!documentId) {
      setError("Dokument muss zuerst gespeichert werden");
      return;
    }

    try {
      // Upload to Sanity
      const asset = await client.assets.upload("image", blob, {
        filename: `youtube-${videoId}.jpg`,
        contentType: "image/jpeg",
      });

      // Patch the document to set the thumbnail
      // Remove drafts. prefix if present for patching
      const patchId = documentId.replace(/^drafts\./, "");

      await client
        .patch(patchId)
        .set({
          thumbnail: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: asset._id,
            },
          },
        })
        .commit();

      // Also patch the draft if we're editing a draft
      if (documentId.startsWith("drafts.")) {
        await client
          .patch(documentId)
          .set({
            thumbnail: {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: asset._id,
              },
            },
          })
          .commit();
      }

      setSuccess("Thumbnail erfolgreich geladen!");
    } catch (err) {
      console.error("Error uploading thumbnail:", err);
      throw new Error("Fehler beim Speichern des Thumbnails");
    }
  };

  const videoId = value ? extractYouTubeId(value) : null;
  const isYouTube = !!videoId;

  return (
    <Stack space={3}>
      {/* Default URL input */}
      <input
        {...elementProps}
        type="url"
        value={value || ""}
        onChange={handleChange}
        placeholder="https://youtube.com/watch?v=..."
        style={{
          width: "100%",
          padding: "0.75rem",
          fontSize: "1rem",
          border: "1px solid var(--card-border-color)",
          borderRadius: "4px",
          background: "var(--card-bg-color)",
          color: "var(--card-fg-color)",
        }}
      />

      {/* YouTube detected - show fetch button */}
      {isYouTube && (
        <Card padding={3} radius={2} tone="primary">
          <Flex align="center" gap={3}>
            <Text size={1} style={{ flex: 1 }}>
              YouTube Video erkannt: <code>{videoId}</code>
            </Text>
            <Button
              fontSize={1}
              padding={3}
              tone="primary"
              mode="ghost"
              onClick={fetchAndSetThumbnail}
              disabled={isLoading}
              text={isLoading ? "Lädt..." : "Thumbnail laden"}
              icon={isLoading ? Spinner : undefined}
            />
          </Flex>
        </Card>
      )}

      {/* Thumbnail preview */}
      {isYouTube && (
        <Card padding={2} radius={2} style={{ background: "#111" }}>
          <img
            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
            alt="YouTube Thumbnail Vorschau"
            style={{
              width: "100%",
              maxWidth: "320px",
              height: "auto",
              borderRadius: "4px",
            }}
          />
          <Text size={1} muted style={{ marginTop: "8px" }}>
            Vorschau (Medium Quality)
          </Text>
        </Card>
      )}

      {/* Error message */}
      {error && (
        <Card padding={3} radius={2} tone="critical">
          <Text size={1}>{error}</Text>
        </Card>
      )}

      {/* Success message */}
      {success && (
        <Card padding={3} radius={2} tone="positive">
          <Text size={1}>{success}</Text>
        </Card>
      )}
    </Stack>
  );
}

export default YouTubeUrlInput;
