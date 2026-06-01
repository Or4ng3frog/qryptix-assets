'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SUPABASE_CONFIGURED } from '@/lib/data';
import type { Profile } from '@/lib/supabase/types';
import { Icon } from './Icon';

export function SettingsForm({ profile }: { profile: Profile }) {
  const [name, setName] = useState(profile.full_name ?? '');
  const [jurisdiction, setJurisdiction] = useState(profile.jurisdiction ?? '');
  const [confirmed, setConfirmed] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setMsg(null);
    if (!SUPABASE_CONFIGURED) {
      setMsg('Preview mode: changes would be saved in production.');
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not signed in');
      await supabase.from('profiles').update({
        full_name: name || null,
        jurisdiction: jurisdiction || null,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);
      setMsg('Saved.');
    } catch (e: any) {
      setMsg(e.message ?? 'Could not save.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="glass-luxe rounded-2xl p-6">
        <span className="text-sm font-medium text-ivory block mb-4">Account</span>

        <label className="block text-xs text-ash mb-1.5">Email</label>
        <input
          value={profile.email ?? ''}
          disabled
          className="w-full rounded-xl bg-obsidian/40 border border-white/5 px-4 py-3 text-taupe text-sm mb-4 cursor-not-allowed"
        />

        <label className="block text-xs text-ash mb-1.5">Full name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-xl bg-obsidian/60 border border-white/8 px-4 py-3 text-ivory text-sm focus:outline-none focus:border-gold/50 mb-4"
        />

        <label className="block text-xs text-ash mb-1.5">Jurisdiction (country)</label>
        <input
          value={jurisdiction}
          onChange={(e) => setJurisdiction(e.target.value)}
          placeholder="e.g. DE, AE, US"
          className="w-full rounded-xl bg-obsidian/60 border border-white/8 px-4 py-3 text-ivory text-sm focus:outline-none focus:border-gold/50 mb-4"
        />

        <label className="flex items-start gap-2.5 mb-4 cursor-pointer">
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1 accent-gold" />
          <span className="text-xs text-ash leading-relaxed">
            I confirm that I am legally permitted to participate in the Qryptix PreSale from my jurisdiction.
          </span>
        </label>

        <button
          onClick={save}
          disabled={loading}
          className="rounded-xl bg-gold-gradient px-6 py-2.5 text-sm font-semibold text-obsidian transition-transform enabled:hover:scale-[1.02] disabled:opacity-40"
        >
          {loading ? 'Saving…' : 'Save changes'}
        </button>
        {msg && <p className="text-sm text-gold-bright mt-3">{msg}</p>}
      </div>

      {/* KYC placeholder */}
      <div className="glass-luxe rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="shield" size={16} className="text-gold" />
          <span className="text-sm font-medium text-ivory">Identity verification (KYC)</span>
        </div>
        <div className="rounded-xl border border-white/8 bg-obsidian/40 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-ash">Status: not required yet</span>
          <span className="text-[11px] rounded-md bg-white/5 text-taupe border border-white/10 px-2 py-0.5 uppercase tracking-wider">Placeholder</span>
        </div>
        <p className="text-xs text-taupe mt-3 leading-relaxed">
          KYC requirements at purchase time depend on the final operating entity and your purchase size. They will
          be published before the buy flow opens.
        </p>
      </div>
    </div>
  );
}
