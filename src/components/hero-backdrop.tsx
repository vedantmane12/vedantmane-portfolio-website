"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The hero's background, built as structure rather than atmosphere: a measured
 * grid with column rules that draw themselves in, and cells that light and fade
 * like partitions being written to.
 *
 * The rules are positioned inside `container-page`, so they land on the same
 * column edges the content and the pipeline band use. That is the point: the
 * backdrop is the layout showing its own working, not decoration behind it.
 *
 * Cell coordinates are grid indices rather than percentages, so every pulse
 * lands between two lines at any viewport width. They are hardcoded rather than
 * random: a random layout would differ between the server and client render and
 * trip hydration.
 *
 * Rows stay shallow and columns cluster low because `.grid-mask` is brightest
 * at the top centre and gone by roughly 45% of the height. Low column indices
 * keep a few cells visible on a phone; high ones fill a wide display.
 */
type Cell = {
  col: number;
  row: number;
  /** Seconds for one fade up and down. */
  duration: number;
  delay: number;
  /** Dead time before the cell fires again. */
  rest: number;
};

const CELLS: Cell[] = [
  { col: 2, row: 1, duration: 3.8, delay: 0.4, rest: 4.2 },
  { col: 3, row: 3, duration: 4.6, delay: 2.1, rest: 3.1 },
  { col: 1, row: 0, duration: 3.4, delay: 5.3, rest: 5.4 },
  { col: 5, row: 2, duration: 5.2, delay: 1.2, rest: 2.6 },
  { col: 4, row: 4, duration: 4.1, delay: 6.8, rest: 4.9 },
  { col: 7, row: 1, duration: 3.6, delay: 3.4, rest: 3.7 },
  { col: 8, row: 3, duration: 4.9, delay: 0.9, rest: 5.1 },
  { col: 9, row: 0, duration: 4.3, delay: 7.6, rest: 2.9 },
  { col: 11, row: 2, duration: 3.9, delay: 2.8, rest: 4.4 },
  { col: 10, row: 4, duration: 5.5, delay: 5.9, rest: 3.3 },
  { col: 12, row: 1, duration: 4.4, delay: 1.7, rest: 5.6 },
  { col: 14, row: 3, duration: 3.5, delay: 4.6, rest: 3.8 },
  { col: 15, row: 0, duration: 5.0, delay: 0.2, rest: 4.7 },
  { col: 16, row: 2, duration: 4.2, delay: 6.1, rest: 2.7 },
  { col: 18, row: 1, duration: 3.7, delay: 3.9, rest: 5.2 },
  { col: 19, row: 3, duration: 4.8, delay: 7.2, rest: 3.5 },
];

/** Peak fill. Any higher and the cells compete with the headline. */
const PEAK_OPACITY = 0.11;

/** Column edges of a four-column artboard, as percentages of the content box. */
const RULES = [0, 25, 50, 75, 100];

/**
 * The rules fade sooner than the grid, which carries its own fade in
 * `.grid-mask`.
 *
 * A 1px vertical line is nearly invisible on its own at this colour, but it
 * runs the full height of the hero, and that accumulated length is what made
 * the columns read as prominent rather than as a faint underlay. Cutting the
 * fade short keeps them where they do their job, behind the type at the top,
 * and clears them out of the lower half where they were crossing empty space.
 */
const RULE_FADE =
  "linear-gradient(to bottom, #000 0%, #000 22%, transparent 68%)";

export function HeroBackdrop() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20">
      <div className="grid-mask absolute inset-0">
        <div className="grid-lines absolute inset-0 opacity-40" />

        {!reduceMotion &&
          CELLS.map((cell) => (
            <motion.span
              key={`${cell.col}-${cell.row}`}
              className="absolute bg-accent"
              style={{
                // Inset by the 1px line so the fill sits inside the cell rather
                // than painting over its own borders.
                left: `calc(var(--grid-cell) * ${cell.col} + 1px)`,
                top: `calc(var(--grid-cell) * ${cell.row} + 1px)`,
                width: "calc(var(--grid-cell) - 1px)",
                height: "calc(var(--grid-cell) - 1px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, PEAK_OPACITY, 0] }}
              transition={{
                duration: cell.duration,
                delay: cell.delay,
                repeat: Infinity,
                repeatDelay: cell.rest,
                ease: "easeInOut",
              }}
            />
          ))}
      </div>

      {/* Column rules, aligned to the content box rather than the viewport. */}
      <div className="container-page absolute inset-x-0 top-0 h-full">
        <div className="relative h-full" style={{ maskImage: RULE_FADE }}>
          {RULES.map((left, i) => (
            <motion.span
              key={left}
              className="absolute top-0 h-full w-px origin-top bg-border/50"
              style={{ left: `${left}%` }}
              initial={reduceMotion ? undefined : { scaleY: 0, opacity: 0 }}
              animate={reduceMotion ? undefined : { scaleY: 1, opacity: 1 }}
              transition={{
                duration: 1.4,
                delay: 0.15 + i * 0.08,
                ease: EASE,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
