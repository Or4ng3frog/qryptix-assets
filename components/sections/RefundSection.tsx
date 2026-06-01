'use client';

import { REFUND_ELIGIBLE, REFUND_NOT_ELIGIBLE, REFUND_RULES } from '@/lib/config';
import { SectionHeading } from './SectionHeading';
import { Reveal } from '@/components/motion';
import { Icon } from '../Icon';

export function RefundSection() {
  return (
    <section id="refund" className="mx-auto max-w-7xl px-6 py-28 scroll-mt-24">
      <SectionHeading
        tag="Refund Policy"
        title={<>Clear on refunds.</>}
        subtitle="We take funds before launch, so we're explicit about when a refund may apply — and when it doesn't. This is a summary; the full Refund Policy governs."
      />

      <Reveal className="grid md:grid-cols-2 gap-5 mb-6">
        {/* Eligible */}
        <div className="glass-luxe rounded-3xl p-7 border-l-2 border-l-gold/50">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <Icon name="check" size={18} />
            </div>
            <h3 className="font-serif font-medium text-lg text-ivory">A refund may apply if</h3>
          </div>
          <ul className="space-y-3">
            {REFUND_ELIGIBLE.map((r) => (
              <li key={r} className="flex gap-3 text-sm text-ash">
                <span className="text-gold mt-0.5 shrink-0">→</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Not eligible */}
        <div className="glass-luxe rounded-3xl p-7 border-l-2 border-l-taupe/40">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-taupe">
              <Icon name="alert" size={18} />
            </div>
            <h3 className="font-serif font-medium text-lg text-ivory">A refund does not apply if</h3>
          </div>
          <ul className="space-y-3">
            {REFUND_NOT_ELIGIBLE.map((r) => (
              <li key={r} className="flex gap-3 text-sm text-ash">
                <span className="text-taupe mt-0.5 shrink-0">×</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Rules strip */}
      <div className="glass-luxe rounded-3xl p-7">
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
          {REFUND_RULES.map((r) => (
            <div key={r} className="flex gap-3 text-sm text-ash">
              <Icon name="shield" size={16} className="text-gold shrink-0 mt-0.5" />
              <span>{r}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-5 border-t border-white/[0.06]">
          <a href="/refund-policy" className="inline-flex items-center gap-2 text-sm font-grotesk font-medium text-gold hover:brightness-110 transition cursor-pointer">
            Read the full Refund Policy
            <Icon name="arrow" size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
