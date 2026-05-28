'use client';

import { useReveal } from '@/lib/useReveal';

export function SectionHeading({
  tag,
  title,
  subtitle,
}: {
  tag: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`text-center mb-14 reveal ${visible ? 'visible' : ''}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gradient mb-4">{tag}</div>
      <h2 className="font-display font-semibold text-giant mb-4">{title}</h2>
      {subtitle && <p className="text-mist text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
    </div>
  );
}
