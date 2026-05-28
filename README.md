# Qryptix — Next.js 14

Modern, dark, marketing-forward landing page + whitepaper for Qryptix (QTX),
a multi-utility token on Base.

Stack: **Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Framer Motion**

---

## Quick start

```bash
npm install
npm run dev
# → http://localhost:3000
```

Build for production:

```bash
npm run build
npm run start
```

---

## Project structure

```
app/
  layout.tsx          → root layout, SEO metadata, ambient background layers
  page.tsx            → landing page (assembles all sections)
  globals.css         → fonts, base styles, custom utilities (glass, gradients, grid)
  whitepaper/
    page.tsx          → full 15-section whitepaper
  api/
    reserve/route.ts  → reservation endpoint (Brevo-ready)
    interest/route.ts → miner interest endpoint

components/
  Navbar.tsx
  Icon.tsx            → inline SVG icons (no dependency)
  WhitepaperSidebar.tsx
  sections/
    Hero.tsx, ReservationWidget.tsx, TrustStrip.tsx,
    Features.tsx, Tokenomics.tsx, Founder.tsx,
    Roadmap.tsx, Miners.tsx, FAQ.tsx, Footer.tsx

lib/
  config.ts           → ★ ALL CONTENT + FEATURE FLAGS live here
  whitepaper.ts       → whitepaper section index (for sidebar)
  useReveal.ts        → scroll-reveal hook

public/
  Q_Only.png          → logo (header/footer)
  Logo_200h.png       → full logo
  founder.jpg         → ← ADD YOUR PHOTO HERE (falls back to "DK" initials)
```

---

## The one file you'll edit most: `lib/config.ts`

Everything content-related is centralized there:

- **`FEATURES.BUY_FLOW_ENABLED`** — the kill switch. Keep `false` until audit
  published + entity finalized + multisig live. Flip to `true` and the same
  reservation button becomes a real purchase button.
- `SITE` — contract address, Basescan URL, ticker, supply, TGE target
- `SOCIALS` — Twitter / Telegram / Discord / GitHub / LinkedIn
- `FOUNDER` — name, role, bio, photo path
- `PHASES` — the 5 presale phases + prices
- `ALLOCATIONS` — tokenomics breakdown (donut chart reads from here)
- `MINERS`, `ROADMAP`, `FAQS`, `WHY_FEATURES`

---

## TODO before going live

| # | Task | Where |
|---|------|-------|
| 1 | Real contract address + Basescan link | `lib/config.ts` → `SITE.contractAddress`, `SITE.basescanUrl` |
| 2 | Founder photo | drop `founder.jpg` into `/public` |
| 3 | Real phase allocations (mine are estimates) | `lib/config.ts` → `PHASES`, `ALLOCATIONS` |
| 4 | Social URLs | `lib/config.ts` → `SOCIALS` |
| 5 | Brevo wiring for reservations | `app/api/reserve/route.ts` (Option A block, commented) |
| 6 | Your own bio text | `lib/config.ts` → `FOUNDER.bio` |
| 7 | Legal pages (Terms, Privacy, Cookie) | currently `#` placeholders in Footer |
| 8 | Replace estimated whitepaper numbers | `app/whitepaper/page.tsx` |

---

## Environment variables

Copy `.env.example` → `.env.local`:

```
BREVO_API_KEY=
BREVO_RESERVATION_LIST_ID=
NEXT_PUBLIC_BUY_FLOW_ENABLED=false
```

---

## Deploy (Vercel)

1. Push to a GitHub repo (e.g. `Or4ng3frog/qryptix`)
2. Import in Vercel → it auto-detects Next.js
3. Add the env variables in Vercel project settings
4. Point `qryptix.io` DNS at Vercel when ready to switch from the old site

---

## Fonts

Clash Display (headlines) + Satoshi (body) load from a CDN in `globals.css`.
For production reliability, consider self-hosting them in `/public/fonts`
and updating the `@font-face` URLs. JetBrains Mono loads from Google Fonts.

---

## Notes on the honest-marketing approach

- Reservation flow, not a live buy flow — no funds taken until audit + entity ready.
- Miners are "register interest", not purchase — no prepayment for unproduced hardware.
- Roadmap is status-coded (done / now / planned) — no fake "completed" items.
- Risk disclosure is prominent — builds trust with serious buyers.
- Real phase-based scarcity (P1→P5 price ladder) instead of fake countdowns.

When you're ready to add a legitimate bonus campaign, the
`FEATURES.BONUS_CAMPAIGN_ENABLED` flag is already stubbed in `lib/config.ts`.

— Built with Claude
