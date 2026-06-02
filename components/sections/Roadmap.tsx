'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion';
import { ROADMAP } from '@/lib/config';
import { SectionHeading } from './SectionHeading';

const STATUS_STYLE: Record<string, string> = {
  done: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  now: 'bg-gradient-to-r from-gold/15 to-gold-deep/10 text-gold-bright border-gold/30',
  planned: 'bg-white/5 text-taupe border-white/10',
};
const STATUS_LABEL: Record<string, string> = { done: 'Done', now: 'Now', planned: 'Planned' };

function RoadmapRow({ item, i }: { item: (typeof ROADMAP)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -120px 0px' });
  const reduce = useReducedMotion();

  return (
    <div ref={ref} className="relative">
      {/* Node on the rail */}
      <motion.span
        className="absolute left-5 top-7 -translate-x-1/2 z-10 flex h-3.5 w-3.5 items-center justify-center rounded-full border"
        initial={false}
        animate={
          inView
            ? { backgroundColor: '#E3B341', borderColor: 'rgba(227,179,65,0.5)', boxShadow: '0 0 16px 3px rgba(227,179,65,0.45)' }
            : { backgroundColor: '#15151A', borderColor: 'rgba(244,241,234,0.15)', boxShadow: '0 0 0px 0px rgba(227,179,65,0)' }
        }
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />

      {/* Card */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, x: 36 }}
        animate={inView ? { opacity: 1, x: 0 } : reduce ? { opacity: 0 } : { opacity: 0, x: 36 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`ml-12 rounded-3xl glass-luxe p-6 ${
          item.status === 'now' ? 'border-gold/30 bg-gradient-to-r from-gold/[0.06] to-transparent' : ''
        }`}
      >
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="font-serif font-medium text-ivory">{item.period}</span>
          <span className={`inline-block rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-eyebrow ${STATUS_STYLE[item.status]}`}>
            {STATUS_LABEL[item.status]}
          </span>
        </div>
        <h3 className="font-serif font-medium text-lg text-ivory mb-3">{item.title}</h3>
        <ul className="space-y-1.5">
          {item.items.map((t) => (
            <li key={t} className="flex gap-2.5 text-sm text-ash">
              <span className="text-gold mt-0.5">→</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

export function Roadmap() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.75', 'end 0.55'],
  });
  const fillHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="roadmap" className="mx-auto max-w-5xl px-6 py-28 scroll-mt-24">
      <SectionHeading
        tag="Roadmap"
        title={<>Where we are. Where we&apos;re going.</>}
        subtitle="Color-coded honestly: green = done & verifiable, gold = currently active, gray = planned. No vague filler."
      />
      <div ref={ref} className="relative">
        {/* Rail track */}
        <div className="absolute left-5 top-2 bottom-2 w-px -translate-x-1/2 bg-white/[0.08]" />
        {/* Gold fill advances with scroll */}
        <motion.div
          style={{ height: reduce ? '100%' : fillHeight }}
          className="absolute left-5 top-2 w-px -translate-x-1/2 bg-gold-gradient"
        />
        <div className="flex flex-col gap-5">
          {ROADMAP.map((item, i) => (
            <RoadmapRow key={item.period} item={item} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
