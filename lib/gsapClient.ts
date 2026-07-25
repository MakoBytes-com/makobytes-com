"use client";

/**
 * Single GSAP entry point for the whole site — registers ScrollTrigger
 * exactly once. Every motion component imports gsap from here, never
 * from "gsap" directly, so plugin registration can't be missed or doubled.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** True when the visitor asked for reduced motion — every animation
 *  in the site checks this and renders its resting state instead. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };
