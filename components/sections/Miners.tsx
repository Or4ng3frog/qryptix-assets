'use client';

import { MINERS } from '@/lib/config';
import { SectionHeading } from './SectionHeading';
import { Stagger, StaggerItem } from '@/components/motion';

function MinerCard({ m }: { m: (typeof MINERS)[number] }) {
  return (
    <StaggerItem className="group glow-gold h-full rounded-3xl glass-luxe p-7 text-center transition-transform hover:-translate-y-1">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 border border-gold/20 text-3xl text-gold transition-transform group-hover:scale-110">
        {m.glyph}
      </div>
      <h3 className="font-serif font-medium text-xl text-ivory mb-1">{m.tier}</h3>
      <div className="text-xs text-taupe leading-relaxed mb-5 font-mono">
        {m.hashrate} · {m.power}
        <br />
        Indicative: {m.price}
      </div>
      <button className="w-full rounded-xl border border-gold/25 py-2.5 text-sm font-grotesk text-ivory transition-all hover:border-gold/60 hover:bg-gold/5 cursor-pointer">
        Register interest
      </button>
    </StaggerItem>
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
      <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-5" gap={0.07}>
        {MINERS.map((m) => (
          <MinerCard key={m.tier} m={m} />
        ))}
      </Stagger>
      <p className="text-center text-sm text-ash mt-8 max-w-2xl mx-auto">
        All specifications are <strong className="text-ivory">indicative</strong> and subject to change based on
        final hardware validation. Interest registration is non-binding and does not constitute a purchase.
      </p>
    </section>
  );
}
