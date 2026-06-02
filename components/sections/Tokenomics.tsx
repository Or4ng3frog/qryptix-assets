'use client';

import { useRef } from 'react';
import { useInView, useScroll, useTransform, motion, useReducedMotion, type MotionValue } from 'framer-motion';
import { ALLOCATIONS } from '@/lib/config';
import { SectionHeading } from './SectionHeading';
import { Stagger, StaggerItem } from '@/components/motion';

const R = 70;
const C = 2 * Math.PI * R;
const OR = 92; // outer scroll-progress ring radius
const OC = 2 * Math.PI * OR;

function Donut({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<SVGSVGElement>(null);
  const visible = useInView(ref, { once: true, margin: '0px 0px -80px 0px' });
  const reduce = useReducedMotion();
  // Outer ring fills as the section scrolls through the viewport.
  const ringOffset = useTransform(progress, [0.08, 0.85], [OC, 0]);

  let offset = 0;
  return (
    <svg ref={ref} viewBox="0 0 200 200" className="w-72 h-72 -rotate-90">
      {/* outer scroll-progress ring */}
      <circle cx="100" cy="100" r={OR} fill="none" stroke="rgba(244,241,234,0.06)" strokeWidth="2" />
      <motion.circle
        cx="100"
        cy="100"
        r={OR}
        fill="none"
        stroke="#E3B341"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={OC}
        style={{ strokeDashoffset: reduce ? 0 : ringOffset }}
      />

      {/* allocation track + segments */}
      <circle cx="100" cy="100" r={R} fill="none" stroke="#15151A" strokeWidth="26" />
      {ALLOCATIONS.map((a) => {
        const len = (a.pct / 100) * C;
        const dash = visible ? `${len} ${C - len}` : `0 ${C}`;
        const seg = (
          <circle
            key={a.name}
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke={a.color}
            strokeWidth="26"
            strokeDasharray={dash}
            strokeDashoffset={-offset}
            style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.16,1,0.3,1)' }}
          />
        );
        offset += len;
        return seg;
      })}
    </svg>
  );
}

function AllocRow({ a }: { a: (typeof ALLOCATIONS)[number] }) {
  return (
    <StaggerItem
      className="flex items-center gap-4 rounded-2xl glass-luxe px-5 py-4 transition-colors hover:border-gold/25"
      y={18}
    >
      <span className="h-3 w-3 rounded shrink-0" style={{ background: a.color }} />
      <div className="flex-grow">
        <div className="text-sm font-grotesk font-medium text-ivory">{a.name}</div>
        <div className="text-xs text-taupe mt-0.5">{a.desc}</div>
      </div>
      <span className="font-mono font-semibold text-gold text-lg">{a.pct}%</span>
    </StaggerItem>
  );
}

export function Tokenomics() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section ref={sectionRef} id="tokenomics" className="mx-auto max-w-7xl px-6 py-28 scroll-mt-24">
      <SectionHeading
        tag="Tokenomics"
        title={
          <>
            1B fixed supply.
            <br />
            <span className="text-gold">30% to mining rewards.</span>
          </>
        }
        subtitle="Every allocation is hard-coded in the contract on Base. Vesting and lock schedules are enforced on-chain — not promises."
      />
      <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:items-start">
        {/* Sticky cinematic donut — pins while the allocations scroll past */}
        <div className="lg:sticky lg:top-28 self-start">
          <div className="relative flex flex-col items-center justify-center glass-luxe rounded-3xl p-10">
            <div className="relative">
              <Donut progress={scrollYProgress} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[10px] uppercase tracking-eyebrow text-taupe">Total Supply</div>
                <div className="font-serif font-semibold text-5xl text-gold mt-1">1B</div>
                <div className="text-sm text-ash mt-1">QTX · Fixed</div>
              </div>
            </div>
            <p className="text-xs text-taupe mt-6">Allocations hard-coded in the contract</p>
          </div>
        </div>
        <Stagger className="flex flex-col gap-2.5" gap={0.05}>
          {ALLOCATIONS.map((a) => (
            <AllocRow key={a.name} a={a} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
