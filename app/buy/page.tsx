import type { Metadata } from 'next';
import { BuyFlow } from '@/components/BuyFlow';
import { FEATURES, PHASES, PHASE_PROGRESS, PRESALE, SITE } from '@/lib/config';
import { Icon } from '@/components/Icon';
import { Logo } from '@/components/Logo';

export const metadata: Metadata = {
  title: 'Join PreSale — Qryptix',
  description: 'Participate in the Qryptix PreSale as an early supporter.',
};

export default function BuyPage() {
  const active = PHASES.find((p) => p.active) ?? PHASES[0];
  const pct = Math.round((PHASE_PROGRESS.reserved / PHASE_PROGRESS.cap) * 100);
  const notes = [
    'Tokens are not claimable until launch / TGE',
    'Participation is speculative',
    'No guaranteed listing, liquidity, value increase or rewards',
    'Refund option applies only under the published Refund Policy',
  ];

  return (
    <div className="sel-gold min-h-screen">
      <div className="sticky top-0 z-50 bg-obsidian/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="mx-auto max-w-5xl px-6 py-3.5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 cursor-pointer">
            <Logo variant="full" size={30} />
          </a>
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-sm font-grotesk text-ash hover:text-ivory transition-colors cursor-pointer">Dashboard</a>
            <a href="/" className="text-sm font-grotesk text-ash hover:text-ivory transition-colors cursor-pointer">← Home</a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="text-xs font-grotesk font-semibold uppercase tracking-eyebrow text-gold mb-3">
          PreSale · Early Supporter Participation
        </div>
        <h1 className="font-serif font-semibold text-3xl md:text-4xl text-ivory mb-3">Join the PreSale</h1>
        <p className="font-grotesk text-ash max-w-2xl leading-relaxed mb-10">
          Qryptix is currently in PreSale. This is early supporter participation — not an investment product. Read
          the notes before taking part.
        </p>

        <div className="grid lg:grid-cols-[1fr_0.9fr] gap-6 items-start">
          {/* Left: context */}
          <div className="space-y-5">
            {!FEATURES.BUY_FLOW_ENABLED && (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5">
                <div className="flex items-center gap-2 text-amber-300 font-grotesk font-medium text-sm mb-1.5">
                  <Icon name="alert" size={16} /> Reservation mode
                </div>
                <p className="text-sm text-amber-200/70 leading-relaxed">
                  The live buy flow is not yet active. Until the smart-contract audit is published and the
                  operating entity is finalized, you can reserve your allocation at the current price with no
                  payment. You&apos;ll be notified the moment purchasing opens.
                </p>
              </div>
            )}

            <div className="glass-luxe rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-grotesk font-medium text-ivory">Stage {active.id}</span>
                <span className="text-xs text-taupe font-mono">{PRESALE.currencies.join(' · ')}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-ash">Allocation</span>
                <span className="font-semibold text-ivory">{PHASE_PROGRESS.reserved} / {PHASE_PROGRESS.cap}</span>
              </div>
              <div className="h-2 rounded-full bg-obsidian/60 overflow-hidden mb-4">
                <div className="h-full rounded-full bg-gold-gradient" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex gap-1.5">
                {PHASES.map((p) => (
                  <div key={p.id} className={`flex-1 rounded-lg py-2 text-center text-[10px] ${p.active ? 'border border-gold/40 bg-gradient-to-br from-gold/15 to-gold-deep/10 text-gold-bright' : 'border border-white/5 bg-white/[0.02] text-taupe'}`}>
                    {p.id}<span className="block font-mono font-semibold mt-0.5">${p.price.toFixed(3)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-luxe rounded-2xl p-6">
              <span className="text-sm font-grotesk font-medium text-ivory block mb-3">Before you participate</span>
              <div className="space-y-2.5">
                {notes.map((n) => (
                  <div key={n} className="flex gap-2.5 text-xs text-ash">
                    <Icon name="alert" size={14} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>{n}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
                <a href="/presale-terms" className="text-gold hover:underline cursor-pointer">PreSale Terms</a>
                <a href="/refund-policy" className="text-gold hover:underline cursor-pointer">Refund Policy</a>
                <a href="/risk-disclosure" className="text-gold hover:underline cursor-pointer">Risk Disclosure</a>
              </div>
            </div>
          </div>

          {/* Right: the flow */}
          <BuyFlow />
        </div>
      </div>
    </div>
  );
}
