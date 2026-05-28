const STYLES: Record<string, string> = {
  // purchase
  pending: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
  confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  refunded: 'bg-violet/10 text-violet-bright border-violet/25',
  // refund
  not_requested: 'bg-white/5 text-fog border-white/10',
  requested: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
  under_review: 'bg-cyan/10 text-cyan-bright border-cyan/25',
  approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

const LABELS: Record<string, string> = {
  not_requested: 'Not requested',
  under_review: 'Under review',
};

export function StatusBadge({ status }: { status: string }) {
  const label = LABELS[status] ?? status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${STYLES[status] ?? STYLES.not_requested}`}>
      {label}
    </span>
  );
}
