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
    'QTX is a planned ERC-20 token on Base with a proposed hardware rewards layer, fixed 1B supply and a published vesting plan. Built by a solo founder.',
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

// True once the real contract address replaces the zero-address placeholder.
// Gates public Basescan links so we never link to a 0x000… token page.
export const CONTRACT_PUBLISHED = !SITE.contractAddress.startsWith('0x0000000000');

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
  { icon: 'cpu', title: 'Hardware Program', desc: 'QTX rewards are designed to track verified contributions from future Qryptix Miners. Hardware prototypes still require validation.' },
  { icon: 'gauge', title: 'Capped Emissions', desc: 'Degressive reward schedule with quarterly caps. Designed to prevent runaway inflation and protect long-term holders.' },
  { icon: 'lock', title: 'Planned LP Lock', desc: 'Initial liquidity is intended to be locked for 12 months at TGE. Team vesting is planned over 36 months after a 12-month cliff.' },
  { icon: 'shield', title: 'Planned Multisig', desc: 'A multisig treasury is required before purchases open. Quarterly transparency reports are planned.' },
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
    'The proposed Qryptix Miner network would use independent hardware and a planned on-chain rewards mechanism. The hardware and reward system are not operating yet; prototypes and reward rules need validation.',
  pillars: [
    { icon: 'cpu', title: 'Distributed miners', desc: 'Independent hardware operation is planned; no public fleet is running yet.' },
    { icon: 'gauge', title: 'Verifiable work', desc: 'On-chain contribution verification is part of the proposed design.' },
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
  { period: 'Q3 2025', status: 'done', title: 'Website v1 launched', items: ['Initial Qryptix website published'] },
  { period: 'Current work', status: 'now', title: 'Direct Purchase Preparation · Operating Entity', items: ['USDC direct purchase flow built, currently disabled', 'Operating entity and jurisdiction to be finalised', 'Audit and independent review still required', 'Whitepaper v1.3 published; updated release copy in review'] },
  { period: 'Through Q4 2026 · target', status: 'planned', title: 'Audit · Multisig · Hardware Prototype', items: ['Verified token contract address and independent audit report published', 'Treasury configured as multisig', 'Claim and vesting mechanism tested', 'Miner prototype validated before manufacturing commitments'] },
  { period: 'Q1 2027 · target', status: 'planned', title: 'TGE & Initial DEX Listing', items: ['Only after audit, entity, treasury and claim readiness', 'TGE and claim portal launch', 'Initial DEX listing on Base · planned LP lock of 12 months', 'Planned vesting: 10% at TGE, 90% over 8 months'] },
  { period: 'Early Q2 2027 · estimate', status: 'planned', title: 'Hardware Batch #1', items: ['Shipping depends on validated prototype, production and required approvals', 'Firmware, device management and support ready before dispatch'] },
];

export const ROADMAP_NOTE = 'Q1 2027 for TGE and early Q2 2027 for hardware are targets, not confirmed dates. Both depend on the preceding audit, legal, technical and manufacturing milestones; they may move.';

export type FaqItem = { q: string; a: string };

export const FAQS: FaqItem[] = [
  { q: 'Can I buy QTX today?', a: 'Not yet. Qryptix will use direct purchases with USDC on Base. The purchase flow remains disabled until the audit, operating entity, treasury and legal requirements are complete. No payment or allocation is accepted before then.' },
  { q: 'Who is behind Qryptix?', a: 'Dennis Klahn, independent developer based in Bremen, Germany. Solo founder, fully doxxed. LinkedIn and GitHub are linked in the Founder section. No fake team, no anonymous advisors. Operations move to a Dubai-based entity once setup is complete.' },
  { q: 'Is the smart contract audited?', a: 'No independent audit report is linked here. Purchases will remain disabled until an independent audit has been completed, findings addressed and the report published.' },
  { q: 'How will I buy QTX?', a: 'When purchases open, connect a self-custody wallet on Base, enter your USDC amount, review the terms and approve the transfer. The server checks the confirmed on-chain payment before recording QTX in your dashboard. Claim begins at TGE.' },
  { q: 'When will tokens be claimable?', a: 'The current target for TGE is Q1 2027, conditional on the audit, legal setup and claim contract. The planned schedule is 10% at TGE and 90% vesting linearly over 8 months. Final claim terms and dates must be confirmed before purchases open.' },
  { q: 'What if the project fails or is delayed?', a: 'No payment is accepted while the sale is closed. Once purchases open, refund eligibility is governed by the published Refund Policy. QTX is speculative and could lose all value.' },
  { q: 'Why Dubai?', a: 'Dubai (via VARA — Virtual Assets Regulatory Authority) offers a clear regulatory framework well-suited to projects of this scale. The choice is operational — Qryptix itself remains a global, permissionless project once launched on Base.' },
  { q: 'Do I need to do KYC?', a: "KYC requirements at purchase time depend on jurisdiction and entity setup. We'll publish exact requirements before purchases open. You are responsible for complying with your local regulations." },
];

// ============================================================
//  PRE-SALE participation parameters
// ============================================================

export const PRESALE = {
  // Accepted payment currencies (Base network)
  currencies: ['USDC'] as const,
  // Per-wallet limits (USD-equivalent). null = no limit.
  minBuyUsd: 50,
  maxBuyUsd: 25000,
  // TODO: replace with real treasury wallet once entity + multisig live
  treasuryWallet: '0x0000000000000000000000000000000000000000',
  // The honest framing — never "investment"
  framing: 'Early Supporter / PreSale Participation',
} as const;

// Mandatory acknowledgement checkboxes before any purchase
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
