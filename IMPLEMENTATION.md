# Qryptix — Implementation Documentation

Next.js 14 PreSale platform with landing page, buyer dashboard, and a gated buy flow.

**Stack:** Next.js 14 (App Router) · React 18 · TypeScript · Tailwind · Framer Motion · Supabase (auth + DB) · wagmi/viem (wallet, Base)

---

## ⚠️ The most important thing to understand

The live buy flow is **gated behind a feature flag** and is currently **OFF**.

```ts
// lib/config.ts
export const FEATURES = {
  BUY_FLOW_ENABLED: false,   // ← keep false until preconditions are met
};
```

**While OFF:** the buy page works as a reservation flow. Users connect a wallet, choose an amount, enter their email — a reservation is recorded, **no money moves.**

**When ON:** the same UI becomes a live purchase — currency selector (USDC/USDT/ETH), mandatory acknowledgement checkboxes, and a real on-chain transfer to the treasury on Base.

**Do not flip the flag to `true` until ALL of these are true:**
1. The smart contract has been independently audited and the report is published.
2. The operating entity (Dubai / VARA-aligned) is established with a bank/treasury in its name.
3. Treasury is a 3-of-5 multisig with `NEXT_PUBLIC_TREASURY_WALLET` set to that address.
4. A functional claim/distribution system exists (so the Refund Policy promises are backed).
5. Legal counsel has reviewed the Terms, Refund Policy, Risk Disclosure, PreSale Terms, and Privacy Policy.

---

## 1. Routes / pages

| Route | Purpose | Auth |
|-------|---------|------|
| `/` | Landing page (hero, presale, tokenomics, roadmap, founder, refund, miners, community, FAQ, risk) | public |
| `/buy` | Join PreSale — hosts the gated BuyFlow | public |
| `/whitepaper` | Whitepaper v1.3 | public |
| `/refund-policy` | Refund Policy (draft) | public |
| `/risk-disclosure` | Risk Disclosure (draft) | public |
| `/terms` | Terms of Use (draft) | public |
| `/privacy` | Privacy Policy (draft) | public |
| `/presale-terms` | PreSale Terms (draft) | public |
| `/login` | Magic link + email/password auth | public |
| `/dashboard` | Buyer overview | protected |
| `/dashboard/transactions` | Purchase history table | protected |
| `/dashboard/wallet` | Wallet link + claim (disabled until TGE) | protected |
| `/dashboard/vesting` | Allocation & vesting progress | protected |
| `/dashboard/refund` | Refund request + status tracking | protected |
| `/dashboard/settings` | Profile, jurisdiction, KYC placeholder | protected |
| `/admin` | Admin preview (purchases + refunds, manual status) | admin only |
| `/auth/callback` | Supabase auth callback | — |

### API routes
| Route | Purpose |
|-------|---------|
| `POST /api/reserve` | Record a reservation (email + wallet + amount) |
| `POST /api/purchase` | Record a purchase (tx hash, status pending) |
| `POST /api/refund` | Submit a refund request |
| `POST /api/admin` | Admin: update purchase/refund status |
| `POST /api/interest` | Miner interest registration |

---

## 2. Components

**Landing sections** (`components/sections/`): Hero, TrustStrip, PresaleSection, Features, Tokenomics, Roadmap, Founder, RefundSection, Miners, Community, FAQ, Footer (+ RiskDisclosure), WhitepaperCTA, ReservationWidget, SectionHeading.

**Buy flow & wallet:** `BuyFlow.tsx` (multi-step purchase/reservation), `ConnectButton.tsx` (wagmi connect), `Web3Provider.tsx` (wagmi + react-query).

**Dashboard:** `DashboardNav.tsx`, `dashboard-ui.tsx` (Card/StatCard/PageTitle/formatters), `StatusBadge.tsx`, `WalletConnect.tsx`, `RefundManager.tsx`, `SettingsForm.tsx`, `AdminStatusControl.tsx`.

**Legal:** `LegalLayout.tsx` (shared layout + prose primitives).

**Shared:** `Navbar.tsx`, `Icon.tsx` (inline SVGs), `WhitepaperSidebar.tsx`.

---

## 3. Environment variables

Copy `.env.example` → `.env.local`:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=            # from Supabase project settings
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=           # server-only, never exposed

# Brevo (reservations / newsletter — you already use this)
BREVO_API_KEY=
BREVO_RESERVATION_LIST_ID=

# Buy flow — keep false until all preconditions met
NEXT_PUBLIC_BUY_FLOW_ENABLED=false

# Wallet / chain (needed when buy flow goes live)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=   # cloud.walletconnect.com
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_TREASURY_WALLET=            # ← your multisig address
NEXT_PUBLIC_USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
NEXT_PUBLIC_USDT_ADDRESS=
```

**Preview mode:** if `NEXT_PUBLIC_SUPABASE_URL` is absent, the app runs with mock data — dashboard and admin render without a database so you can explore the UI. As soon as the URL is set, everything switches to real data.

---

## 4. Data model (Supabase / Postgres)

Run `supabase/migrations/0001_init.sql` in the Supabase SQL editor.

| Table | Holds |
|-------|-------|
| `profiles` | mirrors auth.users; full_name, jurisdiction, kyc_status, is_admin |
| `wallets` | linked wallet addresses per user |
| `presale_stages` | 5 stages, price, status (seeded) |
| `purchases` | user_id, wallet, amount_paid, currency, usd value, qtx_amount, stage, tx_hash, status, timestamps |
| `refund_requests` | user_id, purchase_id, reason, status, requested/reviewed/refunded timestamps, refund_tx_hash |
| `token_allocations` | per-user vesting summary (total, unlocked at TGE, locked, next unlock) |
| `audit_log` | admin/system actions |

**Security:** Row Level Security is enabled on every table. Users can only read/write their own rows; admins (`is_admin = true`) can read all and update purchase/refund status. A signup trigger auto-creates the profile + allocation row.

**Status lifecycles:**
- Purchase: `pending → confirmed | failed | refunded`
- Refund: `requested → under_review → approved | rejected → paid`

To make yourself admin: set `is_admin = true` on your row in `profiles`.

---

## 5. How the buy flow works

1. User opens `/buy`, picks an amount (USD-equivalent). Live QTX calculation at the active stage price.
2. Min/max enforced ($50 / $25,000 — configurable in `lib/config.ts`).
3. User connects a wallet (injected / Coinbase / WalletConnect on Base).
4. **If `BUY_FLOW_ENABLED` is false:** user adds email → reservation saved via `/api/reserve`. No payment.
5. **If true:** user picks currency → Review step → must tick both acknowledgement checkboxes → confirms.
   - USDC/USDT: ERC-20 `transfer` to `TREASURY`.
   - ETH: native value transfer to `TREASURY`.
   - On success, the tx hash is recorded via `/api/purchase` with status `pending`.
6. Purchase appears in the dashboard. Admin (or future automation) verifies the on-chain tx and sets status to `confirmed`.

---

## 6. How the refund process works

1. In `/dashboard/refund`, the user sees the policy summary (eligible / not eligible) and selects a **confirmed** purchase.
2. Submitting calls `/api/refund`, which verifies ownership + confirmed status, then inserts a `refund_requests` row (`requested`).
3. Admin reviews in `/admin`, moving it through `under_review → approved | rejected`, and finally `paid` (with optional refund tx hash).
4. The user tracks status live in their dashboard.

Refunds are only valid **up to Token Claim / TGE**, per the published Refund Policy. After tokens are distributed, no automatic refund applies.

---

## 7. Setup & run

```bash
npm install
cp .env.example .env.local      # fill in values (or leave Supabase blank for preview)
npm run dev                     # http://localhost:3000
```

Supabase setup:
1. Create a project at supabase.com (free tier is fine to start).
2. Run `supabase/migrations/0001_init.sql` in the SQL editor.
3. Enable Email auth (and Magic Link) in Authentication settings.
4. Paste URL + anon key + service role key into `.env.local`.

Deploy: push to GitHub → import in Vercel → add the env vars → point `qryptix.io` DNS at Vercel.

---

## 8. ⚠️ Before going live — must review

**Legal (with a qualified lawyer):**
- All five legal pages are **drafts** with a visible "pending legal review" banner. They must be finalized by counsel before accepting any funds.
- MiCAR (EU) / VARA (Dubai) classification of the token and the offering.
- Whether a notified whitepaper is required; whether geo-restrictions / KYC are mandatory.
- That the Refund Policy is enforceable and backed by the operating entity.

**Technical:**
- **ETH price is a placeholder** ($3000) in `BuyFlow.tsx` — wire a live price feed (Chainlink on Base, or Coingecko API) before enabling ETH payments, or restrict to USDC/USDT initially.
- Set `NEXT_PUBLIC_TREASURY_WALLET` to the **multisig** address, not an EOA.
- Smart-contract audit published and linked on the site.
- Add server-side verification of on-chain transactions (confirm the tx actually landed and matches the recorded amount) before marking purchases `confirmed` — currently this is a manual admin step (intended for the MVP).
- Rate limiting on the API routes; email validation; wallet checksum validation.
- Consider KYC provider integration (the settings page has a placeholder).

**Security:**
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client (it's server-only here — keep it that way).
- No private keys are ever handled in the frontend (transfers are signed by the user's wallet).

---

## 9. What's intentionally NOT built yet

- Automated on-chain payment verification (manual admin confirm for MVP).
- Live ETH/token price oracle (placeholder rate).
- Smart-contract claim portal for TGE (the dashboard claim section is disabled until then).
- Full KYC flow (placeholder only).
- Email notifications on status changes (Brevo is wired for reservations; extend as needed).

— Built with Claude
