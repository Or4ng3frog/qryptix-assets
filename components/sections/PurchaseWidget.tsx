import { PHASES, PRESALE } from '@/lib/config';
import { PURCHASE_READY, ACTIVE_CHAIN_LABEL } from '@/lib/chains';
import { Icon } from '../Icon';

export function PurchaseWidget() {
  const phase = PHASES.find((p) => p.active) ?? PHASES[0];

  return (
    <div className="relative glass-luxe rounded-3xl p-7 shadow-[0_30px_80px_-40px_rgba(227,179,65,0.45)]">
      <div className="absolute -top-px left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="flex items-center justify-between mb-6">
        <span className="font-grotesk font-medium text-ivory">Direct purchase with USDC</span>
        <span className="rounded-lg border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-bright">{phase.id} · ${phase.price.toFixed(3)}</span>
      </div>
      <div className="flex gap-1.5 mb-6">
        {PHASES.map((p) => (
          <div key={p.id} className={`flex-1 rounded-lg py-2 text-center text-[10px] ${p.active ? 'border border-gold/40 bg-gold/10 text-gold-bright' : 'border border-white/5 bg-white/[0.02] text-taupe'}`}>
            {p.id}<span className="block font-mono font-semibold mt-0.5">${p.price.toFixed(3)}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs flex justify-between mb-6">
        <span className="text-ash">Planned stage allocation cap</span>
        <span className="font-mono font-semibold text-ivory">{phase.allocation}</span>
      </div>
      <p className="text-sm text-ash mb-6">Connect your wallet, choose an amount between ${PRESALE.minBuyUsd} and ${PRESALE.maxBuyUsd.toLocaleString()}, and review the terms before paying.</p>
      <a href="/buy" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold-gradient py-3.5 font-grotesk font-semibold text-obsidian">
        {PURCHASE_READY ? 'Buy QTX' : 'View purchase details'} <Icon name="arrow" size={17} />
      </a>
      <p className="text-[11px] text-taupe text-center mt-3">{PURCHASE_READY ? `USDC on ${ACTIVE_CHAIN_LABEL} · tokens claimable at TGE` : 'PreSale opens soon · no payment accepted yet'}</p>
    </div>
  );
}
