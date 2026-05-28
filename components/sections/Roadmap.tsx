'use client';

import { ROADMAP } from '@/lib/config';
import { SectionHeading } from './SectionHeading';
import { useReveal } from '@/lib/useReveal';

const STATUS_STYLE: Record<string, string> = {
  done: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  now: 'bg-gradient-to-r from-cyan/15 to-violet/15 text-cyan-bright border-violet/30',
  planned: 'bg-white/5 text-fog border-white/10',
};
const STATUS_LABEL: Record<string, string> = { done: 'Done', now: 'Now', planned: 'Planned' };

function RoadmapCard({ item, i }: { item: (typeof ROADMAP)[number]; i: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`relative grid md:grid-cols-[150px_1fr] gap-6 rounded-3xl glass p-7 reveal ${visible ? 'visible' : ''} ${
        item.status === 'now' ? 'border-violet/30 bg-gradient-to-r from-violet/[0.06] to-transparent' : ''
      }`}
      style={{ transitionDelay: `${i * 80}ms` }}
    >
      <div>
        <div className="font-display font-medium text-ghost">{item.period}</div>
        <span className={`inline-block mt-2 rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLE[item.status]}`}>
          {STATUS_LABEL[item.status]}
        </span>
      </div>
      <div>
        <h3 className="font-display font-medium text-lg text-ghost mb-3">{item.title}</h3>
        <ul className="space-y-1.5">
          {item.items.map((t) => (
            <li key={t} className="flex gap-2.5 text-sm text-mist">
              <span className="text-gradient mt-0.5">→</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Roadmap() {
  return (
    <section id="roadmap" className="mx-auto max-w-5xl px-6 py-28 scroll-mt-24">
      <SectionHeading
        tag="Roadmap"
        title={<>Where we are. Where we&apos;re going.</>}
        subtitle="Color-coded honestly: green = done & verifiable, gradient = currently active, gray = planned. No vague filler."
      />
      <div className="flex flex-col gap-4">
        {ROADMAP.map((item, i) => (
          <RoadmapCard key={item.period} item={item} i={i} />
        ))}
      </div>
    </section>
  );
}
