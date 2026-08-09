"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { journey, person } from "@/content/site";

/**
 * Aircraft seen from above, nose right by default and rotated a further quarter
 * turn when the rail runs vertically. The source path points up, so it's rotated
 * inside the viewBox rather than at the call site.
 */
function Airplane({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <g transform="rotate(90 12 12)">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </g>
    </svg>
  );
}

/**
 * The route ahead is dashed like a flight path on a map, and the part already
 * flown fills in solid behind the aircraft. Built from repeating gradients
 * rather than a dashed border so the same technique works on either axis, and
 * so the solid trail can be scaled without stretching the dashes.
 */
const DASH_VERTICAL =
  "repeating-linear-gradient(to bottom, var(--border) 0 4px, transparent 4px 10px)";
const DASH_HORIZONTAL =
  "repeating-linear-gradient(to right, var(--border) 0 5px, transparent 5px 12px)";

export function About() {
  const reduceMotion = useReducedMotion();

  const journeyRef = useRef<HTMLDivElement>(null);

  // Connector between chapters fills as the journey scrolls past.
  const { scrollYProgress: journeyProgress } = useScroll({
    target: journeyRef,
    offset: ["start 80%", "end 55%"],
  });
  const connector = useSpring(journeyProgress, {
    stiffness: 110,
    damping: 30,
    restDelta: 0.001,
  });

  // The plane rides the leading edge of the trail. Percentages are relative to
  // the track element, so this lands exactly where the filled line ends.
  const planePosition = useTransform(connector, [0, 1], ["0%", "100%"]);
  // A little lift as it travels, so it reads as flight rather than a slider.
  const planeLift = useTransform(
    connector,
    [0, 0.25, 0.5, 0.75, 1],
    [0, -3, 1, -3, 0],
  );

  return (
    <section id="about" className="hairline scroll-mt-16 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading eyebrow="01 / About" title="What I build, in four moves" />

        <Reveal>
          <p className="mt-14 max-w-4xl text-pretty text-xl leading-[1.6] sm:text-2xl sm:leading-[1.55]">
            {person.bio}
          </p>
        </Reveal>

        {/* Four chapters. The rail runs horizontally through them on large
            screens and vertically down the left edge when they stack. */}
        <div ref={journeyRef} className="relative mt-20">
          {/* Track shared by the trail and the plane, so both use one
              coordinate space. Vertical when the chapters stack, horizontal
              once they sit side by side. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[0.3125rem] top-2 h-[calc(100%-0.5rem)] w-px lg:left-0 lg:top-[0.4375rem] lg:h-px lg:w-full"
          >
            {/* Unflown route, dashed. One per axis since the gradient
                direction differs. */}
            <div
              className="absolute inset-0 lg:hidden"
              style={{ backgroundImage: DASH_VERTICAL }}
            />
            <div
              className="absolute inset-0 hidden lg:block"
              style={{ backgroundImage: DASH_HORIZONTAL }}
            />

            {/* Separate trails per axis: scaling a 1px dimension on the wrong
                axis would thin the line out instead of shortening it. */}
            <motion.div
              className="absolute inset-0 origin-top bg-accent lg:hidden"
              style={reduceMotion ? { scaleY: 1 } : { scaleY: connector }}
            />
            <motion.div
              className="absolute inset-0 hidden origin-left bg-accent lg:block"
              style={reduceMotion ? { scaleX: 1 } : { scaleX: connector }}
            />

            {/* Plane flies along the track: nose right when horizontal, nose
                down when vertical. */}
            <motion.span
              className="absolute hidden -ml-[0.575rem] -mt-[0.575rem] text-accent lg:block"
              style={
                reduceMotion
                  ? { left: "100%", top: 0 }
                  : { left: planePosition, top: 0, y: planeLift }
              }
            >
              <Airplane className="size-[1.15rem] drop-shadow-[0_0_8px_var(--glow)]" />
            </motion.span>

            <motion.span
              className="absolute -ml-[0.575rem] -mt-[0.575rem] text-accent lg:hidden"
              style={
                reduceMotion
                  ? { top: "100%", left: 0 }
                  : { top: planePosition, left: 0, x: planeLift }
              }
            >
              <Airplane className="size-[1.15rem] rotate-90 drop-shadow-[0_0_8px_var(--glow)]" />
            </motion.span>
          </div>

          <RevealGroup
            as="ol"
            className="grid gap-12 sm:gap-14 lg:grid-cols-4 lg:gap-8"
            stagger={0.12}
          >
            {journey.map((chapter) => (
              <RevealItem
                as="li"
                key={chapter.year}
                // Full-height flex column on desktop so the figure can be
                // pushed to a shared baseline regardless of body length.
                className="group relative pl-9 lg:flex lg:h-full lg:flex-col lg:pl-0 lg:pt-10"
              >
                {/* Node sits on the rail in both orientations. */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-2 size-2.5 rounded-full bg-accent ring-4 ring-background lg:top-0"
                />

                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
                  {chapter.place}
                </p>

                <p className="mt-2 font-display text-5xl italic leading-none text-accent sm:text-6xl">
                  {chapter.year}
                </p>

                <h3 className="mt-5 text-lg font-medium tracking-[-0.015em]">
                  {chapter.title}
                </h3>

                <p className="mt-2.5 text-pretty text-sm leading-relaxed text-muted">
                  {chapter.body}
                </p>

                {/* `self-start` keeps the rule as wide as its text once the
                    parent is a flex column, rather than stretching it. */}
                <div className="mt-5 inline-flex flex-col gap-1 border-t border-border pt-3 transition-colors duration-300 group-hover:border-accent/40 lg:mt-auto lg:self-start lg:pt-4">
                  <span className="font-mono text-sm text-foreground">
                    {chapter.figure}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
                    {chapter.figureLabel}
                  </span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

      </div>
    </section>
  );
}
