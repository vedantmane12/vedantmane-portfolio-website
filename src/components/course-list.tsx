"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { projects, type Course } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Collapsible coursework list.
 *
 * The courses stay mounted whether open or closed, and collapsing is done by
 * animating height to zero. That keeps every course description in the served
 * HTML for crawlers, which unmounting on collapse would not. `inert` handles
 * the accessibility side, taking the hidden content out of the tab order and
 * the accessibility tree without removing it from the document.
 */
/**
 * Non-letter marks that aren't grades: "S" is the satisfactory mark on
 * Northeastern's zero-credit lab. Everything else is a real grade and gets the
 * accent treatment, including Mumbai's "O" for Outstanding, which is the top
 * of that ten-point scale rather than an also-ran.
 */
const NON_GRADES = new Set(["S", "P", "CR"]);

function GradeBadge({ grade }: { grade: string }) {
  const isLetterGrade = !NON_GRADES.has(grade);

  return (
    <span
      aria-label={isLetterGrade ? `Grade ${grade}` : "Satisfactory"}
      className={cn(
        "shrink-0 rounded-lg border px-2.5 py-1.5 font-mono text-xs font-medium leading-none",
        isLetterGrade
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-border bg-surface-raised text-subtle",
      )}
    >
      {grade}
    </span>
  );
}

export function CourseList({
  courses,
  totalCredits,
}: {
  courses: Course[];
  /** Programme total, where listing every component would be excessive. */
  totalCredits?: number;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const reduceMotion = useReducedMotion();

  const credits =
    totalCredits ?? courses.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="group/toggle inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
      >
        {open ? "Hide coursework" : `Coursework · ${courses.length} courses`}
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

      <motion.div
        id={panelId}
        inert={!open}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
        }
        className="overflow-hidden"
      >
        <ol className="mt-6 space-y-3">
          {courses.map((course) => (
            <li
              // Composite, because the Mumbai degrees use the semester as the
              // code, so neither field is unique on its own.
              key={`${course.code}-${course.title}`}
              className="rounded-xl border border-border bg-surface p-5 transition-colors duration-300 hover:border-accent/40 sm:p-6"
            >
              {/* Code and grade share the top line as the two identifiers,
                  with the term as quieter metadata beside the code. The title
                  then gets a line of its own as the largest element. */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-sm font-medium tracking-tight text-accent">
                    {course.code}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
                    {course.term}
                  </span>
                </div>
                <GradeBadge grade={course.grade} />
              </div>

              <div>
                <h4 className="mt-3 text-lg font-medium tracking-[-0.015em] sm:text-xl">
                  {course.title}
                </h4>
                <p className="mt-2.5 text-pretty text-sm leading-relaxed text-muted">
                  {course.description}
                </p>

                {course.projects && course.projects.length > 0 && (
                  // Label and chips are separate columns, so a wrapped second
                  // row of chips lines up with the first rather than sliding
                  // back under the label.
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-highlight sm:whitespace-nowrap sm:pt-[0.4rem]">
                      Built here
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {course.projects.map((slug) => {
                        const project = projects.find((p) => p.slug === slug);
                        if (!project) return null;
                        return (
                          <a
                            key={slug}
                            href={`#project-${slug}`}
                            className="group/link inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
                          >
                            {project.title}
                            <span
                              aria-hidden="true"
                              className="transition-transform duration-300 group-hover/link:translate-y-0.5"
                            >
                              ↓
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
          {credits} credit hours total
        </p>
      </motion.div>
    </div>
  );
}
