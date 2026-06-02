import { getDashboardData } from '@/lib/dashboard-data';
import { PHASES, SITE } from '@/lib/config';
import { PageTitle, StatCard, Card, fmtQtx, fmtMoney, shortAddr } from '@/components/dashboard-ui';
import { StatusBadge } from '@/components/StatusBadge';
import { Icon } from '@/components/Icon';

export default async function DashboardOverview() {
  const data = await getDashboardData();
  if (!data) return null;
  const { profile, wallets, purchases, allocation, refunds } = data;

  const activeStage = PHASES.find((p) => p.active) ?? PHASES[0];
  const totalPaidUsd = purchases
    .filter((p) => p.status === 'confirmed')
    .reduce((s, p) => s + (p.amount_paid_usd ?? 0), 0);
  const totalQtx = purchases
    .filter((p) => p.status === 'confirmed')
    .reduce((s, p) => s + p.qtx_amount, 0);
  const primaryWallet = wallets.find((w) => w.is_primary) ?? wallets[0];
  const hasRefund = refunds.length > 0;

  return (
    <>
      <PageTitle
        title={`Welcome${profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}`}
        subtitle="Your PreSale participation summary. Tokens are not claimable until launch / TGE."
      />

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Purchased QTX" value={fmtQtx(totalQtx)} sub="Confirmed only" />
        <StatCard label="Total paid" value={`$${totalPaidUsd.toLocaleString()}`} sub="USD-equivalent" />
        <StatCard label="Current stage" value={activeStage.id} sub={`$${activeStage.price.toFixed(3)} / QTX`} />
        <StatCard label="Claim status" value="Locked" sub="Until TGE" />
      </div>

      {/* On-chain confirmation + refund policy note */}
      <Card className="mb-6">
        <p className="text-xs text-ash leading-relaxed flex gap-2.5">
          <Icon name="shield" size={14} className="text-gold shrink-0 mt-0.5" />
          <span>
            Your purchase is recorded after on-chain confirmation. Tokens are not claimable until TGE. Refund
            eligibility is governed by the{' '}
            <a href="/refund-policy" className="text-gold hover:underline">Qryptix refund policy</a>.
          </span>
        </p>
      </Card>

      {/* Status cards row */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Linked wallet */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-ivory flex items-center gap-2">
              <Icon name="lock" size={16} className="text-gold" /> Linked wallet
            </span>
            <a href="/dashboard/wallet" className="text-xs text-ash hover:text-ivory cursor-pointer">Manage →</a>
          </div>
          {primaryWallet ? (
            <div className="font-mono text-sm text-ivory">{shortAddr(primaryWallet.address)}</div>
          ) : (
            <div className="text-sm text-ash">No wallet linked yet</div>
          )}
          <div className="text-xs text-taupe mt-1">Base · chain {primaryWallet?.chain_id ?? 8453}</div>
        </Card>

        {/* Refund eligibility */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-ivory flex items-center gap-2">
              <Icon name="shield" size={16} className="text-gold" /> Refund eligibility
            </span>
            <a href="/dashboard/refund" className="text-xs text-ash hover:text-ivory cursor-pointer">Details →</a>
          </div>
          {hasRefund ? (
            <StatusBadge status={refunds[0].status} />
          ) : (
            <div className="text-sm text-ash">
              Eligible to request under the{' '}
              <a href="/refund-policy" className="text-gold hover:underline cursor-pointer">Refund Policy</a>
            </div>
          )}
          <div className="text-xs text-taupe mt-2">Refunds possible only up to Token Claim / TGE</div>
        </Card>
      </div>

      {/* Allocation summary */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-ivory flex items-center gap-2">
            <Icon name="doc" size={16} className="text-gold" /> Allocation summary
          </span>
          <a href="/dashboard/vesting" className="text-xs text-ash hover:text-ivory cursor-pointer">Vesting →</a>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-eyebrow text-taupe mb-1">Total allocation</div>
            <div className="font-mono font-semibold text-ivory">{fmtQtx(allocation.total_qtx)} QTX</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-eyebrow text-taupe mb-1">Unlocked at TGE</div>
            <div className="font-mono font-semibold text-gold-bright">{fmtQtx(allocation.unlocked_at_tge)} QTX</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-eyebrow text-taupe mb-1">Locked</div>
            <div className="font-mono font-semibold text-ash">{fmtQtx(allocation.locked_qtx)} QTX</div>
          </div>
        </div>
        <p className="text-xs text-taupe mt-4">{allocation.vesting_note}</p>
      </Card>

      {/* Recent participation */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-ivory">Recent participation</span>
          <a href="/dashboard/transactions" className="text-xs text-ash hover:text-ivory cursor-pointer">View all →</a>
        </div>
        {purchases.length === 0 ? (
          <p className="text-sm text-ash py-4 text-center">No participation yet.</p>
        ) : (
          <div className="space-y-2">
            {purchases.slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl bg-obsidian/40 border border-white/5 px-4 py-3">
                <div>
                  <div className="text-sm text-ivory font-medium">{fmtQtx(p.qtx_amount)} QTX</div>
                  <div className="text-xs text-taupe">{fmtMoney(p.amount_paid, p.payment_currency)} · {new Date(p.created_at).toLocaleDateString()}</div>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
