'use client';

import { ROADMAP } from '@/lib/config';
import { SectionHeading } from './SectionHeading';
import { Stagger, StaggerItem } from '@/components/motion';

const STATUS_STYLE: Record<string, string> = {
  done: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  now: 'bg-gradient-to-r from-gold/15 to-gold-deep/10 text-gold-bright border-gold/30',
  planned: 'bg-white/5 text-taupe border-white/10',
};
const STATUS_LABEL: Record<string, string> = { done: 'Done', now: 'Now', planned: 'Planned' };

function RoadmapCard({ item }: { item: (typeof ROADMAP)[number] }) {
  return (
    <StaggerItem
      className={`relative grid md:grid-cols-[150px_1fr] gap-6 rounded-3xl glass-luxe p-7 ${
        item.status === 'now' ? 'border-gold/30 bg-gradient-to-r from-gold/[0.06] to-transparent' : ''
      }`}
    >
      <div>
        <div className="font-serif font-medium text-ivory">{item.period}</div>
        <span className={`inline-block mt-2 rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-eyebrow ${STATUS_STYLE[item.status]}`}>
          {STATUS_LABEL[item.status]}
        </span>
      </div>
      <div>
        <h3 className="font-serif font-medium text-lg text-ivory mb-3">{item.title}</h3>
        <ul className="space-y-1.5">
          {item.items.map((t) => (
            <li key={t} className="flex gap-2.5 text-sm text-ash">
              <span className="text-gold mt-0.5">→</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </StaggerItem>
  );
}

export function Roadmap() {
  return (
    <section id="roadmap" className="mx-auto max-w-5xl px-6 py-28 scroll-mt-24">
      <SectionHeading
        tag="Roadmap"
        title={<>Where we are. Where we&apos;re going.</>}
        subtitle="Color-coded honestly: green = done & verifiable, gold = currently active, gray = planned. No vague filler."
      />
      <Stagger className="flex flex-col gap-4" gap={0.08}>
        {ROADMAP.map((item) => (
          <RoadmapCard key={item.period} item={item} />
        ))}
      </Stagger>
    </section>
  );
}
