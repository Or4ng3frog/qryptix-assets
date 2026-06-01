'use client';

import { useEffect, useState } from 'react';
import { WP_INDEX } from '@/lib/whitepaper';

export function WhitepaperSidebar() {
  const [active, setActive] = useState(WP_INDEX[0].id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-25% 0px -65% 0px' }
    );
    WP_INDEX.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <aside className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-6 border-r border-gold/10">
      <div className="glass-luxe rounded-2xl p-4 mb-7 text-xs space-y-2">
        {[
          ['Version', '1.3'],
          ['Status', 'Active'],
          ['Last update', 'May 2026'],
          ['Network', 'Base · L2'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-taupe">{k}</span>
            <span className={`font-medium ${v === 'Active' ? 'text-emerald-400' : 'text-ivory'}`}>{v}</span>
          </div>
        ))}
      </div>
      <h4 className="text-[11px] uppercase tracking-[0.15em] text-taupe mb-3 font-semibold">Contents</h4>
      <ol className="space-y-0.5">
        {WP_INDEX.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`block rounded-lg px-3 py-1.5 text-[13px] border-l-2 transition-all ${
                active === s.id
                  ? 'text-gold border-gold bg-gold/5'
                  : 'text-ash border-transparent hover:text-ivory hover:bg-gold/[0.03]'
              }`}
            >
              <span className="font-mono text-[11px] text-taupe mr-2">
                {String(i + 1).padStart(2, '0')}
              </span>
              {s.label}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
