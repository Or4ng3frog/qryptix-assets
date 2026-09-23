# Qryptix implementation (September 2026)

This document describes the current feature branch. See [docs/PURCHASE-FLOW.md](docs/PURCHASE-FLOW.md) for transaction verification, environment variables, test steps and production risks.

## Current status

- The direct USDC purchase flow on Base is implemented but disabled by default (`NEXT_PUBLIC_BUY_FLOW_ENABLED=false`). The closed buy page accepts neither payments nor reservations. There is no `/api/reserve` or miner-interest endpoint.
- A purchase is recorded only after the server verifies the on-chain USDC transfer. The purchase route needs Supabase, a service-role key, a valid treasury wallet and an enabled buy flag. The default network mode is testnet.
- The dashboard reads actual purchases when Supabase is configured. Without it, the dashboard shows an empty, labelled preview; the admin page, wallet persistence and refund requests do not claim success in preview mode.
- The displayed allocation and proposed 10% / 90% vesting split are derived from confirmed purchases. Tokens cannot yet be claimed; the on-chain claim and vesting contracts are not deployed here.
- Refund requests are recorded for review, with no automatic payout or automatic entitlement. The legal pages and whitepaper remain drafts pending review.
- Miner tiers, prices and hardware delivery dates are indicative concepts. There is no miner registration, order or prepayment path.

## Main routes

| Route | Status |
|-------|--------|
| `/` and `/whitepaper` | Public proposed roadmap, tokenomics and risk details |
| `/buy` | Closed unless all purchase gates are enabled |
| `/dashboard`, `/dashboard/transactions`, `/dashboard/vesting`, `/dashboard/wallet`, `/dashboard/refund` | Authenticated buyer views with empty preview when Supabase is absent |
| `/admin` | Requires a configured Supabase admin profile |
| `/api/purchase` | Server verifies USDC transfer before recording |
| `/api/refund` | Authenticated confirmed buyer may submit a request for review |
| `/api/admin` | Authenticated admin updates purchase or refund status |

## Release preconditions

1. Final entity, jurisdiction, participant eligibility and legal pages confirmed by qualified advisers.
2. Token, vesting and claim mechanics independently audited, deployed and documented with verified addresses.
3. Multisig treasury set up; refund and reconciliation procedures defined. A direct transfer can succeed before the server records an allocation, so this must be resolved before mainnet purchases.
4. Database migrations applied and RLS checked; full Base Sepolia purchase and refund-flow tests passed.
5. Only then consider `NEXT_PUBLIC_CHAIN_MODE=mainnet` and `NEXT_PUBLIC_BUY_FLOW_ENABLED=true`. The domain switch is separate from enabling purchases.

The Q1 2027 TGE and early Q2 2027 miner batch are conditional targets, not fixed commitments. The first hardware batch also depends on prototype validation, production and approvals.
