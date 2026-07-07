'use client';

import { Stagger, StaggerItem, motion } from '@/components/motion';
import { QuantumField } from '@/components/motion/QuantumField';
import { GlowCard } from '@/components/ui/GlowCard';
import { SITE } from '@/lib/config';
import { ReservationWidget } from './ReservationWidget';
import { Icon } from '../Icon';

const STATS = [
  { label: 'Total Supply', value: '1B QTX', icon: 'boxes' },
  { label: 'Network', value: 'Base · L2', icon: 'cpu' },
  { label: 'LP Lock', value: '12 months', icon: 'lock' },
];

export function Hero() {
  return (
    <section id="top" className="sel-gold relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
      {/* ── Background depth layers ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* volumetric crown glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 h-[720px] w-[1200px] opacity-70"
          style={{ background: 'radial-gradient(ellipse at center, rgba(227,179,65,0.16), transparent 70%)' }}
        />
        {/* quantum data network — calmer on mobile */}
        <QuantumField className="absolute inset-0 opacity-40 sm:opacity-[0.6]" />
        {/* deep warm corner glow */}
        <div
          className="absolute bottom-[-12%] right-[4%] h-[440px] w-[440px] opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(154,111,36,0.18), transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 grid lg:grid-cols-[1.08fr_0.92fr] gap-14 lg:gap-16 items-center">
        {/* Left: copy */}
        <Stagger>
          <StaggerItem className="inline-flex items-center gap-2.5 rounded-full glass-luxe px-4 py-2 text-xs font-grotesk font-medium text-champagne mb-7">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            Phase 1 reservation open · Launch {SITE.tgeTarget}
          </StaggerItem>

          <StaggerItem>
            <h1 className="font-serif font-semibold text-display-xl text-ivory mb-7">
              The token that
              <br />
              <span className="italic text-gold-sheen">earns its place.</span>
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="font-grotesk text-lg text-ash max-w-lg mb-9 leading-relaxed">
              QTX is a multi-utility token on Base with a hardware-backed rewards layer.
              Fixed 1B supply, a published vesting schedule, LP locked 12 months at TGE —
              built and operated by a single doxxed founder.
            </p>
          </StaggerItem>

          <StaggerItem>
            <div className="grid grid-cols-3 gap-3 mb-9 max-w-lg">
              {STATS.map((s) => (
                <GlowCard
                  key={s.label}
                  className="glass-luxe rounded-2xl px-4 py-3.5 transition-colors hover:border-gold/30"
                >
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-eyebrow text-taupe mb-1.5">
                    <Icon name={s.icon} size={12} className="text-gold/70" />
                    {s.label}
                  </div>
                  <div className="font-mono font-medium text-ivory">{s.value}</div>
                </GlowCard>
              ))}
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="flex flex-wrap gap-3">
              <a
                href="#presale"
                className="group relative inline-flex items-center gap-2 rounded-full bg-gold-gradient px-7 py-3.5 font-grotesk font-semibold text-obsidian transition-[filter,box-shadow] duration-300 hover:brightness-105 hover:shadow-[0_12px_44px_-10px_rgba(227,179,65,0.6)] cursor-pointer"
              >
                Join PreSale
                <Icon name="arrow" size={18} className="transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="/whitepaper"
                className="inline-flex items-center gap-2 rounded-full border border-gold/25 px-7 py-3.5 font-grotesk font-medium text-ivory transition-colors duration-300 hover:border-gold/60 hover:bg-gold/5 cursor-pointer"
              >
                <Icon name="doc" size={18} />
                Read Whitepaper
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-gold/25 px-7 py-3.5 font-grotesk font-medium text-ivory transition-colors duration-300 hover:border-gold/60 hover:bg-gold/5 cursor-pointer"
              >
                View Dashboard Preview
              </a>
            </div>
          </StaggerItem>
        </Stagger>

        {/* Right: reservation widget with floating core glow behind */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] opacity-70"
            style={{ background: 'radial-gradient(circle at 50% 38%, rgba(227,179,65,0.18), transparent 70%)' }}
          />
          <ReservationWidget />
        </motion.div>
      </div>
    </section>
  );
}
