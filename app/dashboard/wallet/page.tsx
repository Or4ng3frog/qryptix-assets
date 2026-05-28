import { getDashboardData } from '@/lib/dashboard-data';
import { SITE } from '@/lib/config';
import { PageTitle, Card, fmtQtx } from '@/components/dashboard-ui';
import { WalletConnect } from '@/components/WalletConnect';
import { Icon } from '@/components/Icon';

export default async function WalletPage() {
  const data = await getDashboardData();
  if (!data) return null;
  const { wallets, allocation } = data;
  const primary = wallets.find((w) => w.is_primary) ?? wallets[0];

  return (
    <>
      <PageTitle
        title="Wallet & Claim"
        subtitle="Link your Base wallet for allocation and refunds. Token claiming opens at launch / TGE."
      />

      <div className="grid md:grid-cols-2 gap-5">
        <WalletConnect initialAddress={primary?.address} />

        {/* Claim section — disabled until TGE */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="doc" size={16} className="text-violet-bright" />
            <span className="text-sm font-medium text-ghost">Token claim</span>
          </div>

          <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.05] px-4 py-3 mb-4">
            <p className="text-sm text-amber-200/80">
              Claiming is not yet available. Tokens are not claimable before launch / TGE (planned {SITE.tgeTarget}).
            </p>
          </div>

          <div className="space-y-3 mb-5">
            <div className="flex justify-between text-sm">
              <span className="text-mist">Claimable now</span>
              <span className="font-mono text-fog">0 QTX</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-mist">Unlocks at TGE</span>
              <span className="font-mono text-cyan-bright">{fmtQtx(allocation.unlocked_at_tge)} QTX</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-mist">Total allocation</span>
              <span className="font-mono text-ghost">{fmtQtx(allocation.total_qtx)} QTX</span>
            </div>
          </div>

          <button
            disabled
            className="w-full rounded-xl border border-white/8 py-3 font-semibold text-fog cursor-not-allowed"
          >
            Claim unavailable until TGE
          </button>
        </Card>
      </div>
    </>
  );
}
