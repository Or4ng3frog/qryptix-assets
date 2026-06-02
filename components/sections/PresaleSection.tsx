'use client';

import { motion } from 'framer-motion';
import { PHASES, PHASE_PROGRESS, PRESALE } from '@/lib/config';
import { SectionHeading } from './SectionHeading';
import { Reveal } from '@/components/motion';
import { GlowCard } from '@/components/ui/GlowCard';
import { Icon } from '../Icon';

export function PresaleSection() {
  const active = PHASES.find((p) => p.active) ?? PHASES[0];
  const activeIdx = PHASES.findIndex((p) => p.active);
  const next = PHASES[activeIdx + 1];
  const pct = Math.round((PHASE_PROGRESS.reserved / PHASE_PROGRESS.cap) * 100);
  const maxPrice = Math.max(...PHASES.map((p) => p.price));

  const tiles = [
    { label: 'Min participation', value: `$${PRESALE.minBuyUsd}`, sub: 'USD-equivalent' },
    { label: 'Max per wallet', value: `$${(PRESALE.maxBuyUsd / 1000).toFixed(0)}k`, sub: 'USD-equivalent' },
    { label: 'Stage allocation', value: active.allocation.replace('~', ''), sub: `Stage ${active.id}` },
    { label: 'Raise target', value: active.raiseTarget, sub: 'This stage' },
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

      <Reveal className="grid lg:grid-cols-[1.35fr_1fr] gap-6">
        {/* ── LEFT: reservation terminal ── */}
        <GlowCard className="glass-luxe rounded-3xl p-6 md:p-8">
          {/* Terminal header */}
          <div className="flex items-center justify-between mb-6 pb-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
              </span>
              <span className="text-sm font-grotesk font-medium text-ivory">Reservation terminal</span>
              <span className="rounded-md border border-gold/30 bg-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-eyebrow text-gold-bright">
                Stage {active.id} live
              </span>
            </div>
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-taupe font-mono">
              <Icon name="lock" size={12} className="text-gold/70" />
              {PRESALE.currencies.join(' · ')}
            </span>
          </div>

          {/* Current price + next */}
          <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
            <div>
              <div className="text-[10px] uppercase tracking-eyebrow text-taupe mb-1">Current stage price</div>
              <div className="font-mono font-semibold text-4xl text-gold leading-none">
                ${active.price.toFixed(3)}
              </div>
              <div className="text-xs text-taupe mt-1.5">per QTX · reserve to lock this price</div>
            </div>
            {next && (
              <div className="rounded-2xl bg-obsidian/40 border border-white/[0.06] px-4 py-3 text-right">
                <div className="text-[10px] uppercase tracking-eyebrow text-taupe mb-1">Next stage</div>
                <div className="font-mono font-semibold text-lg text-ivory">${next.price.toFixed(3)}</div>
                <div className="text-[11px] text-taupe">{next.id}</div>
              </div>
            )}
          </div>

          {/* Price ladder — visualises the stage climb */}
          <div className="mb-7">
            <div className="text-[10px] uppercase tracking-eyebrow text-taupe mb-3">Price ladder</div>
            <div className="flex items-end gap-2 h-28">
              {PHASES.map((p, i) => {
                const h = Math.max(16, (p.price / maxPrice) * 100);
                const state = i < activeIdx ? 'past' : i === activeIdx ? 'active' : 'upcoming';
                return (
                  <div key={p.id} className="flex-1 flex flex-col items-center justify-end h-full">
                    <span
                      className={`font-mono text-[10px] mb-1 ${state === 'active' ? 'text-gold-bright' : 'text-taupe'}`}
                    >
                      ${p.price.toFixed(3)}
                    </span>
                    <motion.div
                      className={`w-full rounded-md ${
                        state === 'active'
                          ? 'bg-gold-gradient'
                          : state === 'past'
                          ? 'bg-gold/30'
                          : 'bg-white/[0.06] border border-white/[0.06]'
                      }`}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
                      transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <span
                      className={`mt-1.5 text-[10px] font-semibold ${
                        state === 'active' ? 'text-gold-bright' : 'text-taupe'
                      }`}
                    >
                      {p.id}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stage reservation progress */}
          <div className="mb-7">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-ash">Stage {active.id} allocation</span>
              <span className="font-semibold text-ivory font-mono">
                {PHASE_PROGRESS.reserved} / {PHASE_PROGRESS.cap}
              </span>
            </div>
            <div className="h-2 rounded-full bg-obsidian/60 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gold-gradient"
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true, margin: '0px 0px -60px 0px' }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <div className="text-xs text-taupe mt-1.5">{pct}% of this stage reserved</div>
          </div>

          {/* Vesting strip */}
          <div className="mb-7 rounded-2xl bg-obsidian/40 border border-white/[0.06] p-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-grotesk font-medium text-ivory flex items-center gap-1.5">
                <Icon name="lock" size={13} className="text-gold/70" /> Presale vesting
              </span>
              <span className="text-[11px] text-taupe font-mono">10% TGE · 90% linear / 8 mo</span>
            </div>
            <div className="flex h-2 overflow-hidden rounded-full bg-white/[0.05]">
              <div className="bg-gold-gradient" style={{ width: '10%' }} />
              <div className="bg-gold/25" style={{ width: '90%' }} />
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-taupe">
              <span>TGE unlock</span>
              <span>Linear over 8 months</span>
            </div>
          </div>

          {/* Stat tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {tiles.map((s) => (
              <div
                key={s.label}
                className="flex flex-col rounded-2xl bg-obsidian/40 border border-white/[0.06] p-4"
              >
                <div className="text-[10px] uppercase tracking-eyebrow leading-tight text-taupe min-h-[2.4em]">
                  {s.label}
                </div>
                <div className="font-mono font-semibold text-lg text-gold mt-1.5">{s.value}</div>
                <div className="text-[11px] text-taupe mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </GlowCard>

        {/* ── RIGHT: secure participation + notes ── */}
        <GlowCard className="glass-luxe rounded-3xl p-8 flex flex-col">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-gold/25 bg-gold/5 px-3 py-1 text-[11px] font-grotesk text-gold-bright mb-4">
            <Icon name="shield" size={13} /> Secure reservation
          </div>
          <h3 className="font-serif font-medium text-xl text-ivory mb-2">Participate as an early supporter</h3>
          <p className="font-grotesk text-sm text-ash leading-relaxed mb-6">
            Connect your wallet, choose an amount, and confirm. You&apos;ll get a buyer account and dashboard to
            track your participation, allocation, and refund eligibility.
          </p>

          <div className="flex flex-col gap-3.5 mb-6">
            <a
              href="/buy"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold-gradient px-6 py-3.5 font-grotesk font-semibold text-obsidian transition-[filter,box-shadow] duration-300 hover:brightness-105 hover:shadow-[0_10px_40px_-12px_rgba(227,179,65,0.5)] cursor-pointer"
            >
              Join PreSale
              <Icon name="arrow" size={18} />
            </a>
            <a
              href="/dashboard"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gold/25 px-6 py-3.5 text-sm font-grotesk font-medium text-ivory transition-all hover:border-gold/60 hover:bg-gold/5 cursor-pointer"
            >
              View Dashboard Preview
            </a>
          </div>

          <div className="space-y-2.5 pt-5 border-t border-white/[0.06]">
            {notes.map((n) => (
              <div key={n} className="flex gap-2.5 text-xs text-ash">
                <Icon name="alert" size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span>{n}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
            <a href="/presale-terms" className="text-gold hover:underline cursor-pointer">PreSale Terms</a>
            <a href="/refund-policy" className="text-gold hover:underline cursor-pointer">Refund Policy</a>
            <a href="/risk-disclosure" className="text-gold hover:underline cursor-pointer">Risk Disclosure</a>
          </div>
        </GlowCard>
      </Reveal>
    </section>
  );
}
