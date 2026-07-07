'use client';

import Image from 'next/image';
import { MINERS } from '@/lib/config';
import { SectionHeading } from './SectionHeading';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';
import { GlowCard } from '@/components/ui/GlowCard';
import minerFamily from '@/public/assets/miner-family.webp';

function SpecRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.05] pb-2 last:border-0 last:pb-0">
      <span className="text-[11px] uppercase tracking-eyebrow text-taupe">{label}</span>
      <span className={`font-mono text-sm ${accent ? 'text-gold' : 'text-ivory'}`}>{value}</span>
    </div>
  );
}

function MinerCard({ m, rank }: { m: (typeof MINERS)[number]; rank: number }) {
  return (
    <StaggerItem className="h-full">
      <GlowCard className="group glow-gold flex h-full flex-col rounded-3xl glass-luxe overflow-hidden transition-transform duration-300 hover:-translate-y-1.5">
        {/* Device faceplate */}
        <div className="relative px-6 pt-6 pb-5 border-b border-white/[0.06]">
          <span className="absolute top-4 right-5 font-mono text-[11px] text-taupe">
            {String(rank).padStart(2, '0')}
          </span>
          <div
            className="relative mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent overflow-hidden"
          >
            {/* faceplate grid */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(227,179,65,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(227,179,65,0.12) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
              }}
            />
            {/* core glow */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: 'radial-gradient(circle at center, rgba(227,179,65,0.22), transparent 65%)' }}
            />
            <span className="relative text-4xl text-gold transition-transform duration-300 group-hover:scale-110">
              {m.glyph}
            </span>
          </div>
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-eyebrow text-taupe mb-0.5">Qryptix Miner</div>
            <h3 className="font-serif font-medium text-xl text-ivory">{m.tier}</h3>
          </div>
        </div>

        {/* Spec comparison */}
        <div className="flex flex-grow flex-col gap-2.5 p-6">
          <SpecRow label="Hashrate" value={m.hashrate} />
          <SpecRow label="Power draw" value={m.power} />
          <SpecRow label="Indicative" value={m.price} accent />
          <button className="mt-4 w-full rounded-xl border border-gold/25 py-2.5 text-sm font-grotesk text-ivory transition-all hover:border-gold/60 hover:bg-gold/5 cursor-pointer">
            Register interest
          </button>
        </div>
      </GlowCard>
    </StaggerItem>
  );
}

export function Miners() {
  return (
    <section id="miners" className="mx-auto max-w-7xl px-6 py-20 sm:py-28 scroll-mt-24">
      <SectionHeading
        tag="Hardware · Miner Fleet"
        title={<>Qryptix Miners.</>}
        subtitle="The miner program is in manufacturer-selection phase. No purchases today. Register interest to be notified when the first batch opens — pricing and specs may change."
      />

      {/* Family design study — one design DNA across all four tiers */}
      <Reveal className="mb-10">
        <div className="relative overflow-hidden rounded-[2rem] glass-luxe">
          <Image
            src={minerFamily}
            alt="Industrial design concept study: four Qryptix miner tiers — Nano, Core, Pro and Ultra — sharing one design language, ascending in size"
            className="w-full h-auto"
            sizes="(min-width: 1280px) 1216px, 100vw"
            placeholder="blur"
          />
          <span className="hidden sm:inline-flex absolute top-5 left-5 items-center gap-1.5 rounded-full glass-luxe px-3 py-1.5 font-mono text-[10px] uppercase tracking-eyebrow text-gold-bright">
            Industrial design concept
          </span>
          <span className="hidden sm:inline-flex absolute bottom-5 right-5 rounded-full bg-obsidian/70 border border-white/[0.08] px-3 py-1.5 font-mono text-[10px] uppercase tracking-eyebrow text-ash">
            Hardware form factor not final
          </span>
        </div>
        {/* On small screens the band is too short for overlays — labels sit below */}
        <div className="sm:hidden mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-eyebrow">
          <span className="text-gold-bright">Industrial design concept</span>
          <span className="text-taupe">Form factor not final</span>
        </div>
      </Reveal>

      <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" gap={0.08}>
        {MINERS.map((m, i) => (
          <MinerCard key={m.tier} m={m} rank={i + 1} />
        ))}
      </Stagger>
      <p className="text-center text-sm text-ash mt-8 max-w-2xl mx-auto">
        All specifications are <strong className="text-ivory">indicative</strong> and subject to change based on
        final hardware validation. Interest registration is non-binding and does not constitute a purchase.
      </p>
    </section>
  );
}
