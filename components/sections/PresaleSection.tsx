'use client';

import { PHASES, PHASE_PROGRESS, PRESALE } from '@/lib/config';
import { SectionHeading } from './SectionHeading';
import { useReveal } from '@/lib/useReveal';
import { Icon } from '../Icon';

export function PresaleSection() {
  const { ref, visible } = useReveal();
  const active = PHASES.find((p) => p.active) ?? PHASES[0];
  const next = PHASES[PHASES.findIndex((p) => p.active) + 1];
  const pct = Math.round((PHASE_PROGRESS.reserved / PHASE_PROGRESS.cap) * 100);

  const stats = [
    { label: 'Current price', value: `$${active.price.toFixed(3)}`, sub: `Stage ${active.id}` },
    { label: 'Next stage', value: next ? `$${next.price.toFixed(3)}` : '—', sub: next ? next.id : 'Final stage' },
    { label: 'Min participation', value: `$${PRESALE.minBuyUsd}`, sub: 'USD-equivalent' },
    { label: 'Max per wallet', value: `$${(PRESALE.maxBuyUsd / 1000).toFixed(0)}k`, sub: 'USD-equivalent' },
  ];

  const notes = [
    'Tokens are not claimable until launch / TGE',
    'Participation is speculative',
    'No guaranteed listing, liquidity, value increase or rewards',
    'Refund option applies only under the published Refund Policy',
  ];

  return (
    <section id="presale" className="mx-auto max-w-7xl px-6 py-28 scroll-mt-24">
      <SectionHeading
        tag="PreSale · Early Supporter Participation"
        title={<>Join the PreSale.</>}
        subtitle="Qryptix is currently in PreSale. This is early supporter participation — not an investment product. Read the notes below before taking part."
      />

      <div
        ref={ref}
        className={`grid lg:grid-cols-[1.3fr_1fr] gap-6 reveal ${visible ? 'visible' : ''}`}
      >
        {/* Left: stats dashboard */}
        <div className="glass rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan" />
              </span>
              <span className="text-sm font-medium text-ghost">Stage {active.id} active</span>
            </div>
            <span className="text-xs text-fog font-mono">{PRESALE.currencies.join(' · ')}</span>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-void/40 border border-white/5 p-4">
                <div className="text-[10px] uppercase tracking-wider text-fog mb-1.5">{s.label}</div>
                <div className="font-display font-semibold text-xl text-gradient">{s.value}</div>
                <div className="text-[11px] text-fog mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-mist">Stage {active.id} allocation</span>
            <span className="font-semibold text-ghost">{PHASE_PROGRESS.reserved} / {PHASE_PROGRESS.cap} reserved</span>
          </div>
          <div className="h-2 rounded-full bg-void/60 overflow-hidden mb-1">
            <div className="h-full rounded-full bg-brand-gradient transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-xs text-fog">{pct}% of this stage reserved</div>

          {/* Phase ladder */}
          <div className="flex gap-1.5 mt-6">
            {PHASES.map((p) => (
              <div
                key={p.id}
                className={`flex-1 rounded-lg py-2 text-center text-[10px] ${
                  p.active
                    ? 'border border-cyan/40 bg-gradient-to-br from-cyan/10 to-violet/10 text-cyan-bright'
                    : 'border border-white/5 bg-white/[0.02] text-fog'
                }`}
              >
                {p.id}
                <span className="block font-mono font-semibold mt-0.5">${p.price.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: CTA + honest notes */}
        <div className="glass rounded-3xl p-8 flex flex-col">
          <h3 className="font-display font-medium text-xl text-ghost mb-2">Participate as an early supporter</h3>
          <p className="text-sm text-mist leading-relaxed mb-6">
            Connect your wallet, choose an amount, and confirm. You&apos;ll get a buyer account and dashboard to
            track your participation, allocation, and refund eligibility.
          </p>

          <a
            href="/buy"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-gradient py-3.5 font-semibold text-void transition-transform hover:scale-[1.02] mb-3"
          >
            Join PreSale
            <Icon name="arrow" size={18} />
          </a>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet/25 py-3 text-sm font-medium text-ghost transition-all hover:border-violet/60 hover:bg-violet/5 mb-6"
          >
            View Dashboard Preview
          </a>

          <div className="mt-auto space-y-2.5 pt-5 border-t border-white/5">
            {notes.map((n) => (
              <div key={n} className="flex gap-2.5 text-xs text-mist">
                <Icon name="alert" size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span>{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
