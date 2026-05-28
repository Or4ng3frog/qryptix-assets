'use client';

import { useState } from 'react';
import { FAQS, SITE } from '@/lib/config';
import { SectionHeading } from './SectionHeading';
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
            <div key={i} className="rounded-2xl glass overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-violet/[0.03]"
              >
                <span className="font-medium text-ghost">{item.q}</span>
                <span className={`text-violet-bright transition-transform shrink-0 ${isOpen ? 'rotate-45' : ''}`}>
                  <Icon name="plus" size={20} />
                </span>
              </button>
              <div
                className="grid transition-all duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm text-mist leading-relaxed">{item.a}</p>
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
      <div className="relative overflow-hidden rounded-[2rem] glass p-12 md:p-16 text-center">
        <div className="pointer-events-none absolute inset-0 conic-glow opacity-20 animate-spin-slow" />
        <div className="relative">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gradient mb-4">Documentation</div>
          <h2 className="font-display font-semibold text-giant mb-4">Whitepaper v1.3</h2>
          <p className="text-mist text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            The full technical and economic spec — tokenomics, vesting, smart-contract architecture, the miner
            program, security posture, and complete risk disclosure.
          </p>
          <a
            href="/whitepaper"
            className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-8 py-4 font-semibold text-void transition-transform hover:scale-105 hover:shadow-[0_8px_30px_-8px_rgba(168,139,255,0.6)]"
          >
            <Icon name="doc" size={18} />
            Read Full Whitepaper
            <Icon name="arrow" size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
