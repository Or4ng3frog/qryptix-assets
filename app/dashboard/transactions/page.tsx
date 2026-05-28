import { getDashboardData } from '@/lib/dashboard-data';
import { SITE } from '@/lib/config';
import { PageTitle, Card, fmtQtx, fmtMoney, shortHash } from '@/components/dashboard-ui';
import { StatusBadge } from '@/components/StatusBadge';

export default async function TransactionsPage() {
  const data = await getDashboardData();
  if (!data) return null;
  const { purchases } = data;

  return (
    <>
      <PageTitle
        title="Transactions"
        subtitle="Every PreSale participation linked to your account, with status. Tokens are claimable only at launch / TGE."
      />

      {purchases.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-mist">No transactions yet.</p>
          <a href="/#presale" className="inline-block mt-4 rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-void">
            Join the PreSale
          </a>
        </Card>
      ) : (
        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-abyss/60 text-left">
                  {['Date', 'Amount', 'Currency', 'QTX', 'Stage', 'Tx hash', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-[11px] uppercase tracking-wider text-fog font-semibold border-b border-violet/10 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {purchases.map((p) => (
                  <tr key={p.id} className="border-b border-violet/[0.06] last:border-0 hover:bg-violet/[0.03]">
                    <td className="px-4 py-3 text-mist whitespace-nowrap">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-ghost font-medium whitespace-nowrap">{p.amount_paid.toLocaleString()}</td>
                    <td className="px-4 py-3 text-mist">{p.payment_currency}</td>
                    <td className="px-4 py-3 font-mono text-cyan-bright whitespace-nowrap">{fmtQtx(p.qtx_amount)}</td>
                    <td className="px-4 py-3 text-mist">P{p.presale_stage}</td>
                    <td className="px-4 py-3 font-mono text-xs text-mist whitespace-nowrap">
                      {p.tx_hash ? (
                        <a href={`https://basescan.org/tx/${p.tx_hash}`} target="_blank" rel="noopener noreferrer" className="hover:text-violet-bright">
                          {shortHash(p.tx_hash)}
                        </a>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
