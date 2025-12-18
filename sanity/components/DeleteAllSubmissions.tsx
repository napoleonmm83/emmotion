"use client";

import { useState } from "react";
import { useClient } from "sanity";
import { Card, Stack, Button, Text, Spinner, useToast } from "@sanity/ui";
import { TrashIcon } from "@sanity/icons";

export function DeleteAllSubmissions() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchCount = async () => {
    const result = await client.fetch<number>(
      `count(*[_type == "contactSubmission"])`
    );
    setCount(result);
  };

  // Fetch count on mount
  useState(() => {
    fetchCount();
  });

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      // Delete all contact submissions
      const result = await client.delete({
        query: '*[_type == "contactSubmission"]',
      });

      toast.push({
        status: "success",
        title: "Erfolgreich gelöscht",
        description: `Alle Kontaktanfragen wurden gelöscht.`,
      });

      setCount(0);
      setShowConfirm(false);
    } catch (error) {
      console.error("Delete error:", error);
      toast.push({
        status: "error",
        title: "Fehler",
        description: "Beim Löschen ist ein Fehler aufgetreten.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Text size={2} weight="semibold">
          Kontaktanfragen verwalten
        </Text>

        <Card padding={4} radius={2} shadow={1} tone="caution">
          <Stack space={3}>
            <Text size={1}>
              {count === null ? (
                <Spinner />
              ) : count === 0 ? (
                "Keine Kontaktanfragen vorhanden."
              ) : (
                <>
                  <strong>{count}</strong> Kontaktanfrage
                  {count !== 1 ? "n" : ""} vorhanden.
                </>
              )}
            </Text>

            {count !== null && count > 0 && (
              <>
                {showConfirm ? (
                  <Stack space={3}>
                    <Text size={1} weight="semibold">
                      ⚠️ Sind Sie sicher? Diese Aktion kann nicht rückgängig
                      gemacht werden!
                    </Text>
                    <Stack space={2} style={{ flexDirection: "row", gap: "8px", display: "flex" }}>
                      <Button
                        tone="critical"
                        icon={TrashIcon}
                        text={isDeleting ? "Wird gelöscht..." : "Ja, alle löschen"}
                        onClick={handleDelete}
                        disabled={isDeleting}
                      />
                      <Button
                        tone="default"
                        mode="ghost"
                        text="Abbrechen"
                        onClick={handleCancel}
                        disabled={isDeleting}
                      />
                    </Stack>
                  </Stack>
                ) : (
                  <Button
                    tone="critical"
                    icon={TrashIcon}
                    text="Alle Anfragen löschen"
                    onClick={handleDelete}
                  />
                )}
              </>
            )}
          </Stack>
        </Card>

        <Text size={1} muted>
          Gelöschte Anfragen können nicht wiederhergestellt werden. Stellen Sie
          sicher, dass Sie alle wichtigen Anfragen bearbeitet haben.
        </Text>
      </Stack>
    </Card>
  );
}
