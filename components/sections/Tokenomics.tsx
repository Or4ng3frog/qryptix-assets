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

// Release schedules per allocation — sourced 1:1 from Whitepaper v1.3 §6
// (cliff / vesting / TGE table). Months from TGE; axis spans 48 months.
type Sched = {
  name: string;
  pct: number;
  cliff: number; // months locked before vesting starts
  vest: number; // vesting window length in months
  degressive?: boolean; // emission tapers over the window
  tgePct?: number; // % of this allocation unlocked at TGE
  locked?: number; // LP lock window (tokens live, pool locked)
  governance?: boolean; // no schedule — multisig/governance gated
  note: string;
};

const VESTING: Sched[] = [
  { name: 'Ecosystem / Miner Rewards', pct: 30, cliff: 0, vest: 48, degressive: true, note: 'Up to 48m · degressive' },
  { name: 'Treasury / Grants', pct: 16, cliff: 3, vest: 24, note: '3m cliff · 24m linear' },
  { name: 'Presale (P1–P5)', pct: 12, cliff: 0, vest: 8, tgePct: 10, note: '10% TGE · 8m linear' },
  { name: 'Staking Rewards', pct: 12, cliff: 0, vest: 36, degressive: true, note: 'Up to 36m · degressive' },
  { name: 'Liquidity & Market-Making', pct: 10, cliff: 0, vest: 0, tgePct: 100, locked: 12, note: '100% TGE · LP locked 12m' },
  { name: 'Team', pct: 10, cliff: 12, vest: 36, note: '12m cliff · 36m linear' },
  { name: 'Unallocated Reserve', pct: 6, cliff: 0, vest: 0, governance: true, note: 'Governance-gated · no schedule' },
  { name: 'Advisors', pct: 2, cliff: 6, vest: 12, note: '6m cliff · 12m linear' },
  { name: 'Community / Airdrop', pct: 2, cliff: 0, vest: 6, tgePct: 25, note: '25% TGE · 6m linear' },
];

const AXIS_MONTHS = 48;
const hatch =
  'repeating-linear-gradient(135deg, rgba(244,241,234,0.16) 0 2px, transparent 2px 6px)';

function TimelineRow({ s }: { s: Sched }) {
  const w = (m: number) => `${(m / AXIS_MONTHS) * 100}%`;
  return (
    <div className="group grid grid-cols-1 sm:grid-cols-[200px_1fr_170px] items-center gap-x-4 gap-y-1.5 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.02]">
      {/* Label */}
      <div className="flex items-baseline justify-between sm:justify-start gap-2 min-w-0">
        <span className="text-[13px] font-grotesk text-ivory truncate">{s.name}</span>
        <span className="font-mono text-xs font-semibold text-gold shrink-0">{s.pct}%</span>
      </div>

      {/* Bar lane */}
      <div className="relative h-4">
        {/* month gridlines at 12/24/36/48 */}
        {[25, 50, 75, 100].map((x) => (
          <span key={x} aria-hidden className="absolute inset-y-0 w-px bg-white/[0.05]" style={{ left: `${x}%` }} />
        ))}
        <div className="absolute inset-0 flex items-center gap-[2px]">
          {s.governance ? (
            <span className="h-[6px] w-full rounded-full border border-dashed border-white/15" />
          ) : (
            <>
              {s.cliff > 0 && (
                <motion.span
                  className="h-4 rounded-l-md border border-white/10 origin-left"
                  style={{ width: w(s.cliff), backgroundImage: hatch }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              {s.locked ? (
                <motion.span
                  className="h-4 rounded-md border border-gold/30 origin-left"
                  style={{ width: w(s.locked), backgroundImage: hatch }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              ) : null}
              {s.vest > 0 && (
                <motion.span
                  className={`h-4 origin-left ${s.cliff > 0 ? 'rounded-r-md' : 'rounded-md'}`}
                  style={{
                    width: w(s.vest),
                    background: s.degressive
                      ? 'linear-gradient(90deg, #E3B341 0%, rgba(227,179,65,0.10) 100%)'
                      : 'linear-gradient(90deg, #E3B341, #C28F3C)',
                  }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </>
          )}
        </div>
        {/* TGE unlock marker */}
        {s.tgePct ? (
          <span
            aria-hidden
            className="absolute top-1/2 -translate-y-1/2 -left-1 h-2 w-2 rotate-45 bg-gold-bright ring-2 ring-obsidian"
          />
        ) : null}
      </div>

      {/* Schedule — direct label, no tooltip needed */}
      <span className="font-mono text-[11px] text-taupe sm:text-right">{s.note}</span>
    </div>
  );
}

function ReleaseTimeline() {
  return (
    <div className="glass-luxe rounded-3xl p-6 sm:p-8 mt-8">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <div className="text-[10px] uppercase tracking-eyebrow text-taupe mb-1.5">Release timeline</div>
          <h3 className="font-serif font-medium text-xl text-ivory">When supply unlocks.</h3>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-grotesk text-ash">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-5 rounded-sm" style={{ background: 'linear-gradient(90deg, #E3B341, #C28F3C)' }} />
            Vesting window
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-5 rounded-sm border border-white/15" style={{ backgroundImage: hatch }} />
            Cliff / locked
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rotate-45 bg-gold-bright" />
            TGE unlock
          </span>
        </div>
      </div>

      {/* Month axis */}
      <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr_170px] gap-x-4 px-2 mb-1">
        <span className="hidden sm:block" />
        <div className="hidden sm:flex justify-between font-mono text-[10px] uppercase tracking-wide text-taupe">
          <span>TGE</span>
          <span>12m</span>
          <span>24m</span>
          <span>36m</span>
          <span>48m</span>
        </div>
        <span className="hidden sm:block" />
      </div>

      <div className="flex flex-col gap-0.5">
        {VESTING.map((s) => (
          <TimelineRow key={s.name} s={s} />
        ))}
      </div>

      <p className="mt-5 pt-4 border-t border-white/[0.06] text-xs text-taupe font-grotesk">
        Months from TGE (planned Q1 2027). Degressive bars fade to indicate a declining emission rate.
        Schedules as published in Whitepaper v1.3 §6 — designed for on-chain enforcement at TGE.
      </p>
    </div>
  );
}

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
        subtitle="Every allocation is fixed and published up front. Vesting and lock schedules are designed for on-chain enforcement — the audited contract will be linked here before any purchase opens."
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

      {/* Cliffs & vesting windows — real schedule data, full width */}
      <ReleaseTimeline />
    </section>
  );
}
