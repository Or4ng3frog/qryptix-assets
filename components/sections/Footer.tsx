'use client';

import { SITE, SOCIALS, FOUNDER, RISKS } from '@/lib/config';
import { Icon } from '../Icon';

export function RiskDisclosure() {
  return (
    <section id="risk" className="mx-auto max-w-5xl px-6 py-20 scroll-mt-24">
      <div className="rounded-3xl border border-red-500/20 bg-red-500/[0.04] p-8 md:p-10">
        <h3 className="flex items-center gap-2.5 text-red-400 font-display font-medium text-xl mb-2">
          <Icon name="alert" size={20} /> Risk Disclosure
        </h3>
        <p className="text-sm text-mist leading-relaxed mb-6 max-w-3xl">
          Please read carefully before participating. Participation in the Qryptix PreSale is entirely voluntary
          and carries substantial risk, including total loss of the funds you contribute.
        </p>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-2.5">
          {RISKS.map((r) => (
            <div key={r} className="flex gap-2.5 text-sm text-mist">
              <span className="text-red-400/70 mt-0.5 shrink-0">•</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
        <div className="mt-7 pt-5 border-t border-red-500/15">
          <a href="/risk-disclosure" className="inline-flex items-center gap-2 text-sm font-medium text-red-300 hover:text-red-200 transition-colors">
            Read the full Risk Disclosure
            <Icon name="arrow" size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-violet/10 bg-abyss/50 pt-16 pb-8 mt-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/Q_Only.png" alt="Qryptix" className="h-9 w-9" />
              <span className="font-display font-semibold text-lg">QRYPTIX</span>
            </div>
            <p className="text-sm text-mist max-w-xs leading-relaxed mb-5">
              A practical multi-utility token on Base. Solo-founder operated. Pre-sale reservation active · TGE
              planned {SITE.tgeTarget}.
            </p>
            <div className="flex gap-2.5">
              {[
                { icon: 'twitter', href: SOCIALS.twitter },
                { icon: 'telegram', href: SOCIALS.telegram },
                { icon: 'discord', href: SOCIALS.discord },
                { icon: 'github', href: SOCIALS.github },
              ].map((s) => (
                <a
                  key={s.icon}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet/15 bg-void/40 text-mist transition-all hover:text-violet-bright hover:border-violet/40"
                >
                  <Icon name={s.icon} size={16} />
                </a>
              ))}
            </div>
          </div>

          {[
            { h: 'Project', links: [['PreSale', '#presale'], ['Tokenomics', '#tokenomics'], ['Roadmap', '#roadmap'], ['Whitepaper', '/whitepaper']] },
            { h: 'Participate', links: [['Dashboard', '/dashboard'], ['Refund Policy', '/refund-policy'], ['Community', '#community'], ['Basescan Contract', SITE.basescanUrl]] },
            { h: 'Legal', links: [['Terms of Use', '/terms'], ['PreSale Terms', '/presale-terms'], ['Privacy Policy', '/privacy'], ['Risk Disclosure', '/risk-disclosure']] },
          ].map((col) => (
            <div key={col.h}>
              <h4 className="text-xs uppercase tracking-[0.15em] text-fog mb-4">{col.h}</h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-sm text-mist hover:text-ghost transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-3 pt-7 border-t border-violet/10 text-xs text-fog">
          <span>© 2026 Qryptix · Operated by {FOUNDER.name} · {FOUNDER.location}</span>
          <span>Built on Base · Ethereum L2</span>
        </div>
      </div>
    </footer>
  );
}
