'use client';

/**
 * Premium Dark Luxe motion primitives.
 *
 * Shared Framer Motion building blocks for the cinematic rebuild. Every
 * primitive honours `prefers-reduced-motion` — when the user opts out, motion
 * collapses to an instant, transform-free render. See design-system/qryptix/MASTER.md §4.
 */

import { useRef, type ReactNode } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion';

// Luxe easing — slow, weighty, deliberate.
const LUXE_EASE = [0.16, 1, 0.3, 1] as const;

/* ────────────────────────────────────────────────────────────
   Reveal — fade + rise (+ subtle scale) as the element scrolls in
   ──────────────────────────────────────────────────────────── */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
  once = true,
  duration = 0.85,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  duration?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once, margin: '0px 0px -80px 0px' }}
      transition={{ duration, delay, ease: LUXE_EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Stagger — container that reveals its <StaggerItem> children in sequence
   ──────────────────────────────────────────────────────────── */
export function Stagger({
  children,
  className,
  gap = 0.08,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : gap, delayChildren: 0.05 },
    },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '0px 0px -80px 0px' }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();

  const item: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: LUXE_EASE } },
      };

  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   ParallaxLayer — scroll-linked vertical drift for depth.
   `speed` > 0 drifts up as you scroll; negative drifts down.
   ──────────────────────────────────────────────────────────── */
export function ParallaxLayer({
  children,
  className,
  speed = 40,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

export { motion, useReducedMotion, useScroll, useTransform, LUXE_EASE };
