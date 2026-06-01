'use client';

import { WHY_FEATURES } from '@/lib/config';
import { SectionHeading } from './SectionHeading';
import { Icon } from '../Icon';
import { Stagger, StaggerItem } from '@/components/motion';

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <StaggerItem className="group glow-gold h-full rounded-3xl glass-luxe p-7 transition-[transform,border-color] duration-500 hover:-translate-y-1">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20 text-gold mb-5 transition-transform group-hover:scale-110">
        <Icon name={icon} size={22} />
      </div>
      <h3 className="font-serif font-medium text-lg text-ivory mb-2">{title}</h3>
      <p className="font-grotesk text-sm text-ash leading-relaxed">{desc}</p>
    </StaggerItem>
  );
}

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <SectionHeading
        tag="Why Qryptix"
        title={<>Built for actual utility.</>}
        subtitle="Transparency on-chain, real-world usage through hardware mining, and sustainable emissions with caps."
      />
      <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" gap={0.07}>
        {WHY_FEATURES.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </Stagger>
    </section>
  );
}
