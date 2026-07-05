"use client";

import { ReactNode, MouseEvent } from "react";
import { sessionId } from "./session-id";

/**
 * Lightweight wrapper around an <a> that fires an analytics event
 * before navigating. Used on the download / buy / CTA buttons.
 */
export function TrackLink({
  href,
  type,
  children,
  className,
  meta,
  newTab = false,
}: {
  href: string;
  type: string;
  children: ReactNode;
  className?: string;
  meta?: Record<string, string>;
  newTab?: boolean;
}) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Fire-and-forget tracking; navigation continues normally
    try {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          page:
            typeof window !== "undefined" ? window.location.pathname : "/",
          meta,
          sessionId: sessionId(),
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // ignore
    }
  };

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}
