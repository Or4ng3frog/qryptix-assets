// ============================================================
//  QRYPTIX — Central configuration
//  Edit content here. The buy-flow flag gates the live purchase.
// ============================================================

export const FEATURES = {
  // Env-driven. Flip NEXT_PUBLIC_BUY_FLOW_ENABLED=true ONLY after: audit published
  // + entity finalized + multisig treasury live + testnet purchase verified.
  // Defaults to false when the env var is unset.
  BUY_FLOW_ENABLED: process.env.NEXT_PUBLIC_BUY_FLOW_ENABLED === 'true',
  // Show the bonus campaign (set real end date when ready)
  BONUS_CAMPAIGN_ENABLED: false,
} as const;

// Active presale stage parameters — the single server-trusted source for
// price/limits/caps used by /api/purchase validation.
export const PURCHASE_PARAMS = {
  phaseCode: 'P1',
  stage: 1,
  priceUsd: 0.006,
  stageAllocationQtx: 17_000_000,
  minUsd: 50,
  maxUsdPerWallet: 25_000,
} as const;

export const SITE = {
  name: 'Qryptix',
  ticker: 'QTX',
  tagline: 'A practical multi-utility token on Base.',
  description:
    'QTX is an ERC-20 token on Base with a hardware-backed rewards layer, fixed 1B supply, and transparent on-chain vesting. Built and operated by a single doxxed founder.',
  domain: 'qryptix.io',
  email: 'dennis@qryptix.io',
  // TODO: replace with real verified contract address
  contractAddress: '0x0000000000000000000000000000000000000000',
  basescanUrl: 'https://basescan.org/token/0x0000000000000000000000000000000000000000',
  network: 'Base · L2',
  chainId: 8453,
  totalSupply: '1,000,000,000',
  lpLock: '12 months',
  tgeTarget: 'Q1 2027',
} as const;

export const SOCIALS = {
  twitter: '#', // TODO
  telegram: '#', // TODO
  discord: '#', // TODO
  github: 'https://github.com/Or4ng3frog',
  linkedin: 'https://www.linkedin.com/in/dennis-klahn-63022a204/',
} as const;

export const FOUNDER = {
  name: 'Dennis Klahn',
  role: 'Founder & sole operator',
  location: 'Bremen, Germany',
  // TODO: replace with real photo path in /public
  photo: '/founder.jpg',
  initials: 'DK',
  bio: `Independent developer and entrepreneur with 10+ years across e-commerce, algorithmic trading, and content publishing. Builder of multiple production projects — a Next.js commerce platform, an MQL5 algorithmic trading system, and a financial content platform. Qryptix is operated as a solo project: no fake team, no inflated org chart. The face on this page is the person you can hold accountable.`,
} as const;

export type Phase = {
  id: string;
  price: number;
  allocation: string;
  raiseTarget: string;
  active: boolean;
};

export const PHASES: Phase[] = [
  { id: 'P1', price: 0.006, allocation: '~17M QTX', raiseTarget: '~$100k', active: true },
  { id: 'P2', price: 0.015, allocation: '~20M QTX', raiseTarget: '~$300k', active: false },
  { id: 'P3', price: 0.03, allocation: '~25M QTX', raiseTarget: '~$750k', active: false },
  { id: 'P4', price: 0.06, allocation: '~30M QTX', raiseTarget: '~$1.8M', active: false },
  { id: 'P5', price: 0.125, allocation: '~28M QTX', raiseTarget: '~$3.5M', active: false },
];

export const PHASE_PROGRESS = { reserved: 237, cap: 1000 };

export type Allocation = {
  name: string;
  pct: number;
  desc: string;
  color: string;
};

// Warm metallic ramp (premium dark luxe): bright gold → bronze → muted taupe
export const ALLOCATIONS: Allocation[] = [
  { name: 'Ecosystem · Miner Rewards', pct: 30, desc: 'Up to 48 months · degressive ~15% YoY · quarterly caps', color: '#F4D88A' },
  { name: 'Treasury / Grants', pct: 16, desc: '3-month cliff · 24-month linear · multisig-controlled', color: '#E3B341' },
  { name: 'Presale (P1–P5)', pct: 12, desc: '10% TGE · 90% linear over 8 months', color: '#D4A24A' },
  { name: 'Staking Rewards', pct: 12, desc: 'Up to 36 months · ~10% quarterly degressive', color: '#C28F3C' },
  { name: 'Liquidity & Market-Making', pct: 10, desc: 'Initial DEX liquidity · LP locked 12 months', color: '#A87B2E' },
  { name: 'Team', pct: 10, desc: '12-month cliff · 36-month linear vest', color: '#8A6A2B' },
  { name: 'Unallocated Reserve', pct: 6, desc: 'Multisig-controlled · future governance', color: '#6E5A2E' },
  { name: 'Advisors + Community', pct: 4, desc: 'Advisors: 6m cliff · Community: 25% TGE · 6m linear', color: '#51493A' },
];

export type Feature = {
  icon: string;
  title: string;
  desc: string;
};

export const WHY_FEATURES: Feature[] = [
  { icon: 'zap', title: 'Base L2 Speed', desc: "Built on Coinbase's Base. Sub-second confirmations, fees in fractions of a cent, full EVM compatibility." },
  { icon: 'cpu', title: 'Hardware-Backed', desc: 'QTX rewards tied to verified device contribution through the Qryptix Miner program — physical hardware, not just a token.' },
  { icon: 'gauge', title: 'Capped Emissions', desc: 'Degressive reward schedule with quarterly caps. Designed to prevent runaway inflation and protect long-term holders.' },
  { icon: 'lock', title: 'LP Locked 12 Months', desc: 'Initial liquidity locked for 12 months at TGE. Team tokens vest over 36 months with a 12-month cliff.' },
  { icon: 'shield', title: 'Multisig Treasury', desc: 'All treasury and ecosystem funds held in a 3-of-5 multisig post-launch. Quarterly transparency reports.' },
  { icon: 'boxes', title: 'EVM Compatible', desc: 'Standard ERC-20 on Base. Works with MetaMask, Coinbase Wallet, and the broader Ethereum ecosystem.' },
];

export type Miner = {
  tier: string;
  hashrate: string;
  power: string;
  price: string;
  glyph: string;
};

// DePIN / hardware layer — concept explainer. Framed as design intent (the
// miner program is pre-launch), NOT live network telemetry. Honest-marketing
// framing: targets/parameters only, never implied live earnings.
export const DEPIN = {
  intro:
    'QTX is backed by a decentralized physical infrastructure layer: independently-operated Qryptix miners contribute hashpower, and a share of emissions is routed on-chain to the people running the hardware. It is designed to tie token value to real, verifiable work — not promises.',
  pillars: [
    { icon: 'cpu', title: 'Distributed miners', desc: 'Permissionless hardware operated by supporters worldwide — no central farm.' },
    { icon: 'gauge', title: 'Verifiable work', desc: 'Contribution is measured on-chain; rewards follow proof, not trust.' },
    { icon: 'boxes', title: 'Rewards routed on-chain', desc: '30% of fixed supply earmarked for the ecosystem & miner rewards layer.' },
    { icon: 'shield', title: 'Capped & degressive', desc: 'Emissions taper ~15% YoY with quarterly caps — sustainable by design.' },
  ],
  // Real protocol parameters (fixed by design), labelled as such — not a live feed.
  params: [
    { label: 'Miner rewards', value: '30%', sub: 'of fixed supply' },
    { label: 'Emissions', value: '~15%', sub: 'YoY degressive' },
    { label: 'Network', value: 'Base', sub: 'Ethereum L2' },
    { label: 'Supply', value: '1B', sub: 'fixed · QTX' },
  ],
};

export const MINERS: Miner[] = [
  { tier: 'Nano', hashrate: '~100 MH/s', power: '~100 W', price: '$299', glyph: '◇' },
  { tier: 'Core', hashrate: '~250 MH/s', power: '~250 W', price: '$699', glyph: '◈' },
  { tier: 'Pro', hashrate: '~500 MH/s', power: '~600 W', price: '$1,299', glyph: '◆' },
  { tier: 'Ultra', hashrate: '~1500 MH/s', power: '~1500 W', price: '$2,499', glyph: '⬢' },
];

export type RoadmapItem = {
  period: string;
  status: 'done' | 'now' | 'planned';
  title: string;
  items: string[];
};

export const ROADMAP: RoadmapItem[] = [
  { period: 'Q3 2025', status: 'done', title: 'Token Contract Deployed on Base', items: ['ERC-20 contract live on Base mainnet (verified)', '1B total supply, fixed', 'Website v1 launched'] },
  { period: 'Q2 2026', status: 'now', title: 'Reservation Phase · Operating Entity', items: ['Pre-sale reservations open (Phase 1 at $0.006)', 'Operating entity setup in progress (Dubai · VARA-aligned)', 'Smart-contract audit in vendor selection', 'Whitepaper v1.3 published'] },
  { period: 'Q3–Q4 2026', status: 'planned', title: 'Audit · Multisig · Hardware Prototype', items: ['Independent smart-contract audit published', 'Treasury migrated to 3-of-5 multisig', 'Miner hardware prototype', 'Staking program testnet'] },
  { period: 'Q1 2027', status: 'planned', title: 'TGE & Initial DEX Listing', items: ['Token Generation Event — claim portal live', 'Initial DEX listing on Base · LP locked 12 months', '10% unlock at TGE, 90% vests over 8 months'] },
  { period: 'Early Q2 2027', status: 'planned', title: 'Hardware Batch #1', items: ['First miner batch ships — contingent on validation', 'Firmware OTA + device management portal', 'Post-launch optimization based on telemetry'] },
];

export type FaqItem = { q: string; a: string };

export const FAQS: FaqItem[] = [
  { q: 'Why a reservation instead of a real buy flow today?', a: "Because charging real money for unaudited contract access under an unfinished legal entity isn't responsible. The reservation locks in your Phase 1 price ($0.006) and your spot on the allocation list. When the audit is published and the operating entity is finalized, the buy flow goes live and you complete your purchase with USDC on Base. Reservations are non-binding until then." },
  { q: 'Who is behind Qryptix?', a: 'Dennis Klahn, independent developer based in Bremen, Germany. Solo founder, fully doxxed. LinkedIn and GitHub are linked in the Founder section. No fake team, no anonymous advisors. Operations move to a Dubai-based entity once setup is complete.' },
  { q: 'Is the smart contract audited?', a: 'Not yet. Audit vendor selection is underway. The buy flow will not be enabled until an independent audit (Coinsult, CertiK, Hacken, or equivalent) is completed and published. The report will be linked directly on this page.' },
  { q: 'What does the reservation actually do?', a: 'It records your email, wallet address, and intended purchase amount, and locks in the Phase 1 price. When the buy flow opens, your reserved spot is held for 72 hours. No payment is taken at reservation time.' },
  { q: 'When will tokens be claimable?', a: 'At TGE (planned Q1 2027). 10% of your allocation unlocks immediately; the remaining 90% vests linearly over 8 months through the claim portal. This applies to all presale phases.' },
  { q: 'What if the project fails or is delayed?', a: "Reservations are non-binding — if the project doesn't reach TGE for any reason, no payment has been taken from you. After the buy flow opens, the contract and treasury are multisig-controlled, but as with any crypto project, only allocate funds you can afford to lose." },
  { q: 'Why Dubai?', a: 'Dubai (via VARA — Virtual Assets Regulatory Authority) offers a clear regulatory framework well-suited to projects of this scale. The choice is operational — Qryptix itself remains a global, permissionless project once launched on Base.' },
  { q: 'Do I need to do KYC?', a: "Not for the reservation. KYC requirements at purchase time depend on jurisdiction and entity setup at launch. We'll publish exact requirements before the buy flow opens. You are responsible for complying with your local regulations." },
];

// ============================================================
//  PRE-SALE participation parameters
// ============================================================

export const PRESALE = {
  // Accepted payment currencies (Base network)
  currencies: ['USDC', 'USDT', 'ETH'] as const,
  // Per-wallet limits (USD-equivalent). null = no limit.
  minBuyUsd: 50,
  maxBuyUsd: 25000,
  // TODO: replace with real treasury wallet once entity + multisig live
  treasuryWallet: '0x0000000000000000000000000000000000000000',
  // The honest framing — never "investment"
  framing: 'Early Supporter / PreSale Participation',
} as const;

// Mandatory acknowledgement checkboxes before any purchase/reservation
export const PURCHASE_ACKS = [
  'I understand that Qryptix is an early-stage crypto project, that participation is speculative, and that no listing, liquidity, reward or value increase is guaranteed.',
  'I have read and accept the PreSale Terms, Refund Policy and Risk Disclosure.',
] as const;

// ============================================================
//  REFUND POLICY (display + dashboard logic)
// ============================================================

export const REFUND_ELIGIBLE = [
  'Qryptix is not launch-ready by the defined target date',
  'No viable token launch is carried out',
  'No functional claim / distribution system is provided',
  'The project is officially discontinued',
  'Legal or technical reasons prevent the launch',
] as const;

export const REFUND_NOT_ELIGIBLE = [
  'A buyer simply changes their mind',
  'The market price later falls',
  'The token does not rise after launch',
  'Exchange listings take longer than hoped',
  'Roadmap items are adjusted',
  'General market risks materialise',
] as const;

export const REFUND_RULES = [
  'Refunds are only possible up to Token Claim / TGE — not after tokens are distributed',
  'Network / gas fees are generally not refundable',
  'Refund currency matches the original payment currency where possible',
  'Refund requests are submitted and tracked through the Dashboard',
] as const;

// Refund request lifecycle (used by dashboard + DB)
export const REFUND_STATUSES = [
  'not_requested',
  'requested',
  'under_review',
  'approved',
  'rejected',
  'paid',
] as const;
export type RefundStatus = (typeof REFUND_STATUSES)[number];

// ============================================================
//  RISK DISCLOSURE bullets
// ============================================================

export const RISKS = [
  'Qryptix is an early crypto project',
  'Participation is speculative',
  'Total loss of funds is possible',
  'No guarantee of value increase',
  'No guarantee of exchange listing',
  'No guarantee of liquidity',
  'No guaranteed rewards',
  'The hardware / reward layer is planned but not guaranteed',
  'Regulatory restrictions may apply depending on your country',
  'You are solely responsible for determining whether you may participate',
] as const;

// ============================================================
//  COMMUNITY
// ============================================================

export const COMMUNITY = {
  intro: 'Community-first, with transparent updates. No hype, no inflated promises — just regular, honest progress reports from the founder.',
  channels: [
    { name: 'Telegram', desc: 'Announcements & early-supporter chat', icon: 'telegram', href: SOCIALS.telegram, cta: 'Join Telegram' },
    { name: 'Discord', desc: 'Deeper discussion, dev updates, Q&A', icon: 'discord', href: SOCIALS.discord, cta: 'Join Discord' },
  ],
} as const;

// ============================================================
//  PRE-SALE STAGES (for DB seeding + dashboard)
// ============================================================

export const PRESALE_STAGES = PHASES.map((p, i) => ({
  stage: i + 1,
  code: p.id,
  priceUsd: p.price,
  status: p.active ? 'active' : i < PHASES.findIndex((x) => x.active) ? 'closed' : 'upcoming',
}));
