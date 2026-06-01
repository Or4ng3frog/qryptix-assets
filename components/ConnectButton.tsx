'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState } from 'react';
import { Icon } from './Icon';

export function ConnectButton({ onConnected }: { onConnected?: (addr: string) => void }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);

  if (isConnected && address) {
    return (
      <div className="flex items-center justify-between rounded-xl bg-obsidian/40 border border-white/8 px-4 py-3">
        <span className="font-mono text-sm text-ivory">{address.slice(0, 6)}…{address.slice(-4)}</span>
        <button onClick={() => disconnect()} className="text-xs text-ash hover:text-ivory transition-colors cursor-pointer">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={isPending}
        className="w-full rounded-xl bg-gold-gradient py-3.5 font-grotesk font-semibold text-obsidian transition-transform enabled:hover:scale-[1.02] disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
      >
        <Icon name="lock" size={17} />
        {isPending ? 'Connecting…' : 'Connect Wallet'}
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-xl glass-luxe border border-gold/20 p-1.5 shadow-xl">
          {connectors.map((c) => (
            <button
              key={c.uid}
              onClick={() => {
                connect(
                  { connector: c },
                  { onSuccess: (data) => onConnected?.(data.accounts[0]) }
                );
                setOpen(false);
              }}
              className="w-full text-left rounded-lg px-4 py-2.5 text-sm text-ivory hover:bg-gold/10 transition-colors cursor-pointer"
            >
              {c.name}
            </button>
          ))}
          {connectors.length === 0 && (
            <p className="px-4 py-2.5 text-sm text-ash">No wallet connectors available.</p>
          )}
        </div>
      )}
    </div>
  );
}
