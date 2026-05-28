'use client';

import { COMMUNITY } from '@/lib/config';
import { SectionHeading } from './SectionHeading';
import { useReveal } from '@/lib/useReveal';
import { Icon } from '../Icon';

export function Community() {
  const { ref, visible } = useReveal();
  return (
    <section id="community" className="mx-auto max-w-7xl px-6 py-28 scroll-mt-24">
      <SectionHeading
        tag="Community"
        title={<>Community-first.</>}
        subtitle={COMMUNITY.intro}
      />
      <div ref={ref} className={`grid md:grid-cols-2 gap-5 reveal ${visible ? 'visible' : ''}`}>
        {COMMUNITY.channels.map((c) => (
          <a
            key={c.name}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group glow-border glass rounded-3xl p-8 flex items-center gap-5 transition-all hover:-translate-y-1"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan/15 to-violet/15 border border-violet/20 text-violet-bright transition-transform group-hover:scale-110">
              <Icon name={c.icon} size={26} />
            </div>
            <div className="flex-grow">
              <h3 className="font-display font-medium text-xl text-ghost mb-0.5">{c.name}</h3>
              <p className="text-sm text-mist">{c.desc}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2 text-sm font-semibold text-void shrink-0">
              {c.cta}
              <Icon name="arrow" size={15} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
