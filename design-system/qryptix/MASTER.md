# Design System Master File — Qryptix

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file. Otherwise follow the rules below.

**Project:** Qryptix (QTX) — crypto / DePIN / hardware-mining presale
**Direction:** Premium Dark Luxe · cinematic · editorial
**Authored:** 2026-06-01 (hand-authored; supersedes auto-generated seed)

> NOTE: The `search.py --design-system` generator mis-matched this project twice
> (gold/purple, then light-mode Liquid Glass). This file is the source of truth.
> Treat generator output as inspiration only.

---

## 1. Design Intent

A high-end, cinematic presale site that reads like a **luxury hardware brand**, not a
meme coin. Near-black canvas, warm metallic gold as the single hero accent, editorial
serif display type, and slow, weighty motion. Everything should feel deliberate,
expensive, and trustworthy — reinforcing the honest-marketing framing (reservations,
not investments; prominent risk disclosure).

**Feel:** Patek Philippe × a server-rack DePIN network. Restraint over flash.

---

## 2. Color Palette (Dark only — no light mode)

| Role | Hex | Token | Usage |
|------|-----|-------|-------|
| Canvas (base) | `#08080A` | `obsidian` | Page background |
| Panel | `#0C0C10` | `onyx` | Section bands |
| Card | `#121217` | `graphite` | Cards, glass base |
| Raised | `#1A1A21` | `slate` | Inputs, raised surfaces |
| **Gold (primary)** | `#E3B341` | `gold` | Primary accent, CTAs |
| Gold bright | `#F4D88A` | `gold-bright` | Highlights, hover sheen |
| Gold deep | `#9A6F24` | `gold-deep` | Gradients, pressed states |
| Champagne | `#EBE3CE` | `champagne` | Subtle warm tint, dividers |
| Ivory (text) | `#F4F1EA` | `ivory` | Primary text |
| Warm grey | `#A8A39A` | `ash` | Secondary text |
| Faint | `#6E6A62` | `taupe` | Muted labels, captions |

**Functional (dashboard/status — keep semantic):** success `#4ADE80`, warning `#E3B341`,
danger `#F87171`, info `#9CC3E8`. Use sparingly; the brand accent is gold.

**Restraint calibration (locked 2026-06-01):** gold is used *sparingly*. Reserve gold for:
primary CTA fills, **one** accent word per headline, active/selected states, key metric
emphasis, and small status dots. Everything else is near-black surfaces + ivory/ash text
with **neutral** hairline borders (`rgba(244,241,234,0.06)`); promote borders to gold only
on hover or for a single featured element. Eyebrows: muted `gold` (not `gold-bright`).
Glows subtle (≤0.14 alpha). When in doubt, use ivory — not gold.

**Rules**
- Gold is the *only* brand accent. No cyan/violet from the old design. No second bright hue.
- Cool neutral `#9CC3E8` permitted only for tiny data/link affordances, never as a fill.
- Borders: hairlines — `rgba(244,241,234,0.06)` default, `rgba(227,179,65,0.28)` for gold edges.
- Maintain 4.5:1 text contrast on `#08080A` (ivory and ash pass; taupe is for ≥14px non-essential only).

### Gradients
- `gold-gradient`: `linear-gradient(120deg, #F4D88A 0%, #E3B341 48%, #9A6F24 100%)`
- `gold-sheen` (animated text): `linear-gradient(110deg, #9A6F24, #F4D88A, #E3B341, #F4D88A, #9A6F24)` 200% sweep
- `obsidian-fade`: `radial-gradient(ellipse at 50% 0%, rgba(227,179,65,0.14), transparent 70%)`

---

## 3. Typography

| Role | Font | Notes |
|------|------|-------|
| Display | **Playfair Display** (600/700, italic for accent words) | Big editorial headlines only |
| Body / UI | **Inter** (300–600) | All copy, buttons, labels |
| Mono / data | **JetBrains Mono** (400–600) | Prices, token amounts, wallet addresses, stats |

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap');
```

**Scale (fluid):**
- `display-xl` (hero): `clamp(3rem, 8vw, 6.5rem)`, line-height 1.0, letter-spacing -0.02em, Playfair
- `display` (section H2): `clamp(2.25rem, 5vw, 4rem)`, line-height 1.05, Playfair
- `lead`: 1.125–1.25rem, Inter 400, ash/ivory
- `body`: 1rem, Inter 400, line-height 1.6
- `eyebrow`: 0.75rem, Inter 600, uppercase, letter-spacing 0.22em, gold
- `data`: JetBrains Mono, tabular-nums

**Pairing rule:** Playfair for *nouns of value* (headlines, big numbers as words), Inter for
everything functional, Mono for *literal* numbers/addresses. Never set body in Playfair.

---

## 4. Motion Language (restrained luxe)

Slow, eased, weighty. Motion should feel like heavy metal moving on bearings — never bouncy.

- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (primary), `cubic-bezier(0.65, 0, 0.35, 1)` for sync scrolls.
- **Durations:** reveals 700–1000ms; micro-interactions 200–300ms; gold sheen sweep 6–8s loop.
- **Reveal:** fade + 24–40px rise + subtle 0.98→1 scale, staggered 60–90ms.
- **Scroll-linked:** parallax depth on glows/decoration; sticky "scene" pinning for Tokenomics & Roadmap; scroll-progress gold rule.
- **Hover:** gold border bloom, slight brightness — NO layout-shifting scale on cards (use translateY ≤2px / shadow).
- **Hard rule:** wrap all non-essential motion in `prefers-reduced-motion: reduce` → reduce to opacity-only or none. (The old `useReveal`/Hero did NOT respect this — fix in rebuild.)
- **Forbidden:** fast/snappy springs, bounce, confetti, neon flicker, anything that reads "cheap."

---

## 5. Effects & Surfaces

- **Glass (warm dark):** `background: rgba(18,18,23,0.62); backdrop-filter: blur(20px); border: 1px solid rgba(227,179,65,0.16)`.
- **Volumetric glow:** warm gold radial behind hero & section anchors (replaces old violet/cyan glows).
- **Film grain:** keep the existing fine noise overlay (opacity ~0.025).
- **Dividers:** 1px champagne/gold hairlines, often gradient-faded at the ends.
- **Metallic border:** gradient-masked gold border on featured cards (reuse the `glow-border` technique, recolored gold).
- **Grid backdrop:** faint warm grid, radial-masked at top (recolor existing `bg-grid-fade` to gold rgba).

---

## 6. Page Pattern & Section Order

Vertical cinematic scroll with two pinned "scenes." Sticky CTA in navbar.

1. **Hero** — editorial headline + reservation widget (sealed logic core)
2. **Trust strip** — doxxed founder, Base, LP lock, fixed supply (marquee or static)
3. **The Network (DePIN)** — what the hardware layer is, network/topology visual *(new)*
4. **Mining hardware showcase** — the rigs/miners, specs *(new — extends existing Miners)*
5. **Mining economics / stats scene** — illustrative figures, clearly labeled *(new)*
6. **Features** — multi-utility token value props (bento)
7. **Tokenomics** — allocations, vesting; **pinned cinematic scene**
8. **Roadmap** — status-coded (done/now/planned); **pinned timeline scene**
9. **Founder** — doxxed bio, trust
10. **Refund** — eligibility, honest framing
11. **Community** — socials
12. **Whitepaper CTA → FAQ → Risk Disclosure → Footer**

> **Data integrity:** any "live" mining/network number that is not actually wired to a
> real source MUST be labeled *illustrative / target*. Never imply live earnings. This
> is a presale in reservation mode — honest-marketing rule overrides visual appeal.

---

## 7. Component Specs (dark luxe)

### Primary button (CTA)
```css
background: linear-gradient(120deg, #F4D88A, #E3B341 50%, #9A6F24);
color: #08080A; font-weight: 600; border-radius: 9999px;
padding: 14px 28px; transition: box-shadow .25s, filter .25s;
/* hover */ filter: brightness(1.04); box-shadow: 0 10px 40px -12px rgba(227,179,65,0.55);
```

### Secondary button
```css
background: transparent; color: #F4F1EA;
border: 1px solid rgba(227,179,65,0.30); border-radius: 9999px; padding: 14px 28px;
/* hover */ border-color: rgba(227,179,65,0.7); background: rgba(227,179,65,0.05);
```

### Card
```css
background: rgba(18,18,23,0.62); backdrop-filter: blur(20px);
border: 1px solid rgba(244,241,234,0.06); border-radius: 20px; padding: 24px;
/* hover */ border-color: rgba(227,179,65,0.28); transform: translateY(-2px);
transition: border-color .3s, transform .3s; cursor: pointer;
```

### Input
```css
background: #1A1A21; border: 1px solid rgba(244,241,234,0.08);
border-radius: 12px; padding: 12px 16px; color: #F4F1EA; font-size: 16px;
/* focus */ border-color: rgba(227,179,65,0.55); outline: none;
box-shadow: 0 0 0 3px rgba(227,179,65,0.12);
```

---

## 8. Anti-Patterns (Do NOT use)

- ❌ Light backgrounds (this is a dark-only system)
- ❌ The old cyan/violet brand accents (full pivot to gold)
- ❌ Fast/bouncy animations or neon glow flicker
- ❌ Emojis as icons → use Lucide / inline SVG (`components/Icon.tsx`)
- ❌ Unlabeled "live" stats implying real earnings
- ❌ Layout-shifting hover scales on cards
- ❌ Body copy set in Playfair (serif is display-only)
- ❌ Describing QTX as an "investment"

---

## 9. Pre-Delivery Checklist

- [ ] Dark-only; gold is the sole brand accent
- [ ] Text contrast ≥4.5:1 on `#08080A`
- [ ] `prefers-reduced-motion` respected on every animation
- [ ] No emojis as icons; consistent SVG/Lucide set
- [ ] `cursor-pointer` on all clickable elements; visible focus rings
- [ ] Hover transitions 150–300ms, no layout shift
- [ ] Reservation/Web3 logic untouched; `BUY_FLOW_ENABLED` stays false
- [ ] Any mining/network stat labeled illustrative unless truly wired
- [ ] Responsive at 375 / 768 / 1024 / 1440; no horizontal scroll
- [ ] `npm run build` green after each phase
