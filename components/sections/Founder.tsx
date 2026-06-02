'use client';

import { FOUNDER, SOCIALS, SITE } from '@/lib/config';
import { Icon } from '../Icon';
import { Reveal } from '@/components/motion';

export function Founder() {
  const socialLink =
    'inline-flex items-center gap-2 rounded-xl border border-gold/20 bg-obsidian/40 px-4 py-2.5 text-sm text-ivory transition-all hover:border-gold/50 hover:bg-gold/5 cursor-pointer';
  return (
    <section id="founder" className="mx-auto max-w-7xl px-6 py-20 sm:py-28 scroll-mt-24">
      <Reveal className="relative overflow-hidden rounded-[2rem] glass-luxe p-10 md:p-14 grid md:grid-cols-[220px_1fr] gap-12 items-center">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-1/3 right-0 h-96 w-96 opacity-40" style={{ background: 'radial-gradient(circle, rgba(227,179,65,0.13), transparent 60%)' }} />

        {/* Photo */}
        <div className="relative mx-auto">
          <div className="absolute -inset-1 rounded-3xl bg-gold-gradient opacity-40 blur-md" />
          <div className="relative h-52 w-52 rounded-3xl bg-gold-gradient flex items-center justify-center overflow-hidden border border-white/10">
            {/* If photo exists it covers the initials */}
            <img
              src={FOUNDER.photo}
              alt={FOUNDER.name}
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="font-serif font-semibold text-6xl text-obsidian">{FOUNDER.initials}</span>
          </div>
        </div>

        {/* Body */}
        <div className="relative">
          <div className="text-xs font-grotesk font-semibold uppercase tracking-eyebrow text-gold mb-3">Doxxed Founder</div>
          <h2 className="font-serif font-semibold text-4xl text-ivory mb-2">{FOUNDER.name}</h2>
          <p className="font-grotesk text-ash mb-6">
            {FOUNDER.role} · {FOUNDER.location}
          </p>
          <p className="font-grotesk text-ash leading-relaxed mb-7 max-w-2xl">{FOUNDER.bio}</p>
          <div className="flex flex-wrap gap-3">
            <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" className={socialLink}>
              <Icon name="linkedin" size={16} /> LinkedIn
            </a>
            <a href={SOCIALS.github} target="_blank" rel="noopener noreferrer" className={socialLink}>
              <Icon name="github" size={16} /> GitHub
            </a>
            <a href={`mailto:${SITE.email}`} className={socialLink}>
              <Icon name="mail" size={16} /> {SITE.email}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
