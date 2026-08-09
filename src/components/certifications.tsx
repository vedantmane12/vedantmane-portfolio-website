"use client";

import { Fragment, useId, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { specializations, standaloneCertificates } from "@/content/site";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * One card shape for every credential, so a programme and a single course are
 * not two visual languages on the same row.
 *
 * The hierarchy is carried by one thing only: a card that expands contains
 * courses, a card that does not is a course. Nothing else differs, which makes
 * the nesting readable without a legend.
 */
function CredentialCard({
  issuer,
  issued,
  title,
  summary,
  verify,
  action,
  active = false,
  className,
}: {
  issuer: string;
  issued: string;
  title: string;
  summary: string;
  verify: string;
  /** The expander, for credentials that contain other credentials. */
  action?: ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border bg-surface p-6 transition-colors duration-500 sm:p-7",
        active ? "border-accent/50" : "border-border hover:border-accent/40",
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
          {issuer}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
          {issued}
        </p>
      </div>

      <h4 className="mt-3 text-lg font-medium tracking-[-0.015em]">{title}</h4>

      <p className="mt-2.5 text-pretty text-[13px] leading-relaxed text-muted">
        {summary}
      </p>

      {/* Footer pinned to the bottom, so the actions line up across a row even
          when the summaries differ in length. */}
      <div className="mt-5 flex flex-wrap items-center gap-2 pt-1 sm:mt-auto">
        {action}
        <a
          href={verify}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 px-2 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent transition-colors duration-300 hover:text-foreground"
        >
          Verify
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          >
            ↗
          </span>
        </a>
      </div>
    </div>
  );
}

/**
 * Programme certificates with their component course certificates.
 *
 * An earlier version expanded each card in place, which put ten rows with
 * wrapping titles into a third-width column and made one card taller than the
 * three degrees above it. The courses now open in a single shared panel across
 * the full section width, where ten of them lay out as four short rows, and
 * only one programme can be open at a time.
 *
 * All panels stay mounted and collapse by animating height to zero, so every
 * course title and verification link is in the served HTML for crawlers.
 * `inert` removes the closed ones from the tab order and accessibility tree.
 */
export function Certifications() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();
  const reduceMotion = useReducedMotion();

  const total =
    specializations.length +
    specializations.reduce(
      (sum, item) =>
        sum + item.courses.length + (item.alsoAwarded?.length ?? 0),
      0,
    ) +
    standaloneCertificates.length;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 className="text-[clamp(1.4rem,3vw,1.9rem)] font-medium tracking-[-0.025em]">
          Certifications
        </h3>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
          {total} certificates, all verifiable
        </p>
      </div>

      {/* Each panel is a sibling of its own card, and explicit grid placement
          gives the two arrangements the layout needs.
          Stacked below lg, the panel simply follows the card that opened it.
          At lg the three cards are pinned to row one and all three panels to
          row two spanning every column, so they share one area beneath the row
          and only the open one has any height. Rendering the panels after the
          whole group instead, as an earlier version did, meant tapping the
          first card on a phone opened a panel 435px further down, past two
          other cards and usually off-screen: it read as the button doing
          nothing at all. */}
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {specializations.map((item, i) => {
          const open = openIndex === i;

          return (
            <Fragment key={item.verify}>
              <CredentialCard
                className="lg:row-start-1"
                issuer={item.issuer}
                issued={item.issued}
                title={item.name}
                summary={item.summary}
                verify={item.verify}
                active={open}
                action={
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    aria-controls={`${baseId}-${i}`}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300",
                      open
                        ? "border-accent text-accent"
                        : "border-border text-muted hover:border-accent hover:text-accent",
                    )}
                  >
                    {open ? "Hide" : `${item.courses.length} courses`}
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className={`size-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                }
              />

              <motion.div
                id={`${baseId}-${i}`}
                inert={openIndex !== i}
                initial={false}
                animate={{
                  height: openIndex === i ? "auto" : 0,
                  opacity: openIndex === i ? 1 : 0,
                }}
                transition={
                  reduceMotion ? { duration: 0 } : { duration: 0.4, ease: EASE }
                }
                className="overflow-hidden lg:col-span-3 lg:col-start-1 lg:row-start-2"
              >
                <div className="rounded-2xl border border-border bg-surface-raised p-6 sm:p-7">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
                    {item.name} · {item.courses.length} course certificates
                  </p>

                  <ol className="mt-5 grid gap-x-8 gap-y-px sm:grid-cols-2 lg:grid-cols-3">
                    {item.courses.map((course, n) => (
                      <li
                        key={course.verify}
                        className="flex items-baseline gap-3 border-b border-border py-3"
                      >
                        <span className="font-mono text-[10px] tabular-nums text-subtle">
                          {String(n + 1).padStart(2, "0")}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-pretty text-[13px] leading-snug">
                            {course.title}
                            {course.honors && (
                              <span className="ml-2 rounded-full border border-highlight/40 px-1.5 py-0.5 align-middle font-mono text-[9px] uppercase tracking-[0.12em] text-highlight">
                                Honors
                              </span>
                            )}
                          </span>
                          <span className="mt-1 flex items-center gap-2.5">
                            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">
                              {course.issued}
                            </span>
                            <a
                              href={course.verify}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted underline decoration-border underline-offset-4 transition-colors duration-300 hover:text-accent hover:decoration-accent"
                            >
                              Verify
                            </a>
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>

                  {/* Interim certificates awarded for subsets of the courses above.
                Separately verifiable, but not separate work. */}
                  {item.alsoAwarded && (
                    <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle sm:whitespace-nowrap sm:pt-[0.35rem]">
                        Also awarded
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {item.alsoAwarded.map((extra) => (
                          <a
                            key={extra.verify}
                            href={extra.verify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
                          >
                            {extra.name}
                            <span
                              aria-hidden="true"
                              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            >
                              ↗
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </Fragment>
          );
        })}
      </div>

      {/* Standalone courses, same card, no expander because there is nothing
          nested. The top margin matches the grid gap, so with every panel closed
          the six cards read as one continuous grid. */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {standaloneCertificates.map((cert) => (
          <CredentialCard
            key={cert.verify}
            issuer={cert.issuer}
            issued={cert.issued}
            title={cert.title}
            summary={cert.summary}
            verify={cert.verify}
            action={
              <span className="inline-flex items-center rounded-full border border-border/60 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
                Single course
              </span>
            }
          />
        ))}
      </div>
    </div>
  );
}
