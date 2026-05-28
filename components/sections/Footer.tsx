'use client';

import { SITE, SOCIALS, FOUNDER } from '@/lib/config';
import { Icon } from '../Icon';

export function RiskDisclosure() {
  return (
    <section id="risk" className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-7">
        <h3 className="flex items-center gap-2.5 text-red-400 font-semibold mb-3">
          <Icon name="alert" size={18} /> Risk Disclosure
        </h3>
        <p className="text-sm text-mist leading-relaxed">
          Qryptix (QTX) is a speculative digital asset. Token prices can be highly volatile and can lose all
          value. Nothing on this website constitutes financial, investment, legal, tax, or accounting advice. The
          project is in an early stage: the smart contract has not yet been independently audited, the operating
          entity is in setup, and no token purchases are accepted today. The hardware miner program is in
          manufacturer-selection phase — specifications and pricing are indicative only. Participation may be
          restricted or prohibited in certain jurisdictions including the European Union under MiCAR. By using this
          website you confirm you understand these risks and comply with your local laws. Do your own research and
          only allocate funds you can afford to lose entirely.
        </p>
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
            { h: 'Project', links: [['Tokenomics', '#tokenomics'], ['Roadmap', '#roadmap'], ['Founder', '#founder'], ['Whitepaper', '/whitepaper']] },
            { h: 'Resources', links: [['Basescan Contract', SITE.basescanUrl], ['FAQ', '#faq'], ['Miners', '#miners'], ['Contact', `mailto:${SITE.email}`]] },
            { h: 'Legal', links: [['Terms of Use', '#'], ['Privacy Policy', '#'], ['Cookie Policy', '#'], ['Risk Disclosure', '#risk']] },
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
