'use client';

import { SITE } from '@/lib/config';
import { Icon } from '../Icon';

const TRUST = [
  { icon: 'boxes', t1: 'Base Network', t2: 'Ethereum L2' },
  { icon: 'shield', t1: 'Fixed Supply', t2: '1B QTX, on-chain' },
  { icon: 'lock', t1: 'Vesting', t2: 'Transparent schedule' },
  { icon: 'check', t1: 'Refund Policy', t2: 'Clear & published' },
  { icon: 'linkedin', t1: 'Founder Doxxed', t2: 'Public on LinkedIn' },
  { icon: 'doc', t1: 'Transparent PreSale', t2: 'Honest disclosure' },
];

export function TrustStrip() {
  const items = [...TRUST, ...TRUST];
  return (
    <div className="relative border-y border-violet/10 bg-abyss/50 py-6 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-void to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-void to-transparent" />
      <div className="flex marquee-track w-max gap-10">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan/15 to-violet/15 border border-violet/20 text-cyan">
              <Icon name={item.icon} size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-ghost">{item.t1}</div>
              <div className="text-xs text-fog">{item.t2}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
