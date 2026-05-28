'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SUPABASE_CONFIGURED } from '@/lib/data';
import type { Purchase, RefundRequest } from '@/lib/supabase/types';
import { StatusBadge } from './StatusBadge';
import { fmtQtx, fmtMoney } from './dashboard-ui';
import { Icon } from './Icon';

export function RefundManager({
  purchases,
  refunds,
}: {
  purchases: Purchase[];
  refunds: RefundRequest[];
}) {
  const refundable = purchases.filter(
    (p) => p.status === 'confirmed' && !refunds.some((r) => r.purchase_id === p.id && r.status !== 'rejected')
  );

  const [selected, setSelected] = useState(refundable[0]?.id ?? '');
  const [reason, setReason] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [localRefunds, setLocalRefunds] = useState(refunds);

  const submit = async () => {
    setErr(null); setMsg(null);
    if (!selected) { setErr('Select a purchase to request a refund for.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchase_id: selected, reason }),
      });
      if (!res.ok && SUPABASE_CONFIGURED) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? 'Request failed');
      }
      setMsg(SUPABASE_CONFIGURED ? 'Refund request submitted. Track its status below.' : 'Preview mode: request would be submitted in production.');
      setLocalRefunds([
        {
          id: `tmp-${Date.now()}`,
          user_id: 'me',
          purchase_id: selected,
          reason,
          status: 'requested',
          requested_at: new Date().toISOString(),
          reviewed_at: null,
          refunded_at: null,
          refund_tx_hash: null,
        },
        ...localRefunds,
      ]);
      setReason('');
    } catch (e: any) {
      setErr(e.message ?? 'Could not submit request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {/* Request form */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="shield" size={16} className="text-violet-bright" />
          <span className="text-sm font-medium text-ghost">Request a refund</span>
        </div>

        {refundable.length === 0 ? (
          <p className="text-sm text-mist">
            No confirmed purchases are currently eligible for a new refund request.
          </p>
        ) : (
          <>
            <label className="block text-xs text-mist mb-1.5">Purchase</label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full rounded-xl bg-void/60 border border-white/8 px-4 py-3 text-ghost text-sm focus:outline-none focus:border-violet/50 mb-3"
            >
              {refundable.map((p) => (
                <option key={p.id} value={p.id} className="bg-carbon">
                  {fmtQtx(p.qtx_amount)} QTX · {fmtMoney(p.amount_paid, p.payment_currency)} · {new Date(p.created_at).toLocaleDateString()}
                </option>
              ))}
            </select>

            <label className="block text-xs text-mist mb-1.5">Reason (optional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Briefly describe why you're requesting a refund…"
              className="w-full rounded-xl bg-void/60 border border-white/8 px-4 py-3 text-ghost text-sm focus:outline-none focus:border-violet/50 mb-3 resize-none"
            />

            <button
              onClick={submit}
              disabled={loading}
              className="w-full rounded-xl bg-brand-gradient py-3 font-semibold text-void transition-transform enabled:hover:scale-[1.02] disabled:opacity-40"
            >
              {loading ? 'Submitting…' : 'Submit refund request'}
            </button>
          </>
        )}

        {msg && <p className="text-sm text-cyan-bright mt-3">{msg}</p>}
        {err && <p className="text-sm text-red-400 mt-3">{err}</p>}

        <p className="text-xs text-fog mt-4 leading-relaxed">
          Refunds are possible only under the published{' '}
          <a href="/refund-policy" className="text-violet-bright hover:underline">Refund Policy</a>, and only up to
          Token Claim / TGE.
        </p>
      </div>

      {/* Request history */}
      <div className="glass rounded-2xl p-6">
        <span className="text-sm font-medium text-ghost block mb-4">Your refund requests</span>
        {localRefunds.length === 0 ? (
          <p className="text-sm text-mist">No refund requests yet.</p>
        ) : (
          <div className="space-y-2">
            {localRefunds.map((r) => (
              <div key={r.id} className="rounded-xl bg-void/40 border border-white/5 px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-fog">{new Date(r.requested_at).toLocaleDateString()}</span>
                  <StatusBadge status={r.status} />
                </div>
                {r.reason && <p className="text-sm text-mist">{r.reason}</p>}
                {r.refund_tx_hash && (
                  <p className="text-xs text-cyan-bright font-mono mt-1">Tx: {r.refund_tx_hash.slice(0, 12)}…</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
