# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Qryptix (QTX) presale platform — a Next.js 14 (App Router) site with a public landing page + whitepaper, a buyer dashboard, an admin view, and a **feature-gated** crypto buy flow on Base. Stack: React 18 · TypeScript · Tailwind · Framer Motion · Supabase (auth + Postgres) · wagmi/viem.

`IMPLEMENTATION.md` is the authoritative deep reference (full route table, data model, buy/refund flows, go-live checklist). Read it before substantial work. `README.md` covers the marketing-site basics.

## Commands

```bash
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint     # next lint
```

There is no test suite. Verify changes via `npm run build` and manual runs.

## Two cross-cutting flags that govern behavior

These are not minor settings — they change what the entire app does. Always check them before reasoning about runtime behavior.

1. **`FEATURES.BUY_FLOW_ENABLED`** in `lib/config.ts` (mirrors `NEXT_PUBLIC_BUY_FLOW_ENABLED`). When `false` (current state), `/buy` and `BuyFlow.tsx` render a **reservation** flow — no funds move, email + wallet + amount are saved via `/api/reserve`. When `true`, the *same UI* becomes a live on-chain purchase (USDC/USDT ERC-20 transfer or native ETH to `TREASURY`, recorded via `/api/purchase`). Do not flip this to `true` — `IMPLEMENTATION.md` §⚠️ lists the audit/entity/multisig/legal preconditions.

2. **`SUPABASE_CONFIGURED`** (`lib/data.ts`) — true only when `NEXT_PUBLIC_SUPABASE_URL` + anon key are set. When **absent, the app runs in "preview mode" with mock data**: `lib/dashboard-data.ts` returns `MOCK_*` records, API routes short-circuit to `{ ok: true, preview: true }`, and `middleware.ts` skips auth entirely. This is why the dashboard/admin render with no database locally. Any new server data path must handle both branches.

## Architecture

- **Content is centralized in `lib/config.ts`** — site metadata, contract address, socials, founder bio, presale `PHASES`/`PRESALE` params, `ALLOCATIONS`, miners, roadmap, FAQs, refund eligibility/rules/statuses, risk bullets. Landing sections and dashboard logic read from these exports rather than hardcoding. Edit content here, not in components.

- **Auth & route protection** — `middleware.ts` (matcher: `/dashboard/*`, `/admin/*`) refreshes the Supabase session and redirects unauthenticated users to `/login?redirect=…`. Supabase clients live in `lib/supabase/`: `client.ts` (browser), `server.ts` exports `createClient()` (anon, cookie-bound, for RLS-scoped reads) **and** `createServiceClient()` (service-role, server-only — never import into a client component).

- **Data fetching** — server components call helpers in `lib/dashboard-data.ts` / `lib/data.ts` that branch on `SUPABASE_CONFIGURED`. Authoritative writes go through `app/api/*/route.ts` handlers, each of which re-checks auth via `supabase.auth.getUser()` and (where relevant) writes an `audit_log` row.

- **Database** — single migration `supabase/migrations/0001_init.sql` (run in Supabase SQL editor). Tables: `profiles`, `wallets`, `presale_stages`, `purchases`, `refund_requests`, `token_allocations`, `audit_log`. **Row Level Security is on every table** — users see only their own rows; admins (`profiles.is_admin = true`) read all and update purchase/refund status. A signup trigger auto-creates profile + allocation. Types in `lib/supabase/types.ts`.

- **Web3 layer** — `lib/wagmi.ts` configures wagmi for Base only (injected / Coinbase / WalletConnect), and exports `TOKENS` (USDC/USDT/ETH), `TREASURY`, and a minimal `ERC20_ABI`. `components/Web3Provider.tsx` wraps wagmi + react-query; transfers are signed by the user's wallet — no private keys touch the frontend. **ETH price is a hardcoded placeholder ($3000) in `BuyFlow.tsx`** — wire a live feed before enabling ETH.

- **Status lifecycles** — Purchase: `pending → confirmed | failed | refunded`. Refund: `requested → under_review → approved | rejected → paid`. On-chain tx verification is a **manual admin step** (`/admin`, `AdminStatusControl.tsx`) for the MVP — there is no automated chain verification yet.

- **Components** — landing UI in `components/sections/`, dashboard primitives in `components/dashboard-ui.tsx`, legal pages share `components/LegalLayout.tsx`. Icons are inline SVG via `components/Icon.tsx` (no icon dependency).

## Conventions

- Path alias `@/` → repo root (e.g. `@/lib/config`).
- All five legal pages (`/terms`, `/privacy`, `/refund-policy`, `/risk-disclosure`, `/presale-terms`) are **drafts** with a "pending legal review" banner — treat their text as non-final.
- Honest-marketing framing is intentional: reservations not investments, status-coded roadmap (done/now/planned), prominent risk disclosure. Preserve this tone; never describe QTX as an "investment."
