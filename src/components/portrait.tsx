"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { person } from "@/content/site";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Hero portrait.
 *
 * The source is 1206x2144, far taller than the frame, so `object-cover` in a 4:5
 * box trims roughly 15% from the top and bottom. That lands deliberately: it
 * keeps headroom above the subject and crops away the bench below.
 *
 * Desaturated slightly at rest, since the photo's teal glass background would
 * otherwise fight the blue accent, and restored to full colour on hover.
 */
export function Portrait({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={className}>
      <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Slides up inside a fixed frame rather than scaling the frame itself,
            so the photo is never stretched during the reveal. */}
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? undefined : { y: "101%" }}
          animate={reduceMotion ? undefined : { y: "0%" }}
          transition={{ duration: 1.1, delay: 0.45, ease: EASE }}
        >
          <Image
            src="/vedant-mane.jpg"
            alt={`${person.name}, ${person.role}`}
            fill
            // Above the fold on desktop, so it should not wait on lazy loading.
            priority
            sizes="(min-width: 1280px) 20rem, (min-width: 1024px) 17rem, 16rem"
            className="object-cover object-center saturate-[0.85] transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.03] group-hover:saturate-100"
          />
        </motion.div>

        {/* Blends the lower edge into the canvas, so the photo sits in the page
            rather than on top of it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent"
        />
      </div>
    </div>
  );
}
