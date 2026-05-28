'use client';

import { ALLOCATIONS } from '@/lib/config';
import { SectionHeading } from './SectionHeading';
import { useReveal } from '@/lib/useReveal';

const R = 70;
const C = 2 * Math.PI * R;

function Donut() {
  const { ref, visible } = useReveal<SVGSVGElement>();
  let offset = 0;
  return (
    <svg ref={ref} viewBox="0 0 200 200" className="w-72 h-72 -rotate-90">
      <circle cx="100" cy="100" r={R} fill="none" stroke="#161A26" strokeWidth="26" />
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

function AllocRow({ a, i }: { a: (typeof ALLOCATIONS)[number]; i: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`flex items-center gap-4 rounded-2xl glass px-5 py-4 transition-all hover:border-violet/25 reveal ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${i * 50}ms` }}
    >
      <span className="h-3 w-3 rounded shrink-0" style={{ background: a.color }} />
      <div className="flex-grow">
        <div className="text-sm font-medium text-ghost">{a.name}</div>
        <div className="text-xs text-fog mt-0.5">{a.desc}</div>
      </div>
      <span className="font-mono font-semibold text-gradient text-lg">{a.pct}%</span>
    </div>
  );
}

export function Tokenomics() {
  return (
    <section id="tokenomics" className="mx-auto max-w-7xl px-6 py-28 scroll-mt-24">
      <SectionHeading
        tag="Tokenomics"
        title={
          <>
            1B fixed supply.
            <br />
            <span className="text-gradient">30% to mining rewards.</span>
          </>
        }
        subtitle="Every allocation is hard-coded in the contract on Base. Vesting and lock schedules are enforced on-chain — not promises."
      />
      <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 items-center">
        <div className="relative flex flex-col items-center justify-center glass rounded-3xl p-10">
          <div className="relative">
            <Donut />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-[10px] uppercase tracking-[0.2em] text-fog">Total Supply</div>
              <div className="font-display font-semibold text-5xl text-gradient mt-1">1B</div>
              <div className="text-sm text-mist mt-1">QTX · Fixed</div>
            </div>
          </div>
          <p className="text-xs text-fog mt-6">Allocations hard-coded in the contract</p>
        </div>
        <div className="flex flex-col gap-2.5">
          {ALLOCATIONS.map((a, i) => (
            <AllocRow key={a.name} a={a} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
