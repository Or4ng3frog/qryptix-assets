# Qryptix — Verified Purchase Flow

Production-ready USDC purchase flow with server-side on-chain verification and
refund-policy tracking. **Gated off** (`NEXT_PUBLIC_BUY_FLOW_ENABLED=false`) and
**testnet-default** (`NEXT_PUBLIC_CHAIN_MODE=testnet`) until a Base Sepolia
purchase has been verified end-to-end.

## How it works

1. Buyer connects wallet, enters email + amount, sees QTX (display only).
2. Client enforces the active network (`switchChain` if wrong) and sends a
   **USDC `transfer` to the treasury** on the active chain.
3. Client posts only `{ tx_hash, wallet_address, email }` to `/api/purchase`.
4. Server **never trusts the client**: it re-derives everything from chain.
   - flag on? service-role present? treasury valid? → else reject
   - `tx_hash` not seen before (DB unique index + pre-check)
   - viem fetches the receipt on the active chain and verifies:
     status `success`, correct chain, **correct USDC contract**, recipient ==
     treasury, sender == wallet, and reads the **on-chain amount**
   - server enforces min $50 / max $25k-per-wallet / stage allocation cap
   - QTX computed server-side from the verified USD amount
   - inserts a `confirmed` purchase via the **service-role** client
5. Dashboard reads real purchases (RLS, linked by `user_id` OR email) and shows
   status, tx hash, QTX, refund eligibility + the required copy.

## Changed / new files

| File | Purpose |
|------|---------|
| `lib/chains.ts` *(new)* | `CHAIN_MODE`, active chain/USDC, treasury validation, `PURCHASE_READY` |
| `lib/wagmi.ts` | dual-chain (Base + Base Sepolia) wagmi config; `ERC20_ABI` |
| `lib/config.ts` | `FEATURES.BUY_FLOW_ENABLED` env-driven; `PURCHASE_PARAMS` (price/limits/caps) |
| `lib/server/onchain.ts` *(new, server-only)* | viem public client + `verifyUsdcPayment()` + server `getTreasury()` |
| `app/api/purchase/route.ts` | hardened, verified, service-role insert |
| `supabase/migrations/0002_purchase_flow.sql` *(new)* | purchase columns, nullable `user_id`, unique `tx_hash`, email-linked RLS read |
| `lib/supabase/types.ts`, `lib/data.ts` | extended `Purchase` type + mock |
| `components/BuyFlow.tsx` | USDC-only, network guard, treasury guard, email, verified submit |
| `lib/dashboard-data.ts` | purchases linked by `user_id` OR email |
| `app/dashboard/page.tsx`, `app/dashboard/transactions/page.tsx` | refund eligibility + required copy + chain-aware explorer links |
| `.env.example` | all vars |

## Required env vars

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`NEXT_PUBLIC_CHAIN_MODE` (`testnet`|`mainnet`), `NEXT_PUBLIC_BUY_FLOW_ENABLED` (`false`|`true`),
`NEXT_PUBLIC_TREASURY_WALLET` (and/or server `TREASURY_WALLET`),
`NEXT_PUBLIC_BASE_RPC_URL`, `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`, `BASE_RPC_URL`, `BASE_SEPOLIA_RPC_URL`,
`NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (optional).

## Database migration notes

Run **after** `0001_init.sql`:

```
supabase db push        # or paste supabase/migrations/0002_purchase_flow.sql into the SQL editor
```

0002 adds purchase columns (email, chain_id, payment_token[_address], treasury_wallet,
price_usd, amount_paid_token_units, phase, refund_eligible, refund_*_at, updated_at),
makes `user_id` nullable, adds a **unique index on `tx_hash`**, indexes for caps/dedupe,
an `updated_at` trigger, and replaces the purchases SELECT policy so a signed-in user can
read purchases matching their email. **RLS stays enabled.** Inserts are server-only
(service role) after verification — there is no client insert policy for the verified flow.

## Local test steps (preview / no funds)

- With **Supabase env unset**: app runs in preview/mock mode. `/api/purchase` returns
  `{ ok:true, preview:true }` and records nothing. Dashboard shows clearly-labelled mock data.
- With **Supabase set but `BUY_FLOW_ENABLED=false`**: hero/`/buy` stay in **reservation** mode;
  `/api/purchase` returns `403 Purchase flow is not active`.

## Base Sepolia test steps (real end-to-end, no real money)

1. `.env.local`: set Supabase (url/anon/service-role), `NEXT_PUBLIC_CHAIN_MODE=testnet`,
   `NEXT_PUBLIC_BUY_FLOW_ENABLED=true`, `NEXT_PUBLIC_TREASURY_WALLET=<your Sepolia test wallet>`.
2. Run `0001` + `0002` migrations on the Supabase project.
3. Get Base Sepolia ETH (faucet) + test USDC (`0x036CbD53842c5426634e7929541eC2318f3dCF7e`, Circle faucet).
4. Open `/buy`, connect wallet, enter email + amount (≥ 50), switch to Base Sepolia if prompted, pay.
5. Expect: tx confirms → `/api/purchase` verifies → dashboard shows a **confirmed** purchase with the Sepolia tx link + "Eligible" refund.

### Negative tests (all must be rejected, no record created)

| Test | Expected |
|------|----------|
| Wrong network | UI blocks + offers `Switch to Base Sepolia` |
| Invalid/zero treasury | Purchase UI disabled; API → 503 |
| Amount < $50 | API → 400 minimum |
| Amount pushing wallet > $25k | API → 400 per-wallet cap |
| Duplicate `tx_hash` | API → 409 (and DB unique index) |
| Fake/unknown `tx_hash` | API → 400 "not found / not mined" |
| Tx to wrong recipient | API → 400 "did not match … treasury" |
| Tx with wrong token (not USDC) | API → 400 "No USDC transfer found" |
| Tx amount mismatch | recorded amount = **on-chain** amount (client value ignored) |
| Dashboard | confirmed purchase + refund eligibility visible |

## Production go-live checklist (do NOT skip)

- [ ] Smart-contract / treasury model finalized **and audited** (note: current flow pays a
      treasury wallet directly — there is **no on-chain vesting/claim contract yet**).
- [ ] `NEXT_PUBLIC_TREASURY_WALLET` set to a **multisig (Safe)**, non-zero, checksummed.
- [ ] All Base Sepolia tests above pass (positive + every negative).
- [ ] Supabase project has `0001` + `0002` applied; RLS verified; an admin user set.
- [ ] Private, rate-limited `BASE_RPC_URL` configured (not the public endpoint).
- [ ] Legal pages finalized by counsel; refund policy enforceable.
- [ ] Then, and only then: `NEXT_PUBLIC_CHAIN_MODE=mainnet` + `NEXT_PUBLIC_BUY_FLOW_ENABLED=true`.

## Remaining risks / not yet done

- **No on-chain vesting/claim contract** — vesting/claim is DB-tracked only; the dashboard
  "claim" stays locked. Backing the claim promise needs a real contract.
- **Confirmed on first receipt** — we treat a successful receipt as final. For large amounts
  consider waiting N confirmations / re-checking before `confirmed`.
- **`token_allocations` not auto-updated** by verified purchases — the overview derives
  "Purchased QTX" by summing purchases, but the allocation row isn't recomputed yet
  (add a trigger or post-insert recompute).
- **Refunds are tracked, not automated** — admin moves status manually; no on-chain payout.
- **Rate limiting** — `/api/reserve` + `/api/interest` are still open/unauthenticated.
- **Reservations** are still not persisted (separate from this purchase work).
- **RLS email match** assumes verified Supabase emails; keep email confirmation on.
