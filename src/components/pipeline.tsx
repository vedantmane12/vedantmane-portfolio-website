"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { pipeline, pipelineIntro } from "@/content/site";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** How long each stage stays lit before the highlight moves on. */
const CYCLE_MS = 2600;
/** Packets in flight per leg. Two reads as a stream; more reads as noise. */
const PACKETS_PER_LEG = 2;
/** Seconds for one packet to cross a single leg. */
const LEG_SECONDS = 2.4;

/**
 * The hero's data pipeline: six stages, a live packet stream running left to
 * right, and a highlight that walks the stages on a timer.
 *
 * Laid out in HTML rather than SVG. The stages carry real typography and have
 * to reflow across breakpoints, and a viewBox would fight both. Legs are drawn
 * per column instead of as one rail, so each leg spans exactly from its own
 * node to the next one. That relies on the grid having no column gap, with the
 * breathing room coming from padding inside each cell.
 *
 * Below `lg` the band scrolls horizontally instead of collapsing. Every stage
 * keeps its full text in one place in the DOM, so there is no duplicated copy
 * for screen readers and nothing hidden from crawlers.
 */
export function Pipeline() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % pipeline.length),
      CYCLE_MS,
    );
    return () => clearInterval(id);
  }, [reduceMotion]);

  const lastIndex = pipeline.length - 1;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-6 border-b border-border pb-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-highlight">
          End to end
        </span>
        <span className="hidden text-[13px] text-muted sm:block">
          {pipelineIntro}
        </span>
      </div>

      {/* Wraps below lg rather than panning.
          Forcing six stages across a narrow screen needed a 58rem minimum
          width, which put 976px of content inside a 753px tablet and cut the
          last stages off with no affordance: it read as the band overflowing
          rather than as something to scroll. Two columns on a phone and three
          on a tablet fit without any horizontal scrolling, and the rail, which
          only makes sense along a single row, is kept for lg and up. The gap is
          removed at lg because each leg spans its own column to reach the next
          dot, and a column gap would break the line. */}
      <div>
        <ol className="mt-7 grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-6 lg:gap-0">
          {pipeline.map((item, i) => {
            // With motion off there is no walking highlight, so every stage
            // reads as lit rather than five looking disabled.
            const isActive = reduceMotion || i === active;

            return (
              <li key={item.stage} className="relative lg:pr-8">
                {/* Every stage carries a leg, the last one included: it runs
                    out to the container edge and terminates in a chevron. A
                    pipeline needs an outlet, and stopping the rail at the final
                    dot left a column of dead space that read as truncation
                    rather than as an ending. Packets brighten along the run, so
                    the stream reads as raw data turning into something usable. */}
                <span
                  aria-hidden="true"
                  // Brighter than `border`, which disappears against the
                  // hero's near-black canvas at 1px.
                  className="absolute left-0 top-[3.5px] hidden h-px w-full bg-subtle/30 lg:block"
                >
                  {!reduceMotion &&
                    Array.from({ length: PACKETS_PER_LEG }).map((_, k) => (
                      <motion.span
                        key={k}
                        className="absolute top-1/2 size-[3px] rounded-full bg-accent"
                        style={{
                          marginTop: "-1.5px",
                          opacity: 0.28 + (i / lastIndex) * 0.6,
                        }}
                        initial={{ left: "-3%" }}
                        animate={{ left: "103%" }}
                        transition={{
                          duration: LEG_SECONDS,
                          delay: i * 0.3 + k * (LEG_SECONDS / PACKETS_PER_LEG),
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    ))}

                  {i === lastIndex && (
                    // Chevron built from two borders on a rotated square, so
                    // the outlet costs no extra markup or an SVG.
                    <span className="absolute right-0 top-1/2 -mt-[3.5px] block size-[6px] rotate-45 border-r border-t border-accent/70" />
                  )}
                </span>

                <motion.span
                  aria-hidden="true"
                  className={cn(
                    "relative block size-2 rounded-full transition-colors duration-500",
                    isActive ? "bg-accent" : "bg-subtle/60",
                  )}
                  animate={
                    reduceMotion ? undefined : { scale: isActive ? 1.4 : 1 }
                  }
                  transition={{ duration: 0.55, ease: EASE }}
                  style={{
                    boxShadow: isActive ? "0 0 0 5px var(--glow)" : undefined,
                  }}
                />

                <p
                  className={cn(
                    "mt-4 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-500",
                    isActive ? "text-accent" : "text-muted",
                  )}
                >
                  {item.stage}
                </p>

                <p
                  className={cn(
                    // Between lg and xl the columns are narrow enough that
                    // "Software Engineer" takes two lines while the rest take
                    // one, which knocked its description out of line with the
                    // others. Reserve the second line only in that range: at xl
                    // the container caps and every role fits on one line.
                    "mt-2 text-base font-medium tracking-[-0.01em] transition-colors duration-500 lg:min-h-12 xl:min-h-0",
                    isActive ? "text-foreground" : "text-muted",
                  )}
                >
                  {item.role}
                </p>

                {/* `subtle` measures under 4:1 against the hero canvas at this
                    size, so the supporting line runs at `muted` and leans on
                    size and weight for hierarchy instead of on low contrast. */}
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  {item.detail}
                </p>

                {/* Fills over one cycle, so the timer is visible rather than
                    something the highlight does for no apparent reason. */}
                <span
                  aria-hidden="true"
                  className="mt-3 block h-px w-full max-w-[3rem] bg-subtle/25"
                >
                  {isActive && !reduceMotion && (
                    <motion.span
                      key={active}
                      className="block h-full origin-left bg-accent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: CYCLE_MS / 1000,
                        ease: "linear",
                      }}
                    />
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
