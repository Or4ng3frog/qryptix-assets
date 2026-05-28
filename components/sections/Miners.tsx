'use client';

import { MINERS } from '@/lib/config';
import { SectionHeading } from './SectionHeading';
import { useReveal } from '@/lib/useReveal';

function MinerCard({ m, i }: { m: (typeof MINERS)[number]; i: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`group glow-border rounded-3xl glass p-7 text-center transition-all hover:-translate-y-1 reveal ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${i * 70}ms` }}
    >
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan/15 to-violet/15 border border-violet/20 text-3xl text-cyan transition-transform group-hover:scale-110">
        {m.glyph}
      </div>
      <h3 className="font-display font-medium text-xl text-ghost mb-1">{m.tier}</h3>
      <div className="text-xs text-fog leading-relaxed mb-5">
        {m.hashrate} · {m.power}
        <br />
        Indicative: {m.price}
      </div>
      <button className="w-full rounded-xl border border-violet/25 py-2.5 text-sm text-ghost transition-all hover:border-violet/60 hover:bg-violet/5">
        Register interest
      </button>
    </div>
  );
}

export function Miners() {
  return (
    <section id="miners" className="mx-auto max-w-7xl px-6 py-28 scroll-mt-24">
      <SectionHeading
        tag="Hardware"
        title={<>Qryptix Miners.</>}
        subtitle="The miner program is in manufacturer-selection phase. No purchases today. Register interest to be notified when the first batch opens — pricing and specs may change."
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {MINERS.map((m, i) => (
          <MinerCard key={m.tier} m={m} i={i} />
        ))}
      </div>
      <p className="text-center text-sm text-mist mt-8 max-w-2xl mx-auto">
        All specifications are <strong className="text-ghost">indicative</strong> and subject to change based on
        final hardware validation. Interest registration is non-binding and does not constitute a purchase.
      </p>
    </section>
  );
}
