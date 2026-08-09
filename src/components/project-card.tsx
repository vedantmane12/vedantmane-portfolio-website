"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import type { MouseEvent } from "react";
import type { Project } from "@/content/site";
import {
  PROJECT_IMAGE_FILTER,
  PROJECT_IMAGE_WASH,
  projectImageSrc,
} from "@/lib/project-media";
import { cn } from "@/lib/utils";

/** Chips beyond this collapse into a count. Six wrapped to three rows. */
const MAX_CHIPS = 3;

/**
 * Project card, ordered metric first.
 *
 * The previous version led with four lines of prose and put the headline figure
 * near the bottom in small type, which is the wrong way round: the number is the
 * strongest thing on the card and the only part that is hard to claim without
 * evidence. Now a discipline tag orients the reader, the figure carries the
 * weight, and the prose is one short line written for this width rather than a
 * full sentence reflowed into it.
 *
 * The metric is passed in rather than read here, so the long-form project
 * details file stays out of the client bundle.
 */
export function ProjectCard({
  project,
  metric,
  metricLabel,
  featured = false,
}: {
  project: Project;
  metric?: string;
  metricLabel?: string;
  featured?: boolean;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlight = useMotionTemplate`radial-gradient(22rem circle at ${mouseX}px ${mouseY}px, var(--glow), transparent 75%)`;

  const shown = project.stack.slice(0, MAX_CHIPS);
  const overflow = project.stack.length - shown.length;

  return (
    <motion.article
      // Anchor target for the coursework links in the Education section.
      id={`project-${project.slug}`}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={cn(
        "group relative isolate flex h-full scroll-mt-24 flex-col overflow-hidden rounded-2xl border border-border bg-surface p-7 transition-colors duration-500 hover:border-accent/40",
        featured && "sm:p-9",
      )}
    >
      <motion.div
        aria-hidden="true"
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Decorative: the title beside it already names the project. */}
      <div className="relative -mx-7 -mt-7 mb-7 overflow-hidden border-b border-border sm:-mx-9 sm:-mt-9">
        {/* The featured card is twice as wide, so a 21:9 banner stood 332px
            tall against 190px for a 16:9 in a single column. Grid rows stretch,
            which handed that 142px difference to the card beside it as dead
            space. Going ultrawide brings the two to within a few pixels and
            reads as a deliberate cinematic crop rather than a compromise. */}
        <div
          className={cn(
            "relative w-full",
            featured ? "aspect-[32/9]" : "aspect-[16/9]",
          )}
        >
          <Image
            src={projectImageSrc(project.slug)}
            alt=""
            fill
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
            className={cn(
              "object-cover transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.04] group-hover:grayscale-0 group-hover:saturate-100",
              PROJECT_IMAGE_FILTER,
            )}
          />
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 transition-opacity duration-700 group-hover:opacity-40",
              PROJECT_IMAGE_WASH,
            )}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-surface via-surface/25 to-transparent"
          />
        </div>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-highlight">
        {project.discipline}
      </p>

      {metric && (
        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p
              className={cn(
                "font-mono tracking-[-0.02em] text-accent",
                featured ? "text-4xl sm:text-5xl" : "text-3xl",
              )}
            >
              {metric}
            </p>
            {metricLabel && (
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                {metricLabel}
              </p>
            )}
          </div>
          <span
            aria-hidden="true"
            className="mt-2 shrink-0 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
          >
            →
          </span>
        </div>
      )}

      {/* Copy follows the metric immediately. An earlier version pushed this
          block to the bottom to line the chip rows up across a row of cards,
          which parked the leftover height in the middle of the card and left a
          hole between the figure and the title. Only the chips are pinned now,
          so the variable space sits above a footer row and reads as breathing
          room rather than as a gap. */}
      <h3
        className={cn(
          "mt-6 font-medium tracking-[-0.02em]",
          featured ? "text-2xl sm:text-3xl" : "text-lg",
        )}
      >
        <Link href={`/projects/${project.slug}`}>
          {/* Stretched link keeps the whole card clickable without nesting anchors. */}
          <span className="absolute inset-0 z-10" aria-hidden="true" />
          {project.title}
        </Link>
      </h3>

      <p
        className={cn(
          "mt-2 text-pretty leading-relaxed text-muted",
          featured ? "text-base" : "text-sm",
        )}
      >
        {project.cardLine}
      </p>

      <ul className="mt-auto flex flex-wrap items-center gap-2 pt-6">
        {shown.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-subtle transition-colors duration-500 group-hover:border-accent/25"
          >
            {tech}
          </li>
        ))}
        {overflow > 0 && (
          <li className="font-mono text-[11px] text-subtle">
            +{overflow}
            <span className="sr-only"> more technologies</span>
          </li>
        )}
      </ul>
    </motion.article>
  );
}
