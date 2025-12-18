"use client";

import { useState, useCallback, useRef } from "react";
import { set, unset, StringInputProps } from "sanity";
import { Stack, Button, Text, Card, Flex, Spinner } from "@sanity/ui";
import { TrashIcon, PlayIcon } from "@sanity/icons";
import { upload } from "@vercel/blob/client";

export function VideoUploadInput(props: StringInputProps) {
  const { value, onChange } = props;
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("video/")) {
        setError("Bitte nur Video-Dateien hochladen (MP4, WebM, etc.)");
        return;
      }

      // Validate file size (max 500MB for Vercel Blob)
      const maxSize = 500 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("Datei ist zu gross. Maximum: 500MB");
        return;
      }

      setIsUploading(true);
      setError(null);
      setProgress(0);

      try {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
          onUploadProgress: (progressEvent) => {
            setProgress(Math.round(progressEvent.percentage));
          },
        });

        onChange(set(blob.url));
        setProgress(100);
      } catch (err) {
        console.error("Upload error:", err);
        setError(
          err instanceof Error ? err.message : "Upload fehlgeschlagen"
        );
      } finally {
        setIsUploading(false);
        // Reset input
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onChange(unset());
    setError(null);
  }, [onChange]);

  return (
    <Stack space={3}>
      {value ? (
        <Card padding={3} radius={2} shadow={1}>
          <Stack space={3}>
            <video
              src={value}
              controls
              style={{
                width: "100%",
                maxHeight: "200px",
                borderRadius: "4px",
                backgroundColor: "#000",
              }}
            />
            <Flex gap={2} align="center" justify="space-between">
              <Text size={1} muted style={{ wordBreak: "break-all" }}>
                {value}
              </Text>
              <Button
                icon={TrashIcon}
                tone="critical"
                mode="ghost"
                onClick={handleClear}
                text="Entfernen"
              />
            </Flex>
          </Stack>
        </Card>
      ) : (
        <div style={{ position: "relative" }}>
          <Card
            padding={4}
            radius={2}
            shadow={1}
            style={{
              border: "2px dashed var(--card-border-color)",
              textAlign: "center",
            }}
          >
            <Stack space={3}>
              {isUploading ? (
                <>
                  <Flex justify="center">
                    <Spinner />
                  </Flex>
                  <Text size={1} muted>
                    Video wird hochgeladen... {progress}%
                  </Text>
                  <div
                    style={{
                      width: "100%",
                      height: "4px",
                      backgroundColor: "var(--card-border-color)",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        height: "100%",
                        backgroundColor: "var(--card-focus-ring-color)",
                        transition: "width 0.2s ease",
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <Flex justify="center">
                    <PlayIcon
                      style={{ fontSize: "2rem", opacity: 0.5 }}
                    />
                  </Flex>
                  <Text size={1} muted>
                    Klicken zum Auswählen
                  </Text>
                  <Text size={0} muted>
                    MP4, WebM • Max. 500MB
                  </Text>
                </>
              )}
            </Stack>
          </Card>
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            onChange={handleUpload}
            disabled={isUploading}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              cursor: isUploading ? "wait" : "pointer",
            }}
          />
        </div>
      )}

      {error && (
        <Card padding={3} radius={2} tone="critical">
          <Text size={1}>{error}</Text>
        </Card>
      )}

      <Text size={0} muted>
        Videos werden auf Vercel Blob gespeichert und über CDN ausgeliefert.
      </Text>
    </Stack>
  );
}
