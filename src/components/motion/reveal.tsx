"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ElementType, ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait before this element starts animating. */
  delay?: number;
  /** Pixels travelled on the y-axis. Negative values enter from above. */
  y?: number;
  className?: string;
  as?: ElementType;
};

/**
 * Fades and lifts a block into view the first time it crosses the viewport.
 * Children are server-rendered, so the text is in the HTML regardless of JS.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -8% 0px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Parent wrapper that releases its children one after another.
 * Pair with <RevealItem>.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  as = "div",
}: Omit<RevealProps, "y"> & { stagger?: number }) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px -5% 0px" }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  y = 20,
  as = "div",
}: Omit<RevealProps, "delay"> & { y?: number }) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const item: Variants = {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
  };

  return (
    <MotionTag className={className} variants={item}>
      {children}
    </MotionTag>
  );
}
