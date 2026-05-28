'use client';

import { FOUNDER, SOCIALS, SITE } from '@/lib/config';
import { Icon } from '../Icon';
import { useReveal } from '@/lib/useReveal';

export function Founder() {
  const { ref, visible } = useReveal();
  return (
    <section id="founder" className="mx-auto max-w-7xl px-6 py-28 scroll-mt-24">
      <div
        ref={ref}
        className={`relative overflow-hidden rounded-[2rem] glass p-10 md:p-14 grid md:grid-cols-[220px_1fr] gap-12 items-center reveal ${visible ? 'visible' : ''}`}
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-1/3 right-0 h-96 w-96 opacity-40" style={{ background: 'radial-gradient(circle, rgba(168,139,255,0.15), transparent 60%)' }} />

        {/* Photo */}
        <div className="relative mx-auto">
          <div className="absolute -inset-1 rounded-3xl bg-brand-gradient opacity-40 blur-md" />
          <div className="relative h-52 w-52 rounded-3xl bg-gradient-to-br from-cyan to-violet flex items-center justify-center overflow-hidden border border-white/10">
            {/* If photo exists it covers the initials */}
            <img
              src={FOUNDER.photo}
              alt={FOUNDER.name}
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="font-display font-semibold text-6xl text-void">{FOUNDER.initials}</span>
          </div>
        </div>

        {/* Body */}
        <div className="relative">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gradient mb-3">Doxxed Founder</div>
          <h2 className="font-display font-semibold text-4xl mb-2">{FOUNDER.name}</h2>
          <p className="text-mist mb-6">
            {FOUNDER.role} · {FOUNDER.location}
          </p>
          <p className="text-mist leading-relaxed mb-7 max-w-2xl">{FOUNDER.bio}</p>
          <div className="flex flex-wrap gap-3">
            <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-violet/20 bg-void/40 px-4 py-2.5 text-sm text-ghost transition-all hover:border-violet/50 hover:bg-violet/5">
              <Icon name="linkedin" size={16} /> LinkedIn
            </a>
            <a href={SOCIALS.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-violet/20 bg-void/40 px-4 py-2.5 text-sm text-ghost transition-all hover:border-violet/50 hover:bg-violet/5">
              <Icon name="github" size={16} /> GitHub
            </a>
            <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 rounded-xl border border-violet/20 bg-void/40 px-4 py-2.5 text-sm text-ghost transition-all hover:border-violet/50 hover:bg-violet/5">
              <Icon name="mail" size={16} /> {SITE.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
