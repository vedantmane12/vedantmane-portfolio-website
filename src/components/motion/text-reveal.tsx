"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type TextRevealProps = {
  text: string;
  className?: string;
  /** Seconds before the first word moves. */
  delay?: number;
  /** Words matched here get the accent treatment. Case-insensitive. */
  accentWords?: string[];
  /**
   * Phase offset for the accent glint, in seconds. The sheen loops forever, so
   * this shifts where in the cycle it starts: staggering it across stacked
   * lines makes the light travel down them instead of flashing in unison.
   */
  accentDelay?: number;
};

/**
 * Headline animation: each word rises out of its own clipped mask.
 *
 * The full string is emitted as a single visually-hidden <span> so screen
 * readers and crawlers get clean, unfragmented text, while the animated
 * per-word spans are hidden from the accessibility tree.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  accentWords = [],
  accentDelay = 0,
}: TextRevealProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");
  const accents = new Set(accentWords.map((w) => w.toLowerCase()));

  const isAccent = (word: string) =>
    accents.has(word.toLowerCase().replace(/[^a-z0-9]/gi, ""));

  if (reduceMotion) {
    return (
      <span className={className}>
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className={cn(isAccent(word) && "font-display italic text-accent")}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden align-bottom pb-[0.12em]"
          >
            <motion.span
              className={cn(
                "inline-block",
                // The sheen is a running animation, so it only goes on when
                // motion is allowed. Frozen mid-sweep it would leave the word
                // an arbitrary shade of the gradient.
                isAccent(word) &&
                  "font-display italic text-accent-sheen [padding-right:0.06em]",
              )}
              style={
                isAccent(word) && accentDelay
                  ? { animationDelay: `${accentDelay}s` }
                  : undefined
              }
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.9,
                delay: delay + i * 0.055,
                ease: EASE,
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </span>
  );
}
