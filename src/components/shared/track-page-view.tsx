"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

interface TrackPageViewProps {
  event: string;
  data?: Record<string, string | number | boolean>;
}

export function TrackPageView({ event, data }: TrackPageViewProps) {
  useEffect(() => {
    track(event, data);
  }, [event, data]);

  return null;
}
