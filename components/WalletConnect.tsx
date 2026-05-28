'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SUPABASE_CONFIGURED } from '@/lib/data';
import { Icon } from './Icon';
import { shortAddr } from './dashboard-ui';

export function WalletConnect({ initialAddress }: { initialAddress?: string }) {
  const [address, setAddress] = useState(initialAddress ?? '');
  const [manual, setManual] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const save = async (addr: string) => {
    setErr(null); setMsg(null);
    if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
      setErr('That doesn’t look like a valid EVM address.');
      return;
    }
    setAddress(addr);
    if (!SUPABASE_CONFIGURED) {
      setMsg('Preview mode: wallet would be saved to your account in production.');
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not signed in');
      const { error } = await supabase.from('wallets').upsert(
        { user_id: user.id, address: addr, chain_id: 8453, is_primary: true },
        { onConflict: 'user_id,address' }
      );
      if (error) throw error;
      setMsg('Wallet linked.');
    } catch (e: any) {
      setErr(e.message ?? 'Could not save wallet.');
    } finally {
      setLoading(false);
    }
  };

  const connectInjected = async () => {
    setErr(null); setMsg(null);
    const eth = (typeof window !== 'undefined' ? (window as any).ethereum : null);
    if (!eth) {
      setErr('No browser wallet detected. Paste your address below instead, or install MetaMask / Coinbase Wallet.');
      return;
    }
    try {
      const accounts = await eth.request({ method: 'eth_requestAccounts' });
      if (accounts?.[0]) await save(accounts[0]);
    } catch {
      setErr('Connection request was rejected.');
    }
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="lock" size={16} className="text-violet-bright" />
        <span className="text-sm font-medium text-ghost">Connect your wallet</span>
      </div>

      {address ? (
        <div className="rounded-xl bg-void/40 border border-white/5 px-4 py-3 mb-4 flex items-center justify-between">
          <span className="font-mono text-sm text-ghost">{shortAddr(address)}</span>
          <span className="text-[11px] rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 uppercase tracking-wider font-semibold">Linked</span>
        </div>
      ) : (
        <p className="text-sm text-mist mb-4">
          Link the Base wallet you’ll use for your allocation and any refund. We never ask for your private keys.
        </p>
      )}

      <button
        onClick={connectInjected}
        disabled={loading}
        className="w-full rounded-xl bg-brand-gradient py-3 font-semibold text-void transition-transform enabled:hover:scale-[1.02] disabled:opacity-40 mb-3"
      >
        {address ? 'Reconnect browser wallet' : 'Connect browser wallet'}
      </button>

      <div className="flex items-center gap-2">
        <input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder="…or paste 0x address"
          className="flex-grow rounded-xl bg-void/60 border border-white/8 px-4 py-2.5 text-sm text-ghost font-mono focus:outline-none focus:border-violet/50"
        />
        <button
          onClick={() => save(manual)}
          className="rounded-xl border border-violet/25 px-4 py-2.5 text-sm text-ghost hover:bg-violet/5 hover:border-violet/60 transition-all"
        >
          Save
        </button>
      </div>

      {msg && <p className="text-sm text-cyan-bright mt-3">{msg}</p>}
      {err && <p className="text-sm text-red-400 mt-3">{err}</p>}
    </div>
  );
}
