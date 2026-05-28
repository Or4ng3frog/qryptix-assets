'use client';

import { motion } from 'framer-motion';
import { SITE } from '@/lib/config';
import { ReservationWidget } from './ReservationWidget';
import { Icon } from '../Icon';

const stagger = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function Hero() {
  return (
    <section id="top" className="relative pt-36 pb-24 overflow-hidden">
      {/* Orbital decoration */}
      <div className="pointer-events-none absolute top-20 right-[-10%] h-[700px] w-[700px] opacity-30 hidden lg:block">
        <div className="absolute inset-0 rounded-full border border-violet/20 animate-spin-slow" />
        <div className="absolute inset-12 rounded-full border border-cyan/20 animate-spin-slow" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
        <div className="absolute inset-24 rounded-full border border-violet/10" />
        <div className="absolute top-1/2 left-0 h-2 w-2 rounded-full bg-cyan shadow-[0_0_20px_4px_rgba(61,224,208,0.6)] animate-pulse-glow" />
        <div className="absolute top-12 right-1/4 h-1.5 w-1.5 rounded-full bg-violet shadow-[0_0_16px_4px_rgba(168,139,255,0.6)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        {/* Left: copy */}
        <div>
          <motion.div
            custom={0}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2.5 rounded-full glass px-4 py-2 text-xs font-medium text-violet-bright mb-7"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
            </span>
            Phase 1 reservation open · Launch {SITE.tgeTarget}
          </motion.div>

          <motion.h1
            custom={1}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="font-display font-semibold text-mega mb-6"
          >
            The token that
            <br />
            <span className="text-gradient-flow">earns its place.</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="text-lg text-mist max-w-lg mb-9 leading-relaxed"
          >
            QTX is a multi-utility token on Base with a hardware-backed rewards layer.
            Fixed 1B supply, on-chain vesting, LP locked 12 months — built and operated
            by a single doxxed founder.
          </motion.p>

          {/* Stats */}
          <motion.div
            custom={3}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-3 gap-3 mb-9 max-w-lg"
          >
            {[
              { label: 'Total Supply', value: '1B QTX' },
              { label: 'Network', value: 'Base · L2' },
              { label: 'LP Lock', value: '12 months' },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl px-4 py-3.5">
                <div className="text-[10px] uppercase tracking-wider text-fog mb-1">{s.label}</div>
                <div className="font-display font-medium text-ghost">{s.value}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            custom={4}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-wrap gap-3"
          >
            <a
              href="#presale"
              className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-7 py-3.5 font-semibold text-void transition-transform hover:scale-105 hover:shadow-[0_8px_30px_-8px_rgba(168,139,255,0.6)]"
            >
              Join PreSale
              <Icon name="arrow" size={18} />
            </a>
            <a
              href="/whitepaper"
              className="inline-flex items-center gap-2 rounded-full border border-violet/25 px-7 py-3.5 font-medium text-ghost transition-all hover:border-violet/60 hover:bg-violet/5"
            >
              <Icon name="doc" size={18} />
              Read Whitepaper
            </a>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-violet/25 px-7 py-3.5 font-medium text-ghost transition-all hover:border-violet/60 hover:bg-violet/5"
            >
              View Dashboard Preview
            </a>
          </motion.div>
        </div>

        {/* Right: reservation widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <ReservationWidget />
        </motion.div>
      </div>
    </section>
  );
}
