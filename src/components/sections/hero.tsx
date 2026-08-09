"use client";

import { useRef, type PointerEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ContactIcon } from "@/components/contact-icon";
import { HeroBackdrop } from "@/components/hero-backdrop";
import { TextReveal } from "@/components/motion/text-reveal";
import { Pipeline } from "@/components/pipeline";
import { Portrait } from "@/components/portrait";
import { heroLines, person, socials } from "@/content/site";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Each clause steps further right than the one above it. The offsets are small
 * and only apply once there is width to spend, but they turn three stacked
 * sentences into a cascade, which is the shape of the thing being described.
 */
const LINE_INDENT = ["lg:pl-0", "lg:pl-[4%]", "lg:pl-[8%]"];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Content drifts up and dissolves slightly slower than the page scrolls.
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  // The pipeline band travels less and fades later, so the two layers separate
  // as you leave rather than moving as one slab.
  const bandY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const bandOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  // Pointer-tracked wash. Parked far off-canvas until the pointer arrives, so
  // it never flashes at the origin on load or on touch devices.
  const px = useMotionValue(-9999);
  const py = useMotionValue(-9999);
  const spotX = useSpring(px, { stiffness: 110, damping: 26, mass: 0.4 });
  const spotY = useSpring(py, { stiffness: 110, damping: 26, mass: 0.4 });
  const spotlight = useMotionTemplate`radial-gradient(22rem 22rem at ${spotX}px ${spotY}px, var(--glow), transparent 68%)`;

  const trackPointer = (event: PointerEvent<HTMLElement>) => {
    // Touch fires this on tap, which would strand the wash mid-canvas. Only
    // touch is excluded: allowing anything else keeps pens and any browser
    // that reports an empty pointerType working.
    if (reduceMotion || event.pointerType === "touch") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set(event.clientX - rect.left);
    py.set(event.clientY - rect.top);
  };

  return (
    <section
      ref={ref}
      id="home"
      onPointerMove={trackPointer}
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-16"
    >
      {/* Glow is held well back now that the grid and rules carry the depth. It
          only keeps the near-black canvas from reading as flat. */}
      <div
        className="glow-field absolute inset-0 -z-30 opacity-40"
        aria-hidden="true"
      />
      <HeroBackdrop />
      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ background: spotlight }}
        />
      )}
      <div
        className="grain pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        aria-hidden="true"
      />

      <motion.div
        style={reduceMotion ? undefined : { y, opacity }}
        className="container-page flex flex-1 flex-col justify-center py-10 sm:py-12"
      >
        {/* Availability left, identity right. Setting the role as margin
            metadata rather than a sentence under the headline is what lets the
            type run at full size without competing with prose. */}
        {/* Stacks rather than hides on small screens: the headline no longer
            names the role, so this is the only place it appears in the hero. */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:gap-6">
          <motion.p
            initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex w-fit items-center gap-2.5 rounded-full border border-border bg-surface/60 px-3.5 py-1.5 text-xs text-muted backdrop-blur"
          >
            {/* Green rather than accent blue: this is a status light, and the
                convention it borrows from is the one everyone already reads. */}
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-positive opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-positive" />
            </span>
            {person.availability}
          </motion.p>

          <motion.p
            initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="shrink-0 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-muted sm:text-right"
          >
            {person.role}
            <span className="mt-0.5 flex items-center gap-1.5 text-subtle sm:justify-end">
              <ContactIcon name="location" className="size-3 shrink-0" />
              {person.location}
            </span>
          </motion.p>
        </div>

        {/* Type left, portrait right, hung off a shared centre line. */}
        <div className="mt-10 grid gap-10 sm:mt-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-center lg:gap-12 xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-16">
          <div>
            {/* Two clamps, because the headline has two jobs. Below lg it owns
                the full width. From lg it shares the row with the photo, so the
                cap comes down to what the narrower column can hold: the longest
                clause measures 855px at 6rem, against a 680px column.
                The floor is what protects small screens, where the vw term never
                binds, and it is set low enough to leave real headroom at 320px
                rather than the 1px it once had. */}
            <h1 className="text-[clamp(1.75rem,8.5vw,6rem)] font-medium leading-[0.98] tracking-[-0.035em] lg:text-[clamp(2.5rem,5.5vw,4.5rem)]">
          {heroLines.map((line, i) => (
            <span key={line.text} className={`block ${LINE_INDENT[i]}`}>
              <TextReveal
                text={line.text}
                accentWords={line.accents}
                delay={0.15 + i * 0.16}
                accentDelay={i * 0.55}
              />
            </span>
          ))}
        </h1>

            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
              className="mt-10 flex flex-col gap-6 sm:mt-12 sm:gap-7"
            >
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform duration-300 hover:scale-[1.02]"
              >
                {/* Accent wipes across on hover. The parent already clipped its
                    overflow for exactly this and had nothing to clip. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-500 ease-out group-hover:translate-x-0"
                />
                <span className="relative z-10">View my work</span>
                <span
                  aria-hidden="true"
                  className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
              <a
                href="#contact"
                className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                Get in touch
              </a>
            </div>

            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={
                      social.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      social.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group inline-flex items-center gap-2 text-muted transition-colors duration-300 hover:text-foreground"
                  >
                    <ContactIcon name={social.icon} className="size-4" />
                    {social.label}
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            </motion.div>
          </div>

          {/* Sits after the copy in the DOM, so on a phone it lands below the
              buttons rather than pushing them past the fold. */}
          {/* Below lg the portrait leads: it is ordered above the headline and
              centred, since in the single-column stack a 16rem portrait sat
              hard left with the rest of the column empty beside it. At lg it
              returns to source order and to the flush-left edge of its own
              column. Ordered in CSS rather than moved in the markup, so the
              heading still precedes the supporting copy in the document. */}
          <Portrait className="order-first mx-auto w-full max-w-[15rem] sm:max-w-[17rem] lg:order-none lg:mx-0 lg:max-w-none" />
        </div>
      </motion.div>

      {/* Pipeline band sits on the fold and does the scroll cue's job: a live
          stream running off the bottom of the screen says "keep going" better
          than a label would, so the old "Scroll" indicator is gone. */}
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
        className="container-page pb-10 sm:pb-12"
      >
        <motion.div
          style={reduceMotion ? undefined : { y: bandY, opacity: bandOpacity }}
        >
          <Pipeline />
        </motion.div>
      </motion.div>
    </section>
  );
}
