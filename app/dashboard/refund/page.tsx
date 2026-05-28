import { getDashboardData } from '@/lib/dashboard-data';
import { REFUND_ELIGIBLE, REFUND_NOT_ELIGIBLE } from '@/lib/config';
import { PageTitle, Card } from '@/components/dashboard-ui';
import { RefundManager } from '@/components/RefundManager';
import { Icon } from '@/components/Icon';

export default async function RefundPage() {
  const data = await getDashboardData();
  if (!data) return null;

  return (
    <>
      <PageTitle
        title="Refund"
        subtitle="Request and track refunds. Refunds are possible only under the published Refund Policy and only up to Token Claim / TGE."
      />

      {/* Policy summary */}
      <Card className="mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-ghost">
              <Icon name="check" size={15} className="text-cyan" /> May apply if
            </div>
            <ul className="space-y-2">
              {REFUND_ELIGIBLE.map((r) => (
                <li key={r} className="flex gap-2.5 text-xs text-mist">
                  <span className="text-cyan mt-0.5">→</span>{r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-ghost">
              <Icon name="alert" size={15} className="text-fog" /> Does not apply if
            </div>
            <ul className="space-y-2">
              {REFUND_NOT_ELIGIBLE.map((r) => (
                <li key={r} className="flex gap-2.5 text-xs text-mist">
                  <span className="text-fog mt-0.5">×</span>{r}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-white/5">
          <a href="/refund-policy" className="text-sm text-violet-bright hover:underline inline-flex items-center gap-1.5">
            Read the full Refund Policy <Icon name="arrow" size={14} />
          </a>
        </div>
      </Card>

      <RefundManager purchases={data.purchases} refunds={data.refunds} />
    </>
  );
}
