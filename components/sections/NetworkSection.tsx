'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { DEPIN } from '@/lib/config';
import { SectionHeading } from './SectionHeading';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';
import { GlowCard } from '@/components/ui/GlowCard';
import { Icon } from '../Icon';
import proofNetwork from '@/public/assets/proof-network.webp';

// The reward path as real UI text — mirrors the left→right progression in the visual.
const CHAIN = ['Physical work', 'Signal', 'Verification', 'Network', 'Recorded state'];

/**
 * Cinematic system visual: a physical node emits a signal that passes a
 * verification gate, fans out, and lands in a ledger grid. A single native
 * gold pulse travels the etched trace — light as information, not decoration.
 */
function ProofChainVisual() {
  const reduce = useReducedMotion();
  return (
    <div className="relative overflow-hidden rounded-[2rem] glass-luxe">
      <Image
        src={proofNetwork}
        alt="System concept: a machined hardware node sends a gold signal trace through a verification gate that fans out into a recessed ledger grid"
        className="w-full h-auto"
        sizes="(min-width: 1280px) 1216px, 100vw"
        placeholder="blur"
      />
      {/* Travelling pulse along the main trace (mapped to the image's light path) */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="absolute h-[3px] w-10 rounded-full"
          style={{
            top: '67.4%',
            background: 'linear-gradient(90deg, transparent, rgba(244,216,138,0.9))',
            boxShadow: '0 0 12px 2px rgba(227,179,65,0.55)',
          }}
          initial={{ left: '21%', opacity: 0 }}
          animate={{ left: ['21%', '57%'], opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 2.5, ease: 'linear' }}
        />
      )}
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

      {/* The value chain, cinematically */}
      <Reveal>
        <ProofChainVisual />
        {/* Reward path as native text */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {CHAIN.map((step, i) => (
            <span key={step} className="flex items-center gap-3">
              <span
                className={`font-mono text-[11px] uppercase tracking-eyebrow ${
                  i === 2 ? 'text-gold-bright' : 'text-ash'
                }`}
              >
                {step}
              </span>
              {i < CHAIN.length - 1 && <span className="text-gold/50 text-xs">→</span>}
            </span>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-taupe font-grotesk">
          System concept — illustrates the intended reward path, not live infrastructure.
        </p>
      </Reveal>

      {/* Pillars */}
      <Stagger className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4" gap={0.08}>
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
