'use client';

import { useRef } from 'react';
import { useInView, useScroll, useTransform, motion, useReducedMotion, type MotionValue } from 'framer-motion';
import { ALLOCATIONS } from '@/lib/config';
import { SectionHeading } from './SectionHeading';
import { Stagger, StaggerItem } from '@/components/motion';
import { Icon } from '../Icon';

const R = 70;
const C = 2 * Math.PI * R;
const OR = 92; // outer scroll-progress ring radius
const OC = 2 * Math.PI * OR;

// Utility grouping (by ALLOCATIONS index) — ties supply to function.
const GROUPS = [
  { label: 'Network & rewards', idx: [0, 3], desc: 'Miner + staking emissions', shade: '#F4D88A' },
  { label: 'Liquidity & treasury', idx: [1, 4, 6], desc: 'Treasury · LP · reserve', shade: '#E3B341' },
  { label: 'Community & team', idx: [2, 5, 7], desc: 'Presale · team · advisors', shade: '#9A6F24' },
];

function Donut({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<SVGSVGElement>(null);
  const visible = useInView(ref, { once: true, margin: '0px 0px -80px 0px' });
  const reduce = useReducedMotion();
  const ringOffset = useTransform(progress, [0.08, 0.85], [OC, 0]);

  let offset = 0;
  return (
    <svg ref={ref} viewBox="0 0 200 200" className="w-56 h-56 sm:w-72 sm:h-72 -rotate-90">
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
    <StaggerItem className="rounded-2xl glass-luxe px-5 py-4 transition-colors hover:border-gold/25" y={16}>
      <div className="flex items-center gap-4">
        <span className="h-3 w-3 rounded shrink-0" style={{ background: a.color }} />
        <div className="flex-grow min-w-0">
          <div className="text-sm font-grotesk font-medium text-ivory">{a.name}</div>
          <div className="text-xs text-taupe mt-0.5">{a.desc}</div>
        </div>
        <span className="font-mono font-semibold text-gold text-lg shrink-0">{a.pct}%</span>
      </div>
      {/* share-of-supply bar */}
      <div className="mt-3 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: a.color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${a.pct}%` }}
          viewport={{ once: true, margin: '0px 0px -50px 0px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </StaggerItem>
  );
}

export function Tokenomics() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const groups = GROUPS.map((g) => ({
    ...g,
    pct: g.idx.reduce((s, i) => s + ALLOCATIONS[i].pct, 0),
  }));

  return (
    <section ref={sectionRef} id="tokenomics" className="mx-auto max-w-7xl px-6 py-20 sm:py-28 scroll-mt-24">
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
      <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 sm:gap-12 lg:items-start">
        {/* Sticky cinematic donut */}
        <div className="lg:sticky lg:top-28 self-start">
          <div className="relative flex flex-col items-center justify-center glass-luxe rounded-3xl p-6 sm:p-10">
            <div className="relative">
              <Donut progress={scrollYProgress} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[10px] uppercase tracking-eyebrow text-taupe">Total Supply</div>
                <div className="font-serif font-semibold text-4xl sm:text-5xl text-gold mt-1">1B</div>
                <div className="text-sm text-ash mt-1">QTX · Fixed</div>
              </div>
            </div>
            {/* fixed-supply emphasis */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {['Fixed supply', 'Non-mintable', 'Hard-coded'].map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-[11px] font-grotesk text-champagne"
                >
                  <Icon name="lock" size={11} className="text-gold/70" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: utility split + animated allocation bars */}
        <div>
          {/* Utility split — links supply to function */}
          <div className="glass-luxe rounded-2xl p-5 sm:p-6 mb-5">
            <div className="text-[10px] uppercase tracking-eyebrow text-taupe mb-3">Supply by utility</div>
            <div className="flex h-3 overflow-hidden rounded-full bg-white/[0.05]">
              {groups.map((g) => (
                <motion.div
                  key={g.label}
                  style={{ background: g.shade }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${g.pct}%` }}
                  viewport={{ once: true, margin: '0px 0px -50px 0px' }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-3">
              {groups.map((g) => (
                <div key={g.label} className="flex items-start gap-2">
                  <span className="mt-1 h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: g.shade }} />
                  <div>
                    <div className="text-xs font-grotesk text-ivory">
                      {g.label} <span className="font-mono text-gold">{g.pct}%</span>
                    </div>
                    <div className="text-[11px] text-taupe">{g.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed allocations */}
          <Stagger className="flex flex-col gap-2.5" gap={0.05}>
            {ALLOCATIONS.map((a) => (
              <AllocRow key={a.name} a={a} />
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
