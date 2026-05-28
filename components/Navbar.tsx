'use client';

import { useEffect, useState } from 'react';
import { SITE } from '@/lib/config';

const NAV = [
  { label: 'PreSale', href: '#presale' },
  { label: 'Tokenomics', href: '#tokenomics' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Refund', href: '#refund' },
  { label: 'Community', href: '#community' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 bg-void/80 backdrop-blur-xl border-b border-violet/10' : 'py-5 bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 group">
          <img src="/Q_Only.png" alt="Qryptix" className="h-9 w-9 transition-transform group-hover:scale-110" />
          <span className="font-display font-semibold text-lg tracking-tight">QRYPTIX</span>
        </a>

        <nav className="hidden md:flex items-center gap-9">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-mist hover:text-ghost transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand-gradient transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-violet/25 px-4 py-2.5 text-sm font-medium text-ghost transition-all hover:border-violet/60 hover:bg-violet/5"
          >
            Dashboard
          </a>
          <a
            href="/buy"
            className="relative inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-void transition-transform hover:scale-105 hover:shadow-[0_8px_30px_-8px_rgba(168,139,255,0.6)]"
          >
            Join PreSale
          </a>
        </div>
      </div>
    </header>
  );
}
