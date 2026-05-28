import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SUPABASE_CONFIGURED, MOCK_PURCHASES, MOCK_REFUNDS } from '@/lib/data';
import { AdminStatusControl } from '@/components/AdminStatusControl';
import { StatusBadge } from '@/components/StatusBadge';
import { Icon } from '@/components/Icon';
import { fmtQtx, fmtMoney, shortHash } from '@/components/dashboard-ui';
import type { Purchase, RefundRequest } from '@/lib/supabase/types';

export const metadata: Metadata = { title: 'Admin — Qryptix' };

export default async function AdminPage() {
  let purchases: Purchase[] = [];
  let refunds: RefundRequest[] = [];
  let allowed = true;
  let preview = !SUPABASE_CONFIGURED;

  if (!SUPABASE_CONFIGURED) {
    purchases = MOCK_PURCHASES;
    refunds = MOCK_REFUNDS;
  } else {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user?.id ?? '').single();
    allowed = !!profile?.is_admin;
    if (allowed) {
      const [pRes, rRes] = await Promise.all([
        supabase.from('purchases').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('refund_requests').select('*').order('requested_at', { ascending: false }).limit(100),
      ]);
      purchases = pRes.data ?? [];
      refunds = rRes.data ?? [];
    }
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50 bg-void/90 backdrop-blur-xl border-b border-violet/10">
        <div className="mx-auto max-w-6xl px-6 py-3.5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/Q_Only.png" alt="Qryptix" className="h-8 w-8" />
            <span className="font-display font-semibold">QRYPTIX</span>
            <span className="text-xs text-fog ml-2 pl-3 border-l border-violet/15">Admin</span>
          </a>
          <a href="/dashboard" className="text-sm text-mist hover:text-ghost transition-colors">← Dashboard</a>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {preview && (
          <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] px-5 py-3 text-sm text-amber-200/80">
            Preview mode — showing mock data. With Supabase configured, only users with <code className="text-amber-300">is_admin = true</code> can access this page.
          </div>
        )}

        {!allowed ? (
          <div className="glass rounded-2xl p-10 text-center">
            <Icon name="shield" size={28} className="text-fog mx-auto mb-3" />
            <div className="font-display font-medium text-ghost mb-1">Admin access required</div>
            <p className="text-sm text-mist">Your account does not have admin privileges.</p>
          </div>
        ) : (
          <>
            <h1 className="font-display font-semibold text-2xl mb-1">Admin preview</h1>
            <p className="text-mist text-sm mb-7">Review participation and refund requests. Update status manually while the flow is verified by hand.</p>

            {/* Purchases */}
            <div className="glass rounded-2xl !p-0 overflow-hidden mb-6">
              <div className="px-5 py-3.5 border-b border-violet/10 text-sm font-medium text-ghost">
                Purchases ({purchases.length})
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-abyss/60 text-left">
                      {['Date', 'Amount', 'QTX', 'Wallet', 'Tx', 'Status', 'Set status'].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-fog font-semibold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((p) => (
                      <tr key={p.id} className="border-t border-violet/[0.06] hover:bg-violet/[0.03]">
                        <td className="px-4 py-3 text-mist whitespace-nowrap">{new Date(p.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-ghost whitespace-nowrap">{fmtMoney(p.amount_paid, p.payment_currency)}</td>
                        <td className="px-4 py-3 font-mono text-cyan-bright whitespace-nowrap">{fmtQtx(p.qtx_amount)}</td>
                        <td className="px-4 py-3 font-mono text-xs text-mist whitespace-nowrap">{p.wallet_address ? `${p.wallet_address.slice(0,6)}…${p.wallet_address.slice(-4)}` : '—'}</td>
                        <td className="px-4 py-3 font-mono text-xs text-mist">{shortHash(p.tx_hash)}</td>
                        <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                        <td className="px-4 py-3"><AdminStatusControl type="purchase" id={p.id} current={p.status} /></td>
                      </tr>
                    ))}
                    {purchases.length === 0 && (
                      <tr><td colSpan={7} className="px-4 py-8 text-center text-mist">No purchases.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Refunds */}
            <div className="glass rounded-2xl !p-0 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-violet/10 text-sm font-medium text-ghost">
                Refund requests ({refunds.length})
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-abyss/60 text-left">
                      {['Requested', 'Reason', 'Status', 'Set status'].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-fog font-semibold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {refunds.map((r) => (
                      <tr key={r.id} className="border-t border-violet/[0.06] hover:bg-violet/[0.03]">
                        <td className="px-4 py-3 text-mist whitespace-nowrap">{new Date(r.requested_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-mist max-w-xs truncate">{r.reason ?? '—'}</td>
                        <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                        <td className="px-4 py-3"><AdminStatusControl type="refund" id={r.id} current={r.status} /></td>
                      </tr>
                    ))}
                    {refunds.length === 0 && (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-mist">No refund requests.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
