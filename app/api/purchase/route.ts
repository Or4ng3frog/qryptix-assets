import { NextRequest, NextResponse } from 'next/server';
import { getAddress, isAddress } from 'viem';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { ONCHAIN, getTreasury, verifyUsdcPayment } from '@/lib/server/onchain';
import { PURCHASE_PARAMS } from '@/lib/config';

// ============================================================
//  Verified purchase endpoint.
//
//  The client submits ONLY { tx_hash, wallet_address, email }. Everything
//  financial (amount, USD value, QTX) is derived from the on-chain USDC
//  transfer — never from the client. A record is created only after the
//  transaction is verified server-side.
// ============================================================

const BUY_ENABLED = process.env.NEXT_PUBLIC_BUY_FLOW_ENABLED === 'true';
const HAS_SERVICE_ROLE = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TXHASH_RE = /^0x[a-fA-F0-9]{64}$/;

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: NextRequest) {
  // Preview mode (no Supabase at all) — short-circuit, never pretend to record.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ ok: true, preview: true });
  }

  // ---- Hard runtime guards ----
  if (!BUY_ENABLED) return fail('Purchase flow is not active.', 403);
  if (!HAS_SERVICE_ROLE) return fail('Server is not configured for verified purchases.', 503);

  const treasury = getTreasury();
  if (!treasury.valid) return fail(`Treasury misconfigured: ${treasury.error}`, 503);

  // ---- Parse + shape validation ----
  let body: any;
  try {
    body = await req.json();
  } catch {
    return fail('Invalid request body.', 400);
  }

  const email = String(body.email ?? '').trim().toLowerCase();
  const walletRaw = String(body.wallet_address ?? '').trim();
  const txHash = String(body.tx_hash ?? '').trim();

  if (!EMAIL_RE.test(email)) return fail('A valid email is required.', 400);
  if (!isAddress(walletRaw)) return fail('A valid wallet address is required.', 400);
  if (!TXHASH_RE.test(txHash)) return fail('A valid transaction hash is required.', 400);
  const wallet = getAddress(walletRaw);

  const svc = createServiceClient();

  // ---- Duplicate tx guard (also enforced by a DB unique index) ----
  const { data: dupe } = await svc.from('purchases').select('id').eq('tx_hash', txHash).maybeSingle();
  if (dupe) return fail('This transaction has already been recorded.', 409);

  // ---- On-chain verification (source of truth for the amount) ----
  const verified = await verifyUsdcPayment(txHash as `0x${string}`, {
    from: wallet,
    to: treasury.address!,
  });
  if (!verified.ok) return fail(verified.error, 400);

  const amountUsd = Number(verified.amountUnits) / 10 ** ONCHAIN.usdcDecimals;

  // ---- Server-side limits ----
  if (amountUsd < PURCHASE_PARAMS.minUsd) {
    return fail(`Minimum purchase is $${PURCHASE_PARAMS.minUsd}.`, 400);
  }
  if (amountUsd > PURCHASE_PARAMS.maxUsdPerWallet) {
    return fail(`Maximum per purchase is $${PURCHASE_PARAMS.maxUsdPerWallet.toLocaleString()}.`, 400);
  }

  // Per-wallet cumulative cap (exclude failed records)
  const { data: priorByWallet } = await svc
    .from('purchases')
    .select('amount_paid_usd')
    .eq('wallet_address', wallet)
    .neq('status', 'failed');
  const priorUsd = (priorByWallet ?? []).reduce((s: number, r: any) => s + Number(r.amount_paid_usd ?? 0), 0);
  if (priorUsd + amountUsd > PURCHASE_PARAMS.maxUsdPerWallet) {
    return fail(`This wallet would exceed the $${PURCHASE_PARAMS.maxUsdPerWallet.toLocaleString()} per-wallet cap.`, 400);
  }

  // QTX is computed server-side from the verified USD amount.
  const qtx = amountUsd / PURCHASE_PARAMS.priceUsd;

  // Stage allocation cap
  const { data: stageRows } = await svc
    .from('purchases')
    .select('qtx_amount')
    .eq('presale_stage', PURCHASE_PARAMS.stage)
    .neq('status', 'failed');
  const stageQtx = (stageRows ?? []).reduce((s: number, r: any) => s + Number(r.qtx_amount ?? 0), 0);
  if (stageQtx + qtx > PURCHASE_PARAMS.stageAllocationQtx) {
    return fail('Stage allocation cap reached for this phase.', 400);
  }

  // ---- Attach a user_id if the buyer is signed in (optional) ----
  let userId: string | null = null;
  try {
    const sb = createClient();
    const { data } = await sb.auth.getUser();
    userId = data.user?.id ?? null;
  } catch {
    /* not signed in — record by email + wallet */
  }

  // ---- Persist (verified → confirmed) ----
  const { error } = await svc.from('purchases').insert({
    user_id: userId,
    email,
    wallet_address: wallet,
    chain_id: ONCHAIN.chainId,
    payment_currency: 'USDC',
    payment_token: 'USDC',
    payment_token_address: ONCHAIN.usdc,
    treasury_wallet: treasury.address,
    tx_hash: txHash,
    amount_paid: amountUsd,
    amount_paid_usd: amountUsd,
    amount_paid_token_units: verified.amountUnits.toString(),
    qtx_amount: qtx,
    presale_stage: PURCHASE_PARAMS.stage,
    phase: PURCHASE_PARAMS.phaseCode,
    price_usd: PURCHASE_PARAMS.priceUsd,
    status: 'confirmed',
    refund_eligible: true,
    confirmed_at: new Date().toISOString(),
  });
  if (error) {
    // Unique-violation race on tx_hash → treat as duplicate.
    if ((error as any).code === '23505') return fail('This transaction has already been recorded.', 409);
    return fail(error.message ?? 'Could not record purchase.', 400);
  }

  await svc.from('audit_log').insert({
    actor_id: userId,
    action: 'purchase_verified',
    entity: 'purchase',
    meta: { tx_hash: txHash, usd: amountUsd, qtx, chain_id: ONCHAIN.chainId, wallet },
  });

  return NextResponse.json({
    ok: true,
    status: 'confirmed',
    amount_usd: amountUsd,
    qtx_amount: qtx,
    chain_id: ONCHAIN.chainId,
  });
}
