"use client";

import {
  Children,
  useEffect,
  useRef,
  type ElementType,
  type ReactNode
} from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsapClient";

/**
 * Scroll-triggered entrance primitives.
 *
 * <Reveal>          — fade + rise (+ optional blur-to-sharp) on enter.
 * <RevealLines>     — the signature move: each child is one deliberate
 *                     line of a headline, masked and swept up in stagger
 *                     like light surfacing through water.
 *
 * Both render their resting (visible) state for reduced-motion visitors
 * and for bots — content is never hidden from crawlers because the
 * hidden state is applied client-side only, before first paint of the
 * animation, not in the server HTML.
 */

const EASE = "power4.out";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Seconds to hold before entering, once triggered. */
  delay?: number;
  /** Pixels risen from. */
  y?: number;
  /** Add a blur-to-sharp focus pull. */
  blur?: boolean;
  /** Stagger direct children instead of moving as one block. */
  stagger?: number;
};

export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  y = 32,
  blur = false,
  stagger
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const targets = stagger != null ? Array.from(el.children) : el;
    const from: gsap.TweenVars = { opacity: 0, y };
    const to: gsap.TweenVars = {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: EASE,
      delay,
      stagger: stagger ?? 0,
      scrollTrigger: {
        trigger: el,
        start: "top 86%",
        once: true
      }
    };
    if (blur) {
      from.filter = "blur(10px)";
      to.filter = "blur(0px)";
    }

    const tween = gsap.fromTo(targets, from, to);
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, y, blur, stagger]);

  // Polymorphic escape hatch — JSX can't narrow a dynamic ElementType.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = Tag as any;
  return (
    <Comp ref={ref} className={className}>
      {children}
    </Comp>
  );
}

type RevealLinesProps = {
  /** Each child = one line. Wrap words you art-direct onto lines. */
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Seconds between lines. */
  stagger?: number;
};

export function RevealLines({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  stagger = 0.12
}: RevealLinesProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const inners = el.querySelectorAll<HTMLElement>("[data-reveal-line]");
    if (!inners.length) return;

    const tween = gsap.fromTo(
      inners,
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: 1.25,
        ease: EASE,
        delay,
        stagger,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true
        }
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, stagger]);

  // Polymorphic escape hatch — JSX can't narrow a dynamic ElementType.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = Tag as any;
  return (
    <Comp ref={ref} className={className}>
      {Children.map(children, (line) => (
        <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <span data-reveal-line className="block will-change-transform">
            {line}
          </span>
        </span>
      ))}
    </Comp>
  );
}
