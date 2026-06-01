'use client';

import { Stagger, StaggerItem, ParallaxLayer, motion } from '@/components/motion';
import { SITE } from '@/lib/config';
import { ReservationWidget } from './ReservationWidget';
import { Icon } from '../Icon';

export function Hero() {
  return (
    <section id="top" className="sel-gold relative pt-36 pb-24 overflow-hidden">
      {/* Warm volumetric glow — section-scoped */}
      <div
        className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 -z-0 h-[680px] w-[1100px] opacity-70"
        style={{ background: 'radial-gradient(ellipse at center, rgba(227,179,65,0.16), transparent 70%)' }}
      />

      {/* Orbital decoration — recoloured gold, drifts on scroll */}
      <ParallaxLayer
        speed={70}
        className="pointer-events-none absolute top-16 right-[-10%] h-[700px] w-[700px] opacity-40 hidden lg:block"
      >
        <div className="absolute inset-0 rounded-full border border-gold/20 animate-spin-slow" />
        <div
          className="absolute inset-12 rounded-full border border-champagne/15 animate-spin-slow"
          style={{ animationDuration: '30s', animationDirection: 'reverse' }}
        />
        <div className="absolute inset-24 rounded-full border border-gold/10" />
        <div className="absolute top-1/2 left-0 h-2 w-2 rounded-full bg-gold shadow-[0_0_22px_5px_rgba(227,179,65,0.6)] animate-pulse-glow" />
        <div className="absolute top-12 right-1/4 h-1.5 w-1.5 rounded-full bg-gold-bright shadow-[0_0_16px_4px_rgba(244,216,138,0.6)]" />
      </ParallaxLayer>

      <div className="relative z-10 mx-auto max-w-7xl px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        {/* Left: copy */}
        <Stagger>
          <StaggerItem className="inline-flex items-center gap-2.5 rounded-full glass-luxe px-4 py-2 text-xs font-medium text-gold-bright mb-7">
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
              Fixed 1B supply, on-chain vesting, LP locked 12 months — built and operated
              by a single doxxed founder.
            </p>
          </StaggerItem>

          <StaggerItem>
            <div className="grid grid-cols-3 gap-3 mb-9 max-w-lg">
              {[
                { label: 'Total Supply', value: '1B QTX' },
                { label: 'Network', value: 'Base · L2' },
                { label: 'LP Lock', value: '12 months' },
              ].map((s) => (
                <div key={s.label} className="glass-luxe rounded-2xl px-4 py-3.5">
                  <div className="text-[10px] uppercase tracking-eyebrow text-taupe mb-1">{s.label}</div>
                  <div className="font-mono font-medium text-ivory">{s.value}</div>
                </div>
              ))}
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="flex flex-wrap gap-3">
              <a
                href="#presale"
                className="group inline-flex items-center gap-2 rounded-full bg-gold-gradient px-7 py-3.5 font-grotesk font-semibold text-obsidian transition-[filter,box-shadow] duration-300 hover:brightness-105 hover:shadow-[0_10px_40px_-12px_rgba(227,179,65,0.55)] cursor-pointer"
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

        {/* Right: reservation widget (sealed logic core) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <ReservationWidget />
        </motion.div>
      </div>
    </section>
  );
}
