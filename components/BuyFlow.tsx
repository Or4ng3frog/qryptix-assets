'use client';

import { useState } from 'react';
import { useAccount, useChainId, usePublicClient, useSwitchChain, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { PHASES, PRESALE, PURCHASE_ACKS } from '@/lib/config';
import { ACTIVE_USDC, TREASURY, ACTIVE_CHAIN_ID, ACTIVE_CHAIN_LABEL, PURCHASE_READY } from '@/lib/chains';
import { ERC20_ABI } from '@/lib/wagmi';
import { ConnectButton } from './ConnectButton';
import { Icon } from './Icon';

type Step = 'amount' | 'review' | 'processing' | 'done';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PURCHASE_COPY =
  'Your purchase is recorded after on-chain confirmation. Tokens are not claimable until TGE. Refund eligibility is governed by the Qryptix refund policy.';

export function BuyFlow() {
  const activePhase = PHASES.find((p) => p.active) ?? PHASES[0];

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: switching } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient({ chainId: ACTIVE_CHAIN_ID });

  const [usd, setUsd] = useState('500');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<Step>('amount');
  const [ack1, setAck1] = useState(false);
  const [ack2, setAck2] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [result, setResult] = useState<{ amount_usd: number; qtx_amount: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const usdNum = Number(usd) || 0;
  const qtx = usdNum / activePhase.price;
  const belowMin = usdNum < PRESALE.minBuyUsd;
  const aboveMax = usdNum > PRESALE.maxBuyUsd;
  const amountValid = Number.isFinite(usdNum) && usdNum > 0 && !belowMin && !aboveMax && Math.round(usdNum * 1e6) === usdNum * 1e6;
  const emailValid = EMAIL_RE.test(email);
  const wrongNetwork = isConnected && chainId !== ACTIVE_CHAIN_ID;

  // USDC only; the server verifies and records the transaction.
  const executePurchase = async () => {
    setErr(null);
    if (!PURCHASE_READY) return;
    if (!address || !emailValid || !amountValid) return;
    if (wrongNetwork) {
      setErr(`Switch to ${ACTIVE_CHAIN_LABEL} to continue.`);
      return;
    }
    setStep('processing');
    try {
      if (!txHash) {
        const check = await fetch('/api/purchase', { cache: 'no-store' });
        if (!check.ok) {
          const status = await check.json();
          throw new Error(status.error ?? 'Purchases are temporarily unavailable.');
        }
      }
      const units = parseUnits(usdNum.toFixed(ACTIVE_USDC.decimals), ACTIVE_USDC.decimals);
      const hash = txHash ?? await writeContractAsync({
        address: ACTIVE_USDC.address,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [TREASURY.address!, units],
        chainId: ACTIVE_CHAIN_ID,
      });
      setTxHash(hash);

      // Wait for inclusion before asking the server to verify the receipt.
      if (!publicClient) throw new Error('Network connection unavailable. Retry verification with your transaction hash.');
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status !== 'success') throw new Error('The transfer failed on-chain. Check the transaction in the explorer.');

      // Server verifies the tx on-chain and records it (source of truth).
      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tx_hash: hash, wallet_address: address, email, phase: activePhase.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(`${data.error ?? 'On-chain verification failed.'} If the transfer succeeded, retry verification or contact support with your transaction hash. Do not send another payment.`);
        setStep('review');
        return;
      }
      setResult({ amount_usd: data.amount_usd, qtx_amount: data.qtx_amount });
      setStep('done');
    } catch (e: any) {
      setErr(`${e?.shortMessage ?? e?.message ?? 'Transaction was rejected or failed.'}${txHash ? ' Your transfer may have succeeded. Retry verification; do not send another payment.' : ''}`);
      setStep('review');
    }
  };

  // ============================================================
  //  Closed sale or missing configuration: no wallet transfer available.
  // ============================================================
  if (!PURCHASE_READY) {
    return (
      <div className="glass-luxe rounded-3xl p-7 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <Icon name="lock" size={24} />
        </div>
        <h3 className="font-serif font-medium text-lg text-ivory mb-2">PreSale opens soon</h3>
        <p className="text-sm text-ash">
          Direct purchases in USDC on Base will open once the sale is ready. No payments or allocations are being accepted now.
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
          Purchase confirmed
        </h3>
        <p className="text-sm text-ash mb-5 max-w-sm mx-auto">
          {result ? `${result.qtx_amount.toLocaleString('en-US', { maximumFractionDigits: 2 })} QTX recorded for $${result.amount_usd.toLocaleString()}.` : 'Your purchase has been verified on-chain.'}{' '}
          {PURCHASE_COPY}
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
          Confirming…
        </h3>
        <p className="text-sm text-ash">
          Approve the USDC transfer in your wallet, then we verify it on-chain. Don’t close this window.
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
        {!txHash && <button onClick={() => setStep('amount')} className="text-xs text-ash hover:text-ivory mb-4 cursor-pointer">← Back</button>}
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
        {txHash && <a href={`https://${ACTIVE_CHAIN_LABEL === 'Base' ? 'basescan.org' : 'sepolia.basescan.org'}/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="block text-xs text-gold mb-3 underline">View submitted transaction</a>}

        <button
          onClick={executePurchase}
          disabled={!ack1 || !ack2 || wrongNetwork}
          className="w-full rounded-xl bg-gold-gradient py-3.5 font-grotesk font-semibold text-obsidian transition-transform enabled:hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {txHash ? 'Retry verification (no new payment)' : 'Confirm & pay with USDC'}
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
          Buy QTX
        </h3>
        <span className="rounded-lg border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-bright">
          {activePhase.id} · ${activePhase.price.toFixed(3)}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4 rounded-xl border border-gold/20 bg-gold/5 px-3 py-2 text-xs font-grotesk text-gold-bright">
        <Icon name="shield" size={13} /> Paying with USDC on {ACTIVE_CHAIN_LABEL}
      </div>

      <label className="block text-xs text-ash mb-1.5">
        Amount (USDC)
      </label>
      <input
        type="number"
        min={PRESALE.minBuyUsd}
        max={PRESALE.maxBuyUsd}
        step="0.000001"
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

      {/* Email for purchase receipt and dashboard access */}
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
          if (!amountValid) { setErr(`Enter an amount between $${PRESALE.minBuyUsd} and $${PRESALE.maxBuyUsd.toLocaleString()}, with at most 6 decimal places.`); return; }
          if (wrongNetwork) { setErr(`Switch to ${ACTIVE_CHAIN_LABEL} to continue.`); return; }
          setErr(null);
          setStep('review');
        }}
        disabled={!amountValid || wrongNetwork}
        className="w-full rounded-xl bg-gold-gradient py-3.5 font-grotesk font-semibold text-obsidian transition-transform enabled:hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        Continue to review
      </button>

      <p className="text-[11px] text-taupe text-center mt-3 leading-relaxed">
        {PURCHASE_COPY}
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
