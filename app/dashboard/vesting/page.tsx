import { getDashboardData } from '@/lib/dashboard-data';
import { SITE } from '@/lib/config';
import { PageTitle, Card, StatCard, fmtQtx } from '@/components/dashboard-ui';
import { Icon } from '@/components/Icon';

export default async function VestingPage() {
  const data = await getDashboardData();
  if (!data) return null;
  const { allocation } = data;

  const total = allocation.total_qtx || 0;
  const unlocked = allocation.unlocked_at_tge || 0;
  const pctUnlocked = total > 0 ? Math.round((unlocked / total) * 100) : 0;

  return (
    <>
      <PageTitle
        title="Vesting & Allocation"
        subtitle="How your QTX unlocks over time. These terms are planned and subject to finalisation before TGE."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total allocation" value={`${fmtQtx(total)}`} sub="QTX" />
        <StatCard label="Unlocked at TGE" value={`${fmtQtx(unlocked)}`} sub={`${pctUnlocked}% at launch`} />
        <StatCard label="Locked" value={`${fmtQtx(allocation.locked_qtx)}`} sub="Vests over time" />
        <StatCard label="Next unlock" value={allocation.next_unlock_at ? new Date(allocation.next_unlock_at).toLocaleDateString() : 'TGE'} sub="Estimated" />
      </div>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-ghost">Vesting progress</span>
          <span className="text-xs text-fog">{pctUnlocked}% unlocked at TGE</span>
        </div>
        <div className="h-3 rounded-full bg-void/60 overflow-hidden mb-3">
          <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${pctUnlocked}%` }} />
        </div>
        <div className="flex justify-between text-xs text-fog">
          <span>TGE: {pctUnlocked}% unlock</span>
          <span>Remainder: linear over 8 months</span>
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-3">
          <Icon name="alert" size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-ghost mb-1">Subject to final terms</div>
            <p className="text-sm text-mist leading-relaxed">{allocation.vesting_note}</p>
            <p className="text-xs text-fog mt-2">
              Per current planning: 10% of your allocation unlocks at TGE (planned {SITE.tgeTarget}), with the
              remaining 90% vesting linearly over the following 8 months. Final vesting terms will be confirmed
              before TGE.
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}
