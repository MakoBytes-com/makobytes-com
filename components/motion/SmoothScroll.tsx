"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsapClient";

/**
 * Site-wide inertial smooth scroll (Lenis) driven by GSAP's ticker so
 * ScrollTrigger and the scroll position never disagree by a frame.
 *
 * - Renders nothing; mounts behavior only.
 * - `anchors: true` keeps #work / #contact in-page links working.
 * - Reduced-motion visitors keep native browser scrolling untouched.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      anchors: true
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
