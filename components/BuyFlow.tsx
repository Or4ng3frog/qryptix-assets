'use client';

import { useState } from 'react';
import { useAccount, useChainId, useSwitchChain, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { FEATURES, PHASES, PRESALE, PURCHASE_ACKS } from '@/lib/config';
import { ACTIVE_USDC, TREASURY, ACTIVE_CHAIN_ID, ACTIVE_CHAIN_LABEL } from '@/lib/chains';
import { ERC20_ABI } from '@/lib/wagmi';
import { ConnectButton } from './ConnectButton';
import { Icon } from './Icon';

type Step = 'amount' | 'review' | 'processing' | 'done';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PURCHASE_COPY =
  'Your purchase is recorded after on-chain confirmation. Tokens are not claimable until TGE. Refund eligibility is governed by the Qryptix refund policy.';

export function BuyFlow() {
  const buyEnabled = FEATURES.BUY_FLOW_ENABLED;
  const activePhase = PHASES.find((p) => p.active) ?? PHASES[0];

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: switching } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  const [usd, setUsd] = useState('500');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<Step>('amount');
  const [ack1, setAck1] = useState(false);
  const [ack2, setAck2] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [result, setResult] = useState<{ amount_usd: number; qtx_amount: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const usdNum = parseFloat(usd) || 0;
  const qtx = usdNum / activePhase.price;
  const belowMin = usdNum < PRESALE.minBuyUsd;
  const aboveMax = usdNum > PRESALE.maxBuyUsd;
  const amountValid = usdNum > 0 && !belowMin && !aboveMax;
  const emailValid = EMAIL_RE.test(email);
  const wrongNetwork = buyEnabled && isConnected && chainId !== ACTIVE_CHAIN_ID;

  // ---- Reservation path (buy flow OFF) ----
  const submitReservation = async () => {
    setErr(null);
    if (!emailValid || !address) {
      setErr('Connect a wallet and enter a valid email to reserve.');
      return;
    }
    setStep('processing');
    await fetch('/api/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, wallet: address, usdc: usd, phase: activePhase.id }),
    }).catch(() => {});
    setStep('done');
  };

  // ---- Purchase path (buy flow ON) — USDC only, server-verified ----
  const executePurchase = async () => {
    setErr(null);
    if (!TREASURY.valid) {
      setErr(TREASURY.error ?? 'Treasury wallet is not configured.');
      return;
    }
    if (wrongNetwork) {
      setErr(`Switch to ${ACTIVE_CHAIN_LABEL} to continue.`);
      return;
    }
    setStep('processing');
    try {
      const units = parseUnits(usdNum.toFixed(ACTIVE_USDC.decimals), ACTIVE_USDC.decimals);
      const hash = await writeContractAsync({
        address: ACTIVE_USDC.address,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [TREASURY.address!, units],
        chainId: ACTIVE_CHAIN_ID,
      });
      setTxHash(hash);

      // Server verifies the tx on-chain and records it (source of truth).
      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tx_hash: hash, wallet_address: address, email, phase: activePhase.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error ?? 'On-chain verification failed. If your payment went through, contact support with your tx hash.');
        setStep('review');
        return;
      }
      setResult({ amount_usd: data.amount_usd, qtx_amount: data.qtx_amount });
      setStep('done');
    } catch (e: any) {
      setErr(e?.shortMessage ?? e?.message ?? 'Transaction was rejected or failed.');
      setStep('review');
    }
  };

  // ============================================================
  //  Treasury misconfigured while buy flow is ON → block purchase
  // ============================================================
  if (buyEnabled && !TREASURY.valid) {
    return (
      <div className="glass-luxe rounded-3xl p-7 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <Icon name="alert" size={24} />
        </div>
        <h3 className="font-serif font-medium text-lg text-ivory mb-2">Purchases temporarily unavailable</h3>
        <p className="text-sm text-ash">
          The treasury wallet is not configured correctly, so purchases are disabled for safety.
          {TREASURY.error ? ` (${TREASURY.error})` : ''}
        </p>
      </div>
    );
  }

  // ============================================================
  //  DONE
  // ============================================================
  if (step === 'done') {
    return (
      <div className="glass-luxe rounded-3xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient text-obsidian">
          <Icon name="check" size={26} />
        </div>
        <h3 className="font-serif font-medium text-xl text-ivory mb-2">
          {buyEnabled ? 'Purchase confirmed' : 'Spot reserved'}
        </h3>
        <p className="text-sm text-ash mb-5 max-w-sm mx-auto">
          {buyEnabled ? (
            <>
              {result ? `${result.qtx_amount.toLocaleString('en-US', { maximumFractionDigits: 2 })} QTX recorded for $${result.amount_usd.toLocaleString()}.` : 'Your purchase has been verified on-chain.'}{' '}
              {PURCHASE_COPY}
            </>
          ) : (
            `Your Phase ${activePhase.id} price of $${activePhase.price.toFixed(3)} is locked. We'll email you the moment the buy flow opens.`
          )}
        </p>
        {txHash && (
          <a
            href={`https://${ACTIVE_CHAIN_LABEL === 'Base' ? 'basescan.org' : 'sepolia.basescan.org'}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-gold hover:underline mb-5"
          >
            View on {ACTIVE_CHAIN_LABEL === 'Base' ? 'Basescan' : 'Sepolia Basescan'} <Icon name="external" size={14} />
          </a>
        )}
        <div>
          <a href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-grotesk font-semibold text-obsidian cursor-pointer">
            Go to Dashboard <Icon name="arrow" size={16} />
          </a>
        </div>
      </div>
    );
  }

  // ============================================================
  //  PROCESSING
  // ============================================================
  if (step === 'processing') {
    return (
      <div className="glass-luxe rounded-3xl p-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
        <h3 className="font-serif font-medium text-lg text-ivory mb-1">
          {buyEnabled ? 'Confirming…' : 'Reserving your spot…'}
        </h3>
        <p className="text-sm text-ash">
          {buyEnabled
            ? 'Approve the USDC transfer in your wallet, then we verify it on-chain. Don’t close this window.'
            : 'One moment.'}
        </p>
      </div>
    );
  }

  // ============================================================
  //  REVIEW (purchase only)
  // ============================================================
  if (step === 'review') {
    return (
      <div className="glass-luxe rounded-3xl p-7">
        <button onClick={() => setStep('amount')} className="text-xs text-ash hover:text-ivory mb-4 cursor-pointer">← Back</button>
        <h3 className="font-serif font-medium text-lg text-ivory mb-5">Review &amp; confirm</h3>

        <div className="rounded-2xl bg-obsidian/40 border border-white/[0.06] p-4 mb-4 space-y-2.5">
          <Row label="You pay" value={`${usdNum.toLocaleString('en-US', { maximumFractionDigits: 2 })} USDC`} />
          <Row label="Network" value={ACTIVE_CHAIN_LABEL} />
          <Row label="You receive" value={`${qtx.toLocaleString('en-US', { maximumFractionDigits: 2 })} QTX`} accent />
          <Row label="Price" value={`$${activePhase.price.toFixed(3)} (Stage ${activePhase.id})`} />
          <Row label="Claim" value="At TGE" />
        </div>

        <div className="space-y-3 mb-5">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input type="checkbox" checked={ack1} onChange={(e) => setAck1(e.target.checked)} className="mt-1 accent-gold shrink-0" />
            <span className="text-xs text-ash leading-relaxed">{PURCHASE_ACKS[0]}</span>
          </label>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input type="checkbox" checked={ack2} onChange={(e) => setAck2(e.target.checked)} className="mt-1 accent-gold shrink-0" />
            <span className="text-xs text-ash leading-relaxed">
              I have read and accept the{' '}
              <a href="/presale-terms" target="_blank" className="text-gold hover:underline">PreSale Terms</a>,{' '}
              <a href="/refund-policy" target="_blank" className="text-gold hover:underline">Refund Policy</a> and{' '}
              <a href="/risk-disclosure" target="_blank" className="text-gold hover:underline">Risk Disclosure</a>.
            </span>
          </label>
        </div>

        {err && <p className="text-sm text-red-400 mb-3">{err}</p>}

        <button
          onClick={executePurchase}
          disabled={!ack1 || !ack2 || wrongNetwork}
          className="w-full rounded-xl bg-gold-gradient py-3.5 font-grotesk font-semibold text-obsidian transition-transform enabled:hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Confirm &amp; pay with USDC
        </button>
        <p className="text-[11px] text-taupe text-center mt-3 leading-relaxed">{PURCHASE_COPY}</p>
      </div>
    );
  }

  // ============================================================
  //  AMOUNT (entry)
  // ============================================================
  return (
    <div className="glass-luxe rounded-3xl p-7">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-serif font-medium text-lg text-ivory">
          {buyEnabled ? 'Buy QTX' : 'Reserve your allocation'}
        </h3>
        <span className="rounded-lg border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-bright">
          {activePhase.id} · ${activePhase.price.toFixed(3)}
        </span>
      </div>

      {buyEnabled && (
        <div className="flex items-center gap-2 mb-4 rounded-xl border border-gold/20 bg-gold/5 px-3 py-2 text-xs font-grotesk text-gold-bright">
          <Icon name="shield" size={13} /> Paying with USDC on {ACTIVE_CHAIN_LABEL}
        </div>
      )}

      <label className="block text-xs text-ash mb-1.5">
        {buyEnabled ? 'Amount (USDC)' : 'You will pay (USDC, when launch goes live)'}
      </label>
      <input
        type="number"
        value={usd}
        onChange={(e) => setUsd(e.target.value)}
        placeholder="0.00"
        className="w-full rounded-xl bg-obsidian/60 border border-white/8 px-4 py-3 text-ivory focus:outline-none focus:border-gold/50 transition-colors mb-2"
      />
      <div className="flex justify-between text-[11px] mb-3">
        <span className={belowMin ? 'text-amber-400' : 'text-taupe'}>Min ${PRESALE.minBuyUsd}</span>
        <span className={aboveMax ? 'text-amber-400' : 'text-taupe'}>Max ${PRESALE.maxBuyUsd.toLocaleString()}</span>
      </div>

      <div className="rounded-2xl bg-obsidian/40 border border-white/[0.06] p-4 mb-5 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-eyebrow text-taupe">You receive</div>
          <div className="font-mono text-xl font-semibold text-gold">
            {qtx.toLocaleString('en-US', { maximumFractionDigits: 2 })} QTX
          </div>
        </div>
        <div className="text-right text-xs text-taupe">@ ${activePhase.price.toFixed(3)}<br />Claim at TGE</div>
      </div>

      {/* Email (required for both paths) */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full rounded-xl bg-obsidian/60 border border-white/8 px-4 py-3 text-ivory focus:outline-none focus:border-gold/50 transition-colors mb-4"
      />

      {/* Wallet */}
      <div className="mb-4">
        <ConnectButton />
      </div>

      {/* Network guard */}
      {wrongNetwork && (
        <div className="mb-4 rounded-xl border border-amber-400/25 bg-amber-400/[0.06] p-3">
          <p className="text-xs text-amber-200/80 mb-2 flex items-center gap-1.5">
            <Icon name="alert" size={13} /> Wrong network — purchases require {ACTIVE_CHAIN_LABEL}.
          </p>
          <button
            onClick={() => switchChain({ chainId: ACTIVE_CHAIN_ID })}
            disabled={switching}
            className="w-full rounded-lg border border-gold/30 py-2 text-sm font-grotesk text-ivory hover:bg-gold/5 hover:border-gold/60 transition-all disabled:opacity-40 cursor-pointer"
          >
            {switching ? 'Switching…' : `Switch to ${ACTIVE_CHAIN_LABEL}`}
          </button>
        </div>
      )}

      {err && <p className="text-sm text-red-400 mb-3">{err}</p>}

      <button
        onClick={() => {
          if (!isConnected) { setErr('Please connect your wallet first.'); return; }
          if (!emailValid) { setErr('Please enter a valid email.'); return; }
          if (!amountValid) { setErr(`Enter an amount between $${PRESALE.minBuyUsd} and $${PRESALE.maxBuyUsd.toLocaleString()}.`); return; }
          if (wrongNetwork) { setErr(`Switch to ${ACTIVE_CHAIN_LABEL} to continue.`); return; }
          setErr(null);
          if (buyEnabled) setStep('review');
          else submitReservation();
        }}
        disabled={!amountValid || wrongNetwork}
        className="w-full rounded-xl bg-gold-gradient py-3.5 font-grotesk font-semibold text-obsidian transition-transform enabled:hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {buyEnabled ? 'Continue to review' : 'Reserve My Spot'}
      </button>

      <p className="text-[11px] text-taupe text-center mt-3 leading-relaxed">
        {buyEnabled ? (
          PURCHASE_COPY
        ) : (
          <span className="inline-flex flex-wrap items-center justify-center gap-1">
            <Icon name="alert" size={12} className="text-amber-400 shrink-0" />
            <span className="text-amber-400 font-medium">No payment required today.</span> Reservations lock in the Phase price. Purchase opens once the audit is published and the operating entity is finalized.
          </span>
        )}
      </p>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-ash">{label}</span>
      <span className={accent ? 'font-mono font-semibold text-gold' : 'text-ivory font-medium'}>{value}</span>
    </div>
  );
}
