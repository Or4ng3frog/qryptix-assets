import { SITE } from '@/lib/config';

export function LegalLayout({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-void/90 backdrop-blur-xl border-b border-violet/10">
        <div className="mx-auto max-w-4xl px-6 py-3.5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/Q_Only.png" alt="Qryptix" className="h-8 w-8" />
            <span className="font-display font-semibold">QRYPTIX</span>
          </a>
          <a href="/" className="text-sm text-mist hover:text-ghost transition-colors">
            ← Back to home
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16 pb-32">
        {/* Draft notice */}
        <div className="mb-10 rounded-xl border border-amber-400/20 bg-amber-400/[0.04] px-5 py-4">
          <p className="text-sm text-amber-200/80 leading-relaxed">
            <strong className="text-amber-300">Draft — pending legal review.</strong> This document is a working
            draft prepared as a solid starting point. It has not yet been reviewed by a qualified lawyer and must
            be finalized by legal counsel before {SITE.name} accepts any funds.
          </p>
        </div>

        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gradient mb-3">Legal</div>
        <h1 className="font-display font-semibold text-4xl md:text-5xl mb-3">{title}</h1>
        <p className="text-fog text-sm mb-2">Last updated: {updated}</p>
        {intro && <p className="text-mist text-lg leading-relaxed mt-6">{intro}</p>}

        <div className="mt-10 legal-prose">{children}</div>

        <div className="mt-16 pt-8 border-t border-violet/10 flex flex-wrap gap-4 text-sm">
          <a href="/terms" className="text-mist hover:text-ghost transition-colors">Terms of Use</a>
          <a href="/refund-policy" className="text-mist hover:text-ghost transition-colors">Refund Policy</a>
          <a href="/risk-disclosure" className="text-mist hover:text-ghost transition-colors">Risk Disclosure</a>
          <a href="/privacy" className="text-mist hover:text-ghost transition-colors">Privacy Policy</a>
          <a href="/presale-terms" className="text-mist hover:text-ghost transition-colors">PreSale Terms</a>
        </div>
      </div>
    </div>
  );
}

// Prose primitives for legal pages
export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display font-medium text-2xl text-ghost mt-12 mb-4">{children}</h2>;
}
export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-mist leading-relaxed mb-4">{children}</p>;
}
export function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2 mb-4">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-mist">
          <span className="text-gradient mt-1 shrink-0">→</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
