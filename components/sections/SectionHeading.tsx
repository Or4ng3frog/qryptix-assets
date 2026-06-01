'use client';

import { Reveal } from '@/components/motion';

export function SectionHeading({
  tag,
  title,
  subtitle,
}: {
  tag: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <Reveal className="text-center mb-14">
      <div className="text-xs font-grotesk font-semibold uppercase tracking-eyebrow text-gold mb-4">{tag}</div>
      <h2 className="font-serif font-semibold text-display text-ivory mb-4">{title}</h2>
      {subtitle && (
        <p className="font-grotesk text-ash text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
      )}
    </Reveal>
  );
}
