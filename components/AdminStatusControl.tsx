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
  const [error, setError] = useState<string | null>(null);
  const options = type === 'purchase' ? PURCHASE_STATUSES : REFUND_STATUSES;

  const update = async (newStatus: string) => {
    const previousStatus = status;
    setStatus(newStatus);
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, status: newStatus }),
      });
      if (!res.ok) throw new Error('Status could not be saved.');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setStatus(previousStatus);
      setError('Save failed');
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
          <option key={s} value={s} className="bg-onyx">{s}</option>
        ))}
      </select>
      {saved && <span className="text-xs text-emerald-400">✓</span>}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
