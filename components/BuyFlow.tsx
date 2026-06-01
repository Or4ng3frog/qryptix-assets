'use client';

import { useState } from 'react';
import { useAccount, useSendTransaction, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { FEATURES, PHASES, PRESALE, PURCHASE_ACKS } from '@/lib/config';
import { TOKENS, TREASURY, ERC20_ABI } from '@/lib/wagmi';
import { SUPABASE_CONFIGURED } from '@/lib/data';
import { ConnectButton } from './ConnectButton';
import { Icon } from './Icon';

type Currency = 'USDC' | 'USDT' | 'ETH';
type Step = 'amount' | 'review' | 'processing' | 'done';

// Indicative ETH price for the calculator only (real flow would fetch live)
const ETH_USD = 3000;

export function BuyFlow() {
  const buyEnabled = FEATURES.BUY_FLOW_ENABLED;
  const activePhase = PHASES.find((p) => p.active) ?? PHASES[0];

  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();

  const [usd, setUsd] = useState('500');
  const [currency, setCurrency] = useState<Currency>('USDC');
  const [step, setStep] = useState<Step>('amount');
  const [ack1, setAck1] = useState(false);
  const [ack2, setAck2] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const usdNum = parseFloat(usd) || 0;
  const qtx = usdNum / activePhase.price;
  const belowMin = usdNum < PRESALE.minBuyUsd;
  const aboveMax = usdNum > PRESALE.maxBuyUsd;
  const amountValid = usdNum > 0 && !belowMin && !aboveMax;

  // amount the user sends in the chosen currency
  const payAmount = currency === 'ETH' ? usdNum / ETH_USD : usdNum;

  const recordPurchase = async (hash: string | null, status: 'pending' | 'confirmed') => {
    try {
      await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: address ?? null,
          amount_paid: payAmount,
          payment_currency: currency,
          amount_paid_usd: usdNum,
          qtx_amount: qtx,
          presale_stage: activePhase.id.replace('P', ''),
          tx_hash: hash,
          status,
        }),
      });
    } catch {
      /* preview / network — non-fatal */
    }
  };

  // ---- Reservation path (buy flow OFF) ----
  const [resEmail, setResEmail] = useState('');
  const submitReservation = async () => {
    setErr(null);
    if (!resEmail || !address) {
      setErr('Connect a wallet and enter your email to reserve.');
      return;
    }
    setStep('processing');
    await fetch('/api/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: resEmail, wallet: address, usdc: usd, phase: activePhase.id }),
    }).catch(() => {});
    setStep('done');
  };

  // ---- Purchase path (buy flow ON) ----
  const executePurchase = async () => {
    setErr(null);
    setStep('processing');
    try {
      let hash: string;
      if (currency === 'ETH') {
        hash = await sendTransactionAsync({
          to: TREASURY,
          value: parseUnits(payAmount.toFixed(18), 18),
        });
      } else {
        const token = TOKENS[currency];
        hash = await writeContractAsync({
          address: token.address!,
          abi: ERC20_ABI,
          functionName: 'transfer',
          args: [TREASURY, parseUnits(payAmount.toFixed(token.decimals), token.decimals)],
        });
      }
      setTxHash(hash);
      await recordPurchase(hash, 'pending');
      setStep('done');
    } catch (e: any) {
      setErr(e?.shortMessage ?? e?.message ?? 'Transaction was rejected or failed.');
      setStep('review');
    }
  };

  // ============================================================
  //  DONE state
  // ============================================================
  if (step === 'done') {
    return (
      <div className="glass-luxe rounded-3xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient text-obsidian">
          <Icon name="check" size={26} />
        </div>
        <h3 className="font-serif font-medium text-xl text-ivory mb-2">
          {buyEnabled ? 'Purchase submitted' : 'Spot reserved'}
        </h3>
        <p className="text-sm text-ash mb-5 max-w-sm mx-auto">
          {buyEnabled
            ? 'Your transaction has been submitted. It will appear in your dashboard once confirmed on Base.'
            : `Your Phase ${activePhase.id} price of $${activePhase.price.toFixed(3)} is locked. We'll email you the moment the buy flow opens.`}
        </p>
        {txHash && (
          <a
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-gold hover:underline mb-5"
          >
            View on Basescan <Icon name="external" size={14} />
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
  //  PROCESSING state
  // ============================================================
  if (step === 'processing') {
    return (
      <div className="glass-luxe rounded-3xl p-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
        <h3 className="font-serif font-medium text-lg text-ivory mb-1">
          {buyEnabled ? 'Confirm in your wallet…' : 'Reserving your spot…'}
        </h3>
        <p className="text-sm text-ash">
          {buyEnabled ? 'Approve the transaction in your wallet to complete your purchase.' : 'One moment.'}
        </p>
      </div>
    );
  }

  // ============================================================
  //  REVIEW state
  // ============================================================
  if (step === 'review') {
    return (
      <div className="glass-luxe rounded-3xl p-7">
        <button onClick={() => setStep('amount')} className="text-xs text-ash hover:text-ivory mb-4 cursor-pointer">← Back</button>
        <h3 className="font-serif font-medium text-lg text-ivory mb-5">Review & confirm</h3>

        <div className="rounded-2xl bg-obsidian/40 border border-white/[0.06] p-4 mb-4 space-y-2.5">
          <Row label="You pay" value={`${payAmount.toLocaleString('en-US', { maximumFractionDigits: currency === 'ETH' ? 6 : 2 })} ${currency}`} />
          <Row label="≈ USD value" value={`$${usdNum.toLocaleString()}`} />
          <Row label="You receive" value={`${qtx.toLocaleString('en-US', { maximumFractionDigits: 2 })} QTX`} accent />
          <Row label="Price" value={`$${activePhase.price.toFixed(3)} (Stage ${activePhase.id})`} />
          <Row label="Claim" value="At TGE" />
        </div>

        {/* Acknowledgements */}
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
          disabled={!ack1 || !ack2}
          className="w-full rounded-xl bg-gold-gradient py-3.5 font-grotesk font-semibold text-obsidian transition-transform enabled:hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Confirm purchase
        </button>
        <p className="text-[11px] text-taupe text-center mt-3">
          You will send {currency} to the Qryptix treasury on Base. Network fees apply.
        </p>
      </div>
    );
  }

  // ============================================================
  //  AMOUNT state (entry)
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

      {/* Currency selector */}
      {buyEnabled && (
        <div className="flex gap-2 mb-4">
          {(PRESALE.currencies as readonly Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`flex-1 rounded-xl py-2.5 text-sm font-medium border transition-all cursor-pointer ${
                currency === c
                  ? 'border-gold/40 bg-gradient-to-br from-gold/15 to-gold-deep/10 text-gold-bright'
                  : 'border-white/8 text-ash hover:border-gold/25'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <label className="block text-xs text-ash mb-1.5">Amount (USD-equivalent)</label>
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

      {/* Wallet */}
      <div className="mb-4">
        <ConnectButton />
      </div>

      {/* Reservation email (only when buy flow off) */}
      {!buyEnabled && (
        <input
          type="email"
          value={resEmail}
          onChange={(e) => setResEmail(e.target.value)}
          placeholder="you@example.com (for launch notification)"
          className="w-full rounded-xl bg-obsidian/60 border border-white/8 px-4 py-3 text-ivory focus:outline-none focus:border-gold/50 transition-colors mb-4"
        />
      )}

      {err && <p className="text-sm text-red-400 mb-3">{err}</p>}

      <button
        onClick={() => {
          if (!isConnected) { setErr('Please connect your wallet first.'); return; }
          if (!amountValid) { setErr(`Enter an amount between $${PRESALE.minBuyUsd} and $${PRESALE.maxBuyUsd.toLocaleString()}.`); return; }
          setErr(null);
          if (buyEnabled) setStep('review');
          else submitReservation();
        }}
        disabled={!amountValid}
        className="w-full rounded-xl bg-gold-gradient py-3.5 font-grotesk font-semibold text-obsidian transition-transform enabled:hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {buyEnabled ? 'Continue to review' : 'Reserve My Spot'}
      </button>

      <p className="text-[11px] text-taupe text-center mt-3 leading-relaxed">
        {buyEnabled ? (
          <>Participation is speculative. Tokens are claimable only at TGE. No listing, liquidity, reward or value increase is guaranteed.</>
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
