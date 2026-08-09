"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Momentum scrolling. Disabled entirely when the OS asks for reduced motion,
 * which hands scrolling back to the browser rather than easing it.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.11,
        duration: 1.1,
        smoothWheel: true,
        // Touch devices already have native momentum; doubling it feels laggy.
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
