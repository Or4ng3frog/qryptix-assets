'use client';

import { useState } from 'react';

const PURCHASE_STATUSES = ['pending', 'confirmed', 'failed', 'refunded'];
const REFUND_STATUSES = ['requested', 'under_review', 'approved', 'rejected', 'paid'];

export function AdminStatusControl({
  type,
  id,
  current,
}: {
  type: 'purchase' | 'refund';
  id: string;
  current: string;
}) {
  const [status, setStatus] = useState(current);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const options = type === 'purchase' ? PURCHASE_STATUSES : REFUND_STATUSES;

  const update = async (newStatus: string) => {
    setStatus(newStatus);
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, status: newStatus }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => update(e.target.value)}
        disabled={saving}
        className="rounded-lg bg-obsidian/60 border border-white/8 px-2.5 py-1.5 text-xs text-ivory focus:outline-none focus:border-gold/50"
      >
        {options.map((s) => (
          <option key={s} value={s} className="bg-carbon">{s}</option>
        ))}
      </select>
      {saved && <span className="text-xs text-emerald-400">✓</span>}
    </div>
  );
}
