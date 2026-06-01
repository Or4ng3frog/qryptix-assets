'use client';

import { useState } from 'react';
import { FEATURES, PHASES, PHASE_PROGRESS } from '@/lib/config';
import { Icon } from '../Icon';

export function ReservationWidget() {
  const activePhase = PHASES.find((p) => p.active) ?? PHASES[0];
  const [usdc, setUsdc] = useState('500');
  const [email, setEmail] = useState('');
  const [wallet, setWallet] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const qtx = (parseFloat(usdc) || 0) / activePhase.price;
  const pct = Math.round((PHASE_PROGRESS.reserved / PHASE_PROGRESS.cap) * 100);

  const handleSubmit = async () => {
    if (!email || !wallet) return;
    setLoading(true);
    try {
      await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, wallet, usdc, phase: activePhase.id }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true); // optimistic for preview
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative glass-luxe rounded-3xl p-7 shadow-[0_30px_80px_-40px_rgba(227,179,65,0.45)]">
      {/* Top accent line */}
      <div className="absolute -top-px left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="flex items-center justify-between mb-6">
        <span className="font-grotesk font-medium text-ivory">Pre-Sale Reservation</span>
        <span className="rounded-lg border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-bright">
          {activePhase.id} · ${activePhase.price.toFixed(3)}
        </span>
      </div>

      {/* Phase ladder */}
      <div className="flex gap-1.5 mb-6">
        {PHASES.map((p) => (
          <div
            key={p.id}
            className={`flex-1 rounded-lg py-2 text-center text-[10px] transition-all ${
              p.active
                ? 'border border-gold/40 bg-gradient-to-br from-gold/15 to-gold-deep/10 text-gold-bright'
                : 'border border-white/5 bg-white/[0.02] text-taupe'
            }`}
          >
            {p.id}
            <span className="block font-mono font-semibold mt-0.5">${p.price.toFixed(3)}</span>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-ash">Phase 1 Allocation</span>
          <span className="font-semibold text-ivory">
            {PHASE_PROGRESS.reserved} / {PHASE_PROGRESS.cap} reserved
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full rounded-full bg-gold-gradient transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {submitted ? (
        <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient text-obsidian">
            <Icon name="check" size={24} />
          </div>
          <div className="font-grotesk font-medium text-ivory mb-1">Spot reserved</div>
          <p className="text-sm text-ash">
            Your Phase 1 price of ${activePhase.price.toFixed(3)} is locked. We&apos;ll email you the moment the
            buy flow opens.
          </p>
        </div>
      ) : (
        <>
          <label className="block text-xs text-ash mb-1.5">
            You will pay (USDC, when launch goes live)
          </label>
          <input
            type="number"
            value={usdc}
            onChange={(e) => setUsdc(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-xl bg-raised border border-white/8 px-4 py-3 text-ivory focus:outline-none focus:border-gold/50 transition-colors mb-3"
          />

          <div className="rounded-2xl bg-raised border border-white/8 p-4 mb-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-eyebrow text-taupe">You receive</div>
              <div className="font-mono text-xl font-semibold text-gold">
                {qtx.toLocaleString('en-US', { maximumFractionDigits: 2 })} QTX
              </div>
            </div>
            <div className="text-right text-xs text-taupe">
              @ ${activePhase.price.toFixed(3)}
              <br />
              Claim at TGE
            </div>
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl bg-raised border border-white/8 px-4 py-3 text-ivory focus:outline-none focus:border-gold/50 transition-colors mb-3"
          />
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="0x... (Base wallet)"
            className="w-full rounded-xl bg-raised border border-white/8 px-4 py-3 text-ivory font-mono text-sm focus:outline-none focus:border-gold/50 transition-colors mb-4"
          />

          <button
            onClick={handleSubmit}
            disabled={loading || !email || !wallet}
            className="w-full rounded-xl bg-gold-gradient py-3.5 font-grotesk font-semibold text-obsidian transition-transform enabled:hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Reserving…' : FEATURES.BUY_FLOW_ENABLED ? 'Buy Now' : 'Reserve My Spot'}
          </button>

          <p className="text-[11px] text-taupe text-center mt-3 leading-relaxed inline-flex flex-wrap items-center justify-center gap-1">
            <Icon name="alert" size={13} className="text-gold inline-block shrink-0" />
            <span className="text-gold font-medium">No payment required today.</span>{' '}
            Reservations lock in the Phase 1 price. Purchase opens once the audit is published and the
            operating entity is finalized. Non-binding, cancel anytime.
          </p>
        </>
      )}
    </div>
  );
}
