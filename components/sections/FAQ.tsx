'use client';

import { useState } from 'react';
import { FAQS, SITE } from '@/lib/config';
import { SectionHeading } from './SectionHeading';
import { QuantumField } from '@/components/motion/QuantumField';
import { GlowCard } from '@/components/ui/GlowCard';
import { Icon } from '../Icon';

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-28 scroll-mt-24">
      <SectionHeading
        tag="FAQ"
        title={<>Honest answers.</>}
        subtitle={`If something is unclear, email ${SITE.email} directly. I respond personally.`}
      />
      <div className="flex flex-col gap-3">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="rounded-2xl glass-luxe overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-gold/[0.04] cursor-pointer"
              >
                <span className="font-grotesk font-medium text-ivory">{item.q}</span>
                <span className={`text-gold transition-transform shrink-0 ${isOpen ? 'rotate-45' : ''}`}>
                  <Icon name="plus" size={20} />
                </span>
              </button>
              <div
                className="grid transition-all duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm text-ash leading-relaxed">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function WhitepaperCTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <GlowCard className="relative overflow-hidden rounded-[2rem] glass-luxe p-12 md:p-16 text-center">
        {/* layered backdrop — bookends the hero's quantum field */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <QuantumField className="absolute inset-0 opacity-40" />
          <div
            className="absolute inset-0 opacity-20 animate-spin-slow"
            style={{ background: 'conic-gradient(from 0deg, transparent, rgba(227,179,65,0.45), transparent, rgba(154,111,36,0.4), transparent)' }}
          />
        </div>
        <div className="relative z-10">
          <div className="text-xs font-grotesk font-semibold uppercase tracking-eyebrow text-gold mb-4">Documentation</div>
          <h2 className="font-serif font-semibold text-display text-ivory mb-4">Whitepaper v1.3</h2>
          <p className="font-grotesk text-ash text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            The full technical and economic spec — tokenomics, vesting, smart-contract architecture, the miner
            program, security posture, and complete risk disclosure.
          </p>
          <a
            href="/whitepaper"
            className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-8 py-4 font-grotesk font-semibold text-obsidian transition-[filter,box-shadow] duration-300 hover:brightness-105 hover:shadow-[0_10px_40px_-12px_rgba(227,179,65,0.5)] cursor-pointer"
          >
            <Icon name="doc" size={18} />
            Read Full Whitepaper
            <Icon name="arrow" size={18} />
          </a>
        </div>
      </GlowCard>
    </section>
  );
}
