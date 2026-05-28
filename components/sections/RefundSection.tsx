'use client';

import { REFUND_ELIGIBLE, REFUND_NOT_ELIGIBLE, REFUND_RULES } from '@/lib/config';
import { SectionHeading } from './SectionHeading';
import { useReveal } from '@/lib/useReveal';
import { Icon } from '../Icon';

export function RefundSection() {
  const { ref, visible } = useReveal();
  return (
    <section id="refund" className="mx-auto max-w-7xl px-6 py-28 scroll-mt-24">
      <SectionHeading
        tag="Refund Policy"
        title={<>Clear on refunds.</>}
        subtitle="We take funds before launch, so we're explicit about when a refund may apply — and when it doesn't. This is a summary; the full Refund Policy governs."
      />

      <div ref={ref} className={`grid md:grid-cols-2 gap-5 mb-6 reveal ${visible ? 'visible' : ''}`}>
        {/* Eligible */}
        <div className="glass rounded-3xl p-7 border-l-2 border-l-cyan/50">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
              <Icon name="check" size={18} />
            </div>
            <h3 className="font-display font-medium text-lg text-ghost">A refund may apply if</h3>
          </div>
          <ul className="space-y-3">
            {REFUND_ELIGIBLE.map((r) => (
              <li key={r} className="flex gap-3 text-sm text-mist">
                <span className="text-cyan mt-0.5 shrink-0">→</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Not eligible */}
        <div className="glass rounded-3xl p-7 border-l-2 border-l-fog/40">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-fog">
              <Icon name="alert" size={18} />
            </div>
            <h3 className="font-display font-medium text-lg text-ghost">A refund does not apply if</h3>
          </div>
          <ul className="space-y-3">
            {REFUND_NOT_ELIGIBLE.map((r) => (
              <li key={r} className="flex gap-3 text-sm text-mist">
                <span className="text-fog mt-0.5 shrink-0">×</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Rules strip */}
      <div className="glass rounded-3xl p-7">
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
          {REFUND_RULES.map((r) => (
            <div key={r} className="flex gap-3 text-sm text-mist">
              <Icon name="shield" size={16} className="text-violet-bright shrink-0 mt-0.5" />
              <span>{r}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-5 border-t border-white/5">
          <a href="/refund-policy" className="inline-flex items-center gap-2 text-sm font-medium text-gradient">
            Read the full Refund Policy
            <Icon name="arrow" size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
