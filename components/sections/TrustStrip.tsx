'use client';

import { SITE } from '@/lib/config';
import { Icon } from '../Icon';

const TRUST = [
  { icon: 'boxes', t1: 'Contract on Base', t2: 'Verified on Basescan' },
  { icon: 'linkedin', t1: 'Doxxed Founder', t2: 'Public on LinkedIn' },
  { icon: 'shield', t1: 'Fixed 1B Supply', t2: 'Enforced on-chain' },
  { icon: 'lock', t1: '12-Month LP Lock', t2: 'At launch' },
  { icon: 'doc', t1: 'Open Whitepaper', t2: 'Full disclosure' },
  { icon: 'gauge', t1: 'Capped Emissions', t2: 'Degressive schedule' },
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
