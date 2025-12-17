"use client";

import { useState } from "react";
import { Button, Card, Stack, Text, Spinner } from "@sanity/ui";

export function EmailTestButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/email-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      setResult({
        success: response.ok,
        message: data.message || data.error || "Unbekanntes Ergebnis",
      });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Verbindungsfehler",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card padding={4} radius={2} shadow={1} tone={result?.success ? "positive" : result?.success === false ? "critical" : "default"}>
      <Stack space={4}>
        <Text size={2} weight="semibold">
          E-Mail-Konfiguration testen
        </Text>
        <Text size={1} muted>
          Sendet eine Test-E-Mail an die angegebene Test-Empfänger-Adresse.
        </Text>
        <Button
          onClick={handleTest}
          disabled={loading}
          tone="primary"
          text={loading ? "Wird gesendet..." : "Test-E-Mail senden"}
          icon={loading ? Spinner : undefined}
        />
        {result && (
          <Card padding={3} radius={2} tone={result.success ? "positive" : "critical"}>
            <Text size={1}>{result.message}</Text>
          </Card>
        )}
      </Stack>
    </Card>
  );
}
