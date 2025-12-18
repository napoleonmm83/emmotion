"use client";

import { useState, useEffect } from "react";
import { useClient } from "sanity";
import { Card, Stack, Button, Text, Spinner, useToast, Badge } from "@sanity/ui";
import { TrashIcon, ClockIcon } from "@sanity/icons";

const RETENTION_DAYS = 60;

export function DeleteAllSubmissions() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [oldCount, setOldCount] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchCounts = async () => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);
    const cutoffISO = cutoffDate.toISOString();

    const [total, old] = await Promise.all([
      client.fetch<number>(`count(*[_type == "contactSubmission"])`),
      client.fetch<number>(
        `count(*[_type == "contactSubmission" && submittedAt < $cutoff])`,
        { cutoff: cutoffISO }
      ),
    ]);
    setCount(total);
    setOldCount(old);
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleDeleteAll = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      await client.delete({
        query: '*[_type == "contactSubmission"]',
      });

      toast.push({
        status: "success",
        title: "Erfolgreich gelöscht",
        description: "Alle Kontaktanfragen wurden gelöscht.",
      });

      setCount(0);
      setOldCount(0);
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

  if (count === null) {
    return (
      <Card padding={5}>
        <Stack space={4} style={{ alignItems: "center" }}>
          <Spinner />
          <Text size={1} muted>Lade Daten...</Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card padding={4}>
      <Stack space={5}>
        {/* Status Overview */}
        <Card padding={4} radius={2} shadow={1}>
          <Stack space={4}>
            <Text size={2} weight="semibold">
              📊 Übersicht
            </Text>
            <Stack space={3}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text size={1}>Gesamt</Text>
                <Badge tone={count > 0 ? "primary" : "default"}>{count}</Badge>
              </div>
              {oldCount !== null && oldCount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text size={1} muted>Älter als {RETENTION_DAYS} Tage</Text>
                  <Badge tone="caution">{oldCount}</Badge>
                </div>
              )}
            </Stack>
          </Stack>
        </Card>

        {/* Auto-Delete Info */}
        <Card padding={4} radius={2} shadow={1} tone="positive">
          <Stack space={3}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ClockIcon />
              <Text size={1} weight="semibold">
                Automatische Löschung aktiv
              </Text>
            </div>
            <Text size={1} muted>
              Anfragen werden automatisch nach <strong>{RETENTION_DAYS} Tagen</strong> gelöscht
              (täglich um 03:00 Uhr). Dies gewährleistet DSGVO-Konformität.
            </Text>
          </Stack>
        </Card>

        {/* Manual Delete Option */}
        {count > 0 && (
          <Card padding={4} radius={2} shadow={1} tone="caution">
            <Stack space={3}>
              <Text size={1} weight="semibold">
                Manuell löschen
              </Text>

              {showConfirm ? (
                <Stack space={3}>
                  <Text size={1}>
                    ⚠️ Wirklich alle {count} Anfragen löschen? Diese Aktion kann nicht rückgängig gemacht werden!
                  </Text>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Button
                      tone="critical"
                      icon={TrashIcon}
                      text={isDeleting ? "Wird gelöscht..." : "Ja, alle löschen"}
                      onClick={handleDeleteAll}
                      disabled={isDeleting}
                    />
                    <Button
                      tone="default"
                      mode="ghost"
                      text="Abbrechen"
                      onClick={handleCancel}
                      disabled={isDeleting}
                    />
                  </div>
                </Stack>
              ) : (
                <Button
                  tone="critical"
                  mode="ghost"
                  icon={TrashIcon}
                  text="Alle Anfragen jetzt löschen"
                  onClick={handleDeleteAll}
                />
              )}
            </Stack>
          </Card>
        )}

        {count === 0 && (
          <Text size={1} muted style={{ textAlign: "center" }}>
            ✓ Keine Anfragen im System
          </Text>
        )}
      </Stack>
    </Card>
  );
}
