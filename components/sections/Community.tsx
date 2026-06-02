'use client';

import { COMMUNITY } from '@/lib/config';
import { SectionHeading } from './SectionHeading';
import { Stagger, StaggerItem } from '@/components/motion';
import { QuantumField } from '@/components/motion/QuantumField';
import { GlowCard } from '@/components/ui/GlowCard';
import { Icon } from '../Icon';

export function Community() {
  return (
    <section id="community" className="relative mx-auto max-w-7xl px-6 py-28 scroll-mt-24 overflow-hidden">
      {/* Faint network backdrop — bookends the hero */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <QuantumField className="absolute inset-0 opacity-[0.35]" />
      </div>

      <SectionHeading tag="Community" title={<>Community-first.</>} subtitle={COMMUNITY.intro} />
      <Stagger className="grid md:grid-cols-2 gap-5" gap={0.08}>
        {COMMUNITY.channels.map((c) => (
          <StaggerItem key={c.name}>
            <GlowCard className="group glow-gold glass-luxe rounded-3xl transition-transform duration-300 hover:-translate-y-1">
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 p-8 cursor-pointer"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20 text-gold transition-transform group-hover:scale-110">
                  <Icon name={c.icon} size={26} />
                </div>
                <div className="flex-grow">
                  <h3 className="font-serif font-medium text-xl text-ivory mb-0.5">{c.name}</h3>
                  <p className="font-grotesk text-sm text-ash">{c.desc}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-gradient px-4 py-2 text-sm font-grotesk font-semibold text-obsidian shrink-0">
                  {c.cta}
                  <Icon name="arrow" size={15} />
                </span>
              </a>
            </GlowCard>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
