'use client';

import { WHY_FEATURES } from '@/lib/config';
import { SectionHeading } from './SectionHeading';
import { Icon } from '../Icon';
import { useReveal } from '@/lib/useReveal';

function FeatureCard({ icon, title, desc, i }: { icon: string; title: string; desc: string; i: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`group glow-border rounded-3xl glass p-7 transition-all duration-500 hover:-translate-y-1 reveal ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${i * 70}ms` }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan/15 to-violet/15 border border-violet/20 text-violet-bright mb-5 transition-transform group-hover:scale-110">
        <Icon name={icon} size={22} />
      </div>
      <h3 className="font-display font-medium text-lg text-ghost mb-2">{title}</h3>
      <p className="text-sm text-mist leading-relaxed">{desc}</p>
    </div>
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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {WHY_FEATURES.map((f, i) => (
          <FeatureCard key={f.title} {...f} i={i} />
        ))}
      </div>
    </section>
  );
}
