export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-7">
      <h1 className="font-serif font-semibold text-2xl md:text-3xl text-ivory mb-1.5">{title}</h1>
      {subtitle && <p className="text-ash text-sm leading-relaxed max-w-2xl">{subtitle}</p>}
    </div>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass-luxe rounded-2xl p-6 ${className}`}>{children}</div>;
}

export function StatCard({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="glass-luxe rounded-2xl p-5">
      <div className="text-[10px] uppercase tracking-eyebrow text-taupe mb-2">{label}</div>
      <div className="font-serif font-semibold text-2xl text-gold">{value}</div>
      {sub && <div className="text-xs text-taupe mt-1">{sub}</div>}
    </div>
  );
}

export function EmptyState({ icon, title, desc }: { icon?: React.ReactNode; title: string; desc?: string }) {
  return (
    <div className="glass-luxe rounded-2xl p-10 text-center">
      {icon && <div className="mx-auto mb-3 text-taupe">{icon}</div>}
      <div className="font-serif font-medium text-ivory mb-1">{title}</div>
      {desc && <p className="text-sm text-ash max-w-sm mx-auto">{desc}</p>}
    </div>
  );
}

export function fmtQtx(n: number) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}
export function fmtMoney(n: number, ccy = 'USD') {
  return `${n.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${ccy}`;
}
export function shortHash(h: string | null) {
  if (!h) return '—';
  return `${h.slice(0, 8)}…${h.slice(-6)}`;
}
export function shortAddr(a: string | null) {
  if (!a) return '—';
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}
