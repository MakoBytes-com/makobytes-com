"use client";

import { useEffect, useRef } from "react";
import { sessionId } from "./session-id";

/**
 * Drop this once into any page tree. On mount it fires a single
 * /api/track call with type="pageview" and a per-route alias like
 * "pageview_promptpixel". Uses fetch with keepalive so the request
 * doesn't get cancelled if the user navigates away mid-flight.
 */
export function TrackPageView({
  type = "pageview",
  page,
}: {
  type?: string;
  page?: string;
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const path =
      page || (typeof window !== "undefined" ? window.location.pathname : "/");

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        page: path,
        sessionId: sessionId(),
        referrer: typeof document !== "undefined" ? document.referrer : "",
      }),
      keepalive: true,
    }).catch(() => {
      // Silent — analytics must never break the user experience
    });
  }, [type, page]);

  return null;
}
