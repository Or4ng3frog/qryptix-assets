'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { DEPIN } from '@/lib/config';
import { SectionHeading } from './SectionHeading';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';
import { GlowCard } from '@/components/ui/GlowCard';
import { Icon } from '../Icon';

// Satellite node positions (in a 320x320 viewBox, hub at centre 160,160)
const NODES = [
  { x: 160, y: 36 },
  { x: 282, y: 104 },
  { x: 282, y: 216 },
  { x: 160, y: 284 },
  { x: 38, y: 216 },
  { x: 38, y: 104 },
];

// Spokes that carry a travelling pulse out from the hub.
const PULSES = [
  { node: 0, dur: 2.6, delay: 0 },
  { node: 2, dur: 3.0, delay: 0.9 },
  { node: 4, dur: 2.8, delay: 1.7 },
];

function Topology() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      {/* soft glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: 'radial-gradient(circle at center, rgba(227,179,65,0.14), transparent 65%)' }}
      />
      <svg viewBox="0 0 320 320" className="relative h-full w-full">
        {/* links */}
        {NODES.map((n, i) => (
          <line
            key={`l-${i}`}
            x1="160"
            y1="160"
            x2={n.x}
            y2={n.y}
            stroke="rgba(227,179,65,0.28)"
            strokeWidth="1"
          />
        ))}
        {/* ring */}
        <circle cx="160" cy="160" r="124" fill="none" stroke="rgba(244,241,234,0.06)" strokeWidth="1" />

        {/* satellite nodes */}
        {NODES.map((n, i) => (
          <g key={`n-${i}`} className="animate-pulse-glow" style={{ animationDelay: `${i * 0.4}s`, transformOrigin: 'center' }}>
            <circle cx={n.x} cy={n.y} r="6" fill="#E3B341" />
            <circle cx={n.x} cy={n.y} r="11" fill="none" stroke="rgba(227,179,65,0.4)" strokeWidth="1" />
          </g>
        ))}

        {/* travelling pulses out from the hub */}
        {!reduce &&
          PULSES.map((p, i) => (
            <motion.circle
              key={`pulse-${i}`}
              r={3}
              fill="#F4D88A"
              initial={{ cx: 160, cy: 160, opacity: 0 }}
              animate={{
                cx: [160, NODES[p.node].x],
                cy: [160, NODES[p.node].y],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}
            />
          ))}

        {/* hub */}
        <circle cx="160" cy="160" r="22" fill="#0C0C10" stroke="rgba(227,179,65,0.5)" strokeWidth="1.5" />
        <circle cx="160" cy="160" r="9" fill="#F4D88A" />
      </svg>

      {/* hub label */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[34px] text-center">
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-taupe">QTX core</span>
      </div>
    </div>
  );
}

export function NetworkSection() {
  return (
    <section id="network" className="mx-auto max-w-7xl px-6 py-20 sm:py-28 scroll-mt-24">
      <SectionHeading
        tag="DePIN · Hardware Layer"
        title={
          <>
            A network that does <span className="text-gold">real work.</span>
          </>
        }
        subtitle={DEPIN.intro}
      />

      <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 items-center">
        {/* Topology visual */}
        <Reveal>
          <div className="glass-luxe rounded-[2rem] p-8">
            <Topology />
          </div>
        </Reveal>

        {/* Pillars */}
        <Stagger className="grid sm:grid-cols-2 gap-4" gap={0.08}>
          {DEPIN.pillars.map((p) => (
            <StaggerItem key={p.title} className="h-full">
              <GlowCard className="group glow-gold h-full rounded-2xl glass-luxe p-6 transition-transform duration-300 hover:-translate-y-1">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 border border-gold/20 text-gold mb-4 transition-transform group-hover:scale-110">
                  <Icon name={p.icon} size={20} />
                </div>
                <h3 className="font-serif font-medium text-lg text-ivory mb-1.5">{p.title}</h3>
                <p className="font-grotesk text-sm text-ash leading-relaxed">{p.desc}</p>
              </GlowCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* Design-parameter band (honest: not live telemetry) */}
      <Reveal className="mt-8">
        <div className="glass-luxe rounded-3xl px-6 py-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {DEPIN.params.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-serif font-semibold text-3xl text-gold">{s.value}</div>
                <div className="font-grotesk text-sm text-ivory mt-1">{s.label}</div>
                <div className="font-grotesk text-xs text-taupe">{s.sub}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 pt-5 border-t border-white/[0.06] text-center text-xs text-taupe font-grotesk inline-flex items-center justify-center gap-1.5 w-full">
            <Icon name="alert" size={13} className="text-taupe shrink-0" />
            Protocol parameters fixed by design — illustrative of intended economics, not live network data.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
