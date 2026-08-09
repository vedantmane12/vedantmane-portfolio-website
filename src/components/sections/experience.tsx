"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { ContactIcon } from "@/components/contact-icon";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { OrgLogo } from "@/components/org-logo";
import { SectionHeading } from "@/components/section-heading";
import { experience } from "@/content/site";

export function Experience() {
  const listRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 70%", "end 60%"],
  });
  // Spring smooths the raw scroll value so the rail doesn't jitter.
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section id="experience" className="hairline scroll-mt-16 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="03 / Experience"
          title="Where I've worked"
          description="Three and a half years across enterprise banking infrastructure, graduate teaching, and applied machine learning."
        />

        {/* Left padding reserves the gutter the logos sit in, centred on the
            rail. Offsets here, on the rail, and on the logo move together. */}
        <div ref={listRef} className="relative mt-14 pl-[4.5rem] sm:pl-28">
          <div
            aria-hidden="true"
            className="absolute left-6 top-3 h-full w-px bg-border sm:left-10"
          >
            <motion.div
              className="h-full w-full origin-top bg-accent"
              style={reduceMotion ? { scaleY: 1 } : { scaleY: progress }}
            />
          </div>

          <RevealGroup as="ol" className="space-y-16" stagger={0.12}>
            {experience.map((role) => (
              <RevealItem
                as="li"
                key={`${role.company}-${role.start}`}
                className="relative"
              >
                {/* The ring punches a gap in the rail behind the logo. */}
                <OrgLogo
                  slug={role.logo}
                  name={role.company}
                  className="absolute left-[-4.5rem] top-0 size-12 ring-4 ring-background sm:left-[-7rem] sm:size-20"
                />

                {/* Header block sits level with the logo so the two read as a
                    unit rather than the text floating beside a loose tile. */}
                <div className="min-h-12 sm:min-h-20 sm:pt-1">
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
                    {role.start} to {role.end}
                  </p>
                  <h3 className="mt-2 text-xl font-medium leading-tight tracking-[-0.02em] sm:text-2xl">
                    {role.role}
                  </h3>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-sm text-accent">
                    {role.company}
                    <span aria-hidden="true" className="text-accent/50">
                      ·
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <ContactIcon
                        name="location"
                        className="size-3 shrink-0 opacity-70"
                      />
                      {role.location}
                    </span>
                  </p>
                </div>

                <p className="mt-5 max-w-2xl text-pretty leading-relaxed text-muted">
                  {role.summary}
                </p>

                <ul className="mt-5 max-w-2xl space-y-2.5">
                  {role.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex gap-3 text-pretty text-sm leading-relaxed text-muted"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1 shrink-0 rounded-full bg-subtle"
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {role.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-subtle"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
