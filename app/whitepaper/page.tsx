import type { Metadata } from 'next';
import { WhitepaperSidebar } from '@/components/WhitepaperSidebar';
import { Logo } from '@/components/Logo';
import { SITE, ROADMAP, ROADMAP_NOTE } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Qryptix Whitepaper — Draft Revision',
  description: 'The full technical and economic specification for Qryptix (QTX): tokenomics, vesting, architecture, miner program, security, and risk disclosure.',
};

// ---- Prose helpers ----
function H2({ id, num, children }: { id: string; num: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-serif font-semibold text-3xl mt-16 mb-4 scroll-mt-24">
      <span className="font-mono text-xl text-taupe mr-4">{num}</span>
      {children}
    </h2>
  );
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="font-serif font-medium text-xl text-ivory mt-9 mb-3">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-ash leading-relaxed mb-4 text-[15.5px]">{children}</p>;
}
function Lead({ children }: { children: React.ReactNode }) {
  return <p className="text-lg text-ivory leading-relaxed mb-6 pl-5 border-l-2 border-gold">{children}</p>;
}
function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2 mb-4 pl-1">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2.5 text-ash text-[15.5px]">
          <span className="text-gold mt-1">→</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
function Callout({ variant = 'info', label, children }: { variant?: 'info' | 'warn' | 'danger'; label: string; children: React.ReactNode }) {
  const styles = {
    info: 'border-l-gold [&_.lbl]:text-gold',
    warn: 'border-l-amber-400 [&_.lbl]:text-amber-400',
    danger: 'border-l-red-400 [&_.lbl]:text-red-400',
  }[variant];
  return (
    <div className={`glass-luxe rounded-xl border-l-2 p-5 my-5 ${styles}`}>
      <div className="lbl text-[11px] uppercase tracking-[0.12em] font-semibold mb-2">{label}</div>
      <div className="text-sm text-ash leading-relaxed space-y-2">{children}</div>
    </div>
  );
}
function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="my-6 rounded-xl border border-gold/10 overflow-hidden glass-luxe">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-onyx/60">
            {head.map((h) => (
              <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-ivory font-semibold border-b border-gold/10">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-gold/[0.06] last:border-0 hover:bg-gold/[0.03]">
              {r.map((c, j) => (
                <td key={j} className={`px-4 py-3 ${j === 0 ? 'text-ivory font-medium' : 'text-ash'}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const Mono = ({ children }: { children: React.ReactNode }) => (
  <span className="font-mono text-gold-bright">{children}</span>
);

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-obsidian/90 backdrop-blur-xl border-b border-gold/10">
        <div className="mx-auto max-w-[1280px] px-8 py-3.5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <Logo variant="full" size={30} />
            <span className="text-xs text-taupe ml-2 pl-3 border-l border-gold/15 hidden sm:inline">
              Whitepaper draft revision
            </span>
          </a>
          <a href="/" className="text-sm text-ash hover:text-ivory transition-colors">
            ← Back to home
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-8 grid lg:grid-cols-[260px_1fr] gap-16">
        <WhitepaperSidebar />

        <main className="py-12 pb-32 max-w-3xl">
          {/* Title */}
          <div className="mb-16 pb-12 border-b border-gold/10">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">
              Qryptix · Technical & Economic Specification
            </div>
            <h1 className="font-serif font-semibold text-5xl mb-4 leading-tight">Qryptix Whitepaper</h1>
            <p className="text-xl text-ash leading-relaxed mb-7">
              A proposed multi-utility token on Base (Ethereum L2), with a planned hardware rewards layer and
              transparent emission design. This draft distinguishes current progress from planned mechanisms.
            </p>
            <p className="text-xs text-taupe mb-5">Draft content review · September 2026 · based on Whitepaper v1.3 (May 2026). Formal version and legal review pending.</p>
            <div className="flex flex-wrap gap-2">
              {['ERC-20 design', 'Base · chain 8453', '1B planned supply', '12m LP lock planned', 'TGE Q1 2027 target'].map((t) => (
                <span key={t} className="rounded-full glass-luxe px-3 py-1.5 text-xs font-mono text-ash">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* 01 Summary */}
          <H2 id="summary" num="01">Executive summary</H2>
          <Lead>
            Qryptix (QTX) is a planned ERC-20 token on Base, Coinbase&apos;s Ethereum Layer-2 network. A verified
            public contract address has not yet been published. It is designed for trading, payments, hardware-backed mining rewards, and staking —
            built around a planned fixed supply of 1,000,000,000 QTX, a proposed on-chain vesting design, and a transparent
            five-phase pre-sale.
          </Lead>
          <P>
            The project is operated by a solo founder; the final operating entity and jurisdiction have not been
            published. QTX is planned to be sold by direct purchase with USDC on Base. The purchase flow
            will only be enabled after an independent smart-contract audit is published and the operating entity is finalised.
            The first hardware miner batch is planned to ship in early Q2 2027, contingent on prototype validation
            with selected manufacturers.
          </P>
          <P>
            This whitepaper exists to give prospective participants enough information to make their own informed
            decision. It does not exist to convince anyone to buy QTX. If something here is unclear or appears
            inconsistent with the on-chain contract, please raise it directly — the founder responds personally at{' '}
            <Mono>{SITE.email}</Mono>.
          </P>
          <Callout label="Quick facts">
            <p><strong className="text-ivory">Planned supply:</strong> 1,000,000,000 QTX, with no mint function after deployment; contract not yet published.</p>
            <p><strong className="text-ivory">Network:</strong> Base mainnet (chain ID 8453). Compatible with all EVM tooling.</p>
            <p><strong className="text-ivory">Proposed vesting:</strong> 10% at TGE, 90% linear over 8 months for presale buyers. Team: 12-month cliff + 36-month linear release.</p>
            <p><strong className="text-ivory">LP lock:</strong> Initial DEX liquidity is planned to be locked for 12 months at launch.</p>
            <p><strong className="text-ivory">Presale:</strong> 5 phases · $0.006 → $0.015 → $0.030 → $0.060 → $0.125 per QTX.</p>
          </Callout>

          {/* 02 Problem */}
          <H2 id="problem" num="02">Problem & motivation</H2>
          <P>
            Most token projects fall into one of two categories: pure-financial speculative assets with no
            functional utility beyond price movement, or utility tokens whose claimed use cases never materialise
            into actual on-chain activity. Both leave holders with assets whose value is decoupled from anything
            tangible.
          </P>
          <P>
            A second pattern problem is the prevalence of presales that combine high-pressure marketing (fake
            countdowns, fabricated &quot;audit in progress&quot; badges, anonymous teams, exchange listing pipelines
            that are not actual partnerships) with smart contracts that have not been audited and operating
            entities that do not exist. The result is an opaque environment in which legitimate projects are
            difficult to distinguish from extractive ones.
          </P>
          <P>
            Qryptix is designed against both patterns. The proposed token utility includes rewards for verified
            hardware contribution and stakers, contingent on implementation. The project structure aims to be verifiable: doxxed
            founder, planned on-chain tokenomics, and a direct purchase flow gated until audit and entity are in place.
          </P>

          {/* 03 Solution */}
          <H2 id="solution" num="03">The Qryptix approach</H2>
          <P>The design rests on three principles, each chosen because it is verifiable rather than aspirational.</P>
          <H3>3.1 Verifiable on-chain mechanics</H3>
          <P>
            The intended contract design covers total supply, vesting, liquidity lock duration and emission caps.
            These rules are not yet documented here as deployed and audited. Before purchases open, verified
            contract addresses and the audit report must be published so participants can check the implementation.
          </P>
          <H3>3.2 Hardware-backed utility</H3>
          <P>
            The proposed 30% ecosystem allocation is intended for rewards from verified hardware contributions.
            Hardware, verification and emission controls are still to be implemented and validated. The proposed
            reward schedule runs for up to 48 months with decreasing emissions.
          </P>
          <P>
            The hardware program is a proposed product. Manufacturer engagement is at
            a concept stage in this document; no preorders are accepted here, and published specifications are explicitly
            indicative until validated against working prototypes.
          </P>
          <H3>3.3 Transparency over momentum</H3>
          <P>
            Where most presales optimise for fast capital intake, Qryptix is structured to optimise for participant
            safety. No payment is taken before the purchase flow opens, and activation is
            gated behind a public list of preconditions (Section 7.2). This is slower than aggressive marketing
            playbooks — and it is the right default given the regulatory and reputational environment for token
            launches in 2026.
          </P>

          {/* 04 Architecture */}
          <H2 id="architecture" num="04">Technical architecture</H2>
          <H3>4.1 Contract design</H3>
          <P>QTX is designed as an ERC-20 on Base, with the following proposed mechanisms:</P>
          <UL items={[
            <><strong className="text-ivory">Vesting registry:</strong> on-chain allocations with cliff and linear-release parameters per category.</>,
            <><strong className="text-ivory">Claim portal:</strong> lets presale participants claim vested tokens after TGE.</>,
            <><strong className="text-ivory">Multisig ownership:</strong> critical functions controlled by a 3-of-5 multisig post-launch.</>,
            <><strong className="text-ivory">LP lock:</strong> 12-month timelock on initial DEX liquidity via an established third-party locker.</>,
          ]} />
          <pre className="rounded-xl glass-luxe border border-gold/10 p-5 my-5 overflow-x-auto font-mono text-[13px] text-ash leading-relaxed">
{`// Simplified — QTX inherits OpenZeppelin's ERC-20
contract QryptixToken is ERC20, Ownable {
    uint256 public constant TOTAL_SUPPLY =
        1_000_000_000 * 10**18;
    address public vestingRegistry;
    address public claimPortal;

    // No mint function — supply fixed at deployment
    // Burn permitted at holder discretion
}`}
          </pre>
          <Callout variant="warn" label="Important">
            <p>The contract address and verified source code will be linked here once confirmed. No QTX contract interaction is offered through this site today.</p>
          </Callout>
          <H3>4.2 Why Base</H3>
          <P>
            Base was selected for four reasons: it inherits Ethereum security via optimistic rollup architecture;
            transaction fees are typically below $0.01, making reward distributions viable; Coinbase ecosystem
            integration provides on-ramp infrastructure for non-crypto-native users; and EVM compatibility means
            standard tooling works without modification.
          </P>
          <H3>4.3 Off-chain components</H3>
          <P>
            A Next.js dApp for presale and claim interfaces; a Postgres database for verified purchase
            records; planned event indexers reading from Base for state synchronisation; and the manufacturer-side firmware
            stack for miners (specified separately).
          </P>

          {/* 05 Tokenomics */}
          <H2 id="tokenomics" num="05">Tokenomics</H2>
          <P>The proposed supply of 1,000,000,000 QTX is allocated across nine categories, each paired with a proposed vesting schedule (Section 6).</P>
          <Table
            head={['Allocation', 'Share']}
            rows={[
              ['Ecosystem / Miner Rewards', <Mono key="a">30%</Mono>],
              ['Treasury / Grants', <Mono key="b">16%</Mono>],
              ['Presale (P1–P5)', <Mono key="c">12%</Mono>],
              ['Staking Rewards', <Mono key="d">12%</Mono>],
              ['Liquidity & Market-Making', <Mono key="e">10%</Mono>],
              ['Team', <Mono key="f">10%</Mono>],
              ['Unallocated Reserve', <Mono key="g">6%</Mono>],
              ['Advisors', <Mono key="h">2%</Mono>],
              ['Community / Airdrop', <Mono key="i">2%</Mono>],
            ]}
          />
          <H3>5.1 Allocation rationale</H3>
          <P>
            The 30% Ecosystem allocation is intentionally large because hardware-backed utility is the project&apos;s
            primary differentiator. Distributing it over up to 48 months under a degressive schedule keeps
            emissions meaningful for early operators while preventing supply shocks. Treasury (16%) funds multi-year
            operations without forcing premature token sales. The 12% presale allocation is deliberately
            conservative; many comparable projects allocate 20–30%, creating significant post-TGE sell pressure.
          </P>

          {/* 06 Vesting */}
          <H2 id="vesting" num="06">Vesting & emissions</H2>
          <P>The schedules below are proposed. An audited on-chain vesting and claim mechanism is still required before these can be described as enforceable.</P>
          <Table
            head={['Allocation', 'Share', 'Cliff', 'Vesting', 'TGE']}
            rows={[
              ['Ecosystem', <Mono key="1">30%</Mono>, 'None', 'Up to 48m degressive', '0%'],
              ['Treasury', <Mono key="2">16%</Mono>, '3 months', '24m linear', '0%'],
              ['Presale', <Mono key="3">12%</Mono>, 'None', '8m linear', '10%'],
              ['Staking', <Mono key="4">12%</Mono>, 'None', 'Up to 36m degressive', '0%'],
              ['Liquidity', <Mono key="5">10%</Mono>, 'None', 'Locked 12m', '100% (locked)'],
              ['Team', <Mono key="6">10%</Mono>, '12 months', '36m linear', '0%'],
              ['Reserve', <Mono key="7">6%</Mono>, 'Governance', '—', '0%'],
              ['Advisors', <Mono key="8">2%</Mono>, '6 months', '12m linear', '0%'],
              ['Community', <Mono key="9">2%</Mono>, 'None', '6m linear', '25%'],
            ]}
          />
          <H3>6.1 Circulating supply projection</H3>
          <P>Under the proposed schedule, at most ~17M QTX would be unlocked at TGE if the full 120M presale allocation and 20M community allocation were assigned: 10% of presale plus 25% of community. This excludes the proposed 100M locked liquidity allocation. Actual circulating supply depends on how much is allocated and on the final contracts; later projections are not available.</P>
          <Table
            head={['From TGE', 'Circulating', '% of total']}
            rows={[
              ['TGE', <Mono key="a">~17M</Mono>, '~1.7%'],
            ]}
          />
          <H3>6.2 Degressive emission curve</H3>
          <P>
            The proposed Ecosystem allocation would follow a degressive schedule, rewarding early miner operators more heavily and
            reducing emissions ~15% year-on-year, with quarterly caps to prevent gaming via short-term hash bursts.
          </P>

          {/* 07 Presale */}
          <H2 id="presale" num="07">Pre-sale structure</H2>
          <P>Five sequential phases are planned. The current purchase implementation supports only Stage 1; later stages require an additional verified release. No allocation is accepted while purchases are disabled.</P>
          <Table
            head={['Phase', 'Price', 'Allocation', 'Raise target']}
            rows={[
              ['P1', <Mono key="1">$0.006</Mono>, '~17M', '~$100k'],
              ['P2', <Mono key="2">$0.015</Mono>, '~20M', '~$300k'],
              ['P3', <Mono key="3">$0.030</Mono>, '~25M', '~$750k'],
              ['P4', <Mono key="4">$0.060</Mono>, '~30M', '~$1.8M'],
              ['P5', <Mono key="5">$0.125</Mono>, '~28M', '~$3.5M'],
            ]}
          />
          <H3>7.1 Sale status</H3>
          <P>The direct purchase flow is currently disabled. No payments or allocations are accepted while the sale is closed. The displayed Stage 1 price is planned and does not lock in an allocation.</P>
          <H3>7.2 Purchase preconditions</H3>
          <P>The buy flow activates only when <strong className="text-ivory">all</strong> of the following are met:</P>
          <UL items={[
            'Smart-contract audit completed by a recognised provider and published.',
            'Operating entity established with a published address.',
            'Treasury & ecosystem wallets migrated to a 3-of-5 multisig.',
            'Updated whitepaper published reflecting audit findings.',
          ]} />
          <H3>7.3 Purchase mechanics (when active)</H3>
          <P>When the sale opens, participants pay USDC on Base from a self-custody wallet. The server verifies the on-chain transfer and records the purchase at the applicable stage price. No priority window or reservation is offered.</P>
          <H3>7.4 Claim at TGE</H3>
          <P>No tokens are delivered immediately. The current TGE target is Q1 2027, subject to audit, legal and claim readiness. The planned unlock is 10% at TGE, with the remaining 90% vesting linearly over 8 months; final terms must be confirmed before purchases open.</P>

          {/* 08 Miners */}
          <H2 id="miners" num="08">Hardware miner program</H2>
          <P>The proposed mechanism for distributing the 30% Ecosystem allocation would reward operators of physical hardware for verified contributions if the program is implemented.</P>
          <Callout variant="warn" label="Current documentation status">
            <p>Miner renders and specifications are <strong className="text-ivory">concepts</strong>; prototype validation and production commitments are not documented here. No units are available for purchase and no preorders are accepted.</p>
          </Callout>
          <H3>8.1 Device tiers (indicative)</H3>
          <Table
            head={['Tier', 'Hashrate', 'Power', 'Indicative price']}
            rows={[
              ['Nano', '~100 MH/s', '~100 W', <Mono key="1">$299</Mono>],
              ['Core', '~250 MH/s', '~250 W', <Mono key="2">$699</Mono>],
              ['Pro', '~500 MH/s', '~600 W', <Mono key="3">$1,299</Mono>],
              ['Ultra', '~1500 MH/s', '~1500 W', <Mono key="4">$2,499</Mono>],
            ]}
          />
          <H3>8.2 Reward distribution</H3>
          <P>The proposed model would distribute rewards pro-rata to verified contribution per emission window, subject to individual operator caps. Verification and cap rules are not yet implemented or published.</P>
          <H3>8.3 Manufacturing & delivery</H3>
          <P>The first batch is estimated for early Q2 2027, conditional on prototype validation, production planning and required approvals. This document does not establish a confirmed shipping date.</P>

          {/* 09 Staking */}
          <H2 id="staking" num="09">Staking design</H2>
          <P>The proposed 12% staking allocation would reward fixed-term locks, with longer locks receiving higher reward weights. This functionality has not launched.</P>
          <H3>9.1 Lock tiers</H3>
          <P>Proposed tiers: 30 days (1.0×), 90 days (1.5×), 180 days (2.5×). Early unstaking would forfeit accumulated rewards; principal withdrawal mechanics must be confirmed in the audited contract.</P>
          <H3>9.2 Emission schedule</H3>
          <P>Degressive, ~10% quarterly decay — rewarding early stakers more heavily and tapering as staked supply grows.</P>
          <H3>9.3 Anti-gaming</H3>
          <P>Per-address weight is capped. Distribution accounts for stake duration as well as size, so a small long-term staker isn&apos;t heavily outweighed by a large short-term one.</P>

          {/* 10 Governance */}
          <H2 id="governance" num="10">Governance & treasury</H2>
          <H3>10.1 Multisig structure</H3>
          <P>A 3-of-5 multisig for treasury and ecosystem operations is planned before the sale opens. The proposed signer roles are founder, technical advisor, legal/compliance advisor, community representative and rotating signer; the final signers and addresses have not been published here.</P>
          <H3>10.2 Treasury operations</H3>
          <P>The proposed 16% Treasury would fund development and audits, legal and compliance, infrastructure, ecosystem grants, and a contingency reserve. Quarterly transparency reports are planned.</P>
          <H3>10.3 Future governance</H3>
          <P>Token-weighted governance is proposed after launch. The intended design excludes changes to core economic parameters such as total supply, cliff durations and the LP lock; these limits require confirmation in the deployed contracts.</P>

          {/* 11 Security */}
          <H2 id="security" num="11">Security & audits</H2>
          <H3>11.1 Audit status</H3>
          <P>No independent audit report is linked in this document. The buy flow remains disabled until the relevant contracts have been audited, findings addressed and the report published.</P>
          <Callout variant="warn" label="Why this matters">
            <p>Many presales advertise &quot;audit in progress&quot; with vendor logos without an active engagement. We do not list vendor logos until an audit is actively underway with a signed engagement.</p>
          </Callout>
          <H3>11.2 Audit scope</H3>
          <P>Token contract, vesting registry, claim portal, and staking/miner-reward modules. The report will include severity-classified findings, the team&apos;s response, and verification of fixes.</P>
          <H3>11.3 Bug bounty</H3>
          <P>A bug bounty covering critical and high-severity findings in deployed contracts is planned from TGE, subject to a published program.</P>
          <H3>11.4 Operational security</H3>
          <P>The intended controls include hardware-secured signing devices, independent hardware wallets for multisig signers, no cloud-hosted private keys and cold-signed deployment transactions. These controls must be verified before launch.</P>

          {/* 12 Legal */}
          <H2 id="legal" num="12">Legal & compliance</H2>
          <H3>12.1 Operating entity</H3>
          <P>The final operating entity and jurisdiction have not been published. These details and the applicable participation terms must be confirmed before purchases open.</P>
          <H3>12.2 Jurisdictional restrictions</H3>
          <P>Eligibility and compliance requirements depend on the participant&apos;s jurisdiction and the final structure of the offer. Applicable restrictions and verification requirements must be published and implemented before purchases open.</P>
          <H3>12.3 No financial advice</H3>
          <P>Nothing here constitutes financial, investment, legal, tax, or accounting advice. Consult qualified professional advisors before any decision regarding QTX.</P>
          <H3>12.4 KYC / AML</H3>
          <P>KYC at purchase time depends on the final entity&apos;s obligations and purchase size, and will be published before the buy flow opens.</P>

          {/* 13 Risk */}
          <H2 id="risk" num="13">Risk factors</H2>
          <P>Participation carries substantial risk. This list is not exhaustive.</P>
          <H3>13.1 Total loss risk</H3>
          <P>QTX may lose all value. No guaranteed floor, no buyback obligation, no claim on the entity&apos;s assets. Only allocate funds you can afford to lose entirely.</P>
          <H3>13.2 Technical risk</H3>
          <P>Despite audit and best-effort security, contracts may contain undiscovered vulnerabilities. Base itself depends on Ethereum security and the rollup sequencer; failure at either layer could affect operations.</P>
          <H3>13.3 Regulatory risk</H3>
          <P>The regulatory environment is evolving rapidly. Future action could materially affect Qryptix&apos;s ability to operate, list, or distribute rewards.</P>
          <H3>13.4 Execution risk</H3>
          <P>The project is operated by a single founder. Founder unavailability could materially delay or prevent execution. Planned multisig and treasury structures may provide some continuity once established, but execution remains concentrated.</P>
          <H3>13.5 Hardware program risk</H3>
          <P>Miner development depends on manufacturer engagement, prototype validation, and supply-chain conditions. The program may be delayed, scaled down, or cancelled. Any alternative use of the Ecosystem allocation would require a published decision process and applicable terms.</P>
          <H3>13.6 Market risk</H3>
          <P>Post-TGE price would be market-determined. An initial liquidity lock is planned, but secondary trading may be thin or volatile. No price support is promised.</P>

          {/* 14 Roadmap */}
          <H2 id="roadmap" num="14">Roadmap</H2>
          <P>{ROADMAP_NOTE}</P>
          <Table
            head={['Period', 'Status', 'Milestone']}
            rows={ROADMAP.map((item) => [item.period, item.status === 'now' ? 'Active' : item.status === 'done' ? 'Done' : 'Planned', `${item.title}: ${item.items.join('; ')}`])}
          />

          {/* 15 Disclaimers */}
          <H2 id="disclaimers" num="15">Disclaimers</H2>
          <Callout variant="danger" label="Final disclaimer">
            <p>This draft describes proposed mechanics and risks. Purchases are disabled; final terms, eligibility and verified contracts must be published before any sale opens. QTX would be a speculative digital asset. Nothing here constitutes financial, investment, legal, tax or accounting advice. Information may change as the project develops.</p>
            <p>Participation may be restricted depending on your jurisdiction. Read the final purchase terms and risk disclosure before participating if the sale opens, and seek professional advice where appropriate. The legal pages on this site are drafts pending review.</p>
          </Callout>

          {/* Bottom nav */}
          <div className="mt-20 pt-8 border-t border-gold/10 flex gap-4">
            <a href="/" className="flex-1 rounded-2xl glass-luxe p-6 transition-all hover:border-gold/30">
              <div className="text-[11px] uppercase tracking-wider text-taupe mb-1.5">← Back to</div>
              <div className="font-serif font-medium text-ivory">Qryptix Home</div>
            </a>
            <a href={`mailto:${SITE.email}`} className="flex-1 rounded-2xl glass-luxe p-6 transition-all hover:border-gold/30">
              <div className="text-[11px] uppercase tracking-wider text-taupe mb-1.5">Questions?</div>
              <div className="font-serif font-medium text-ivory">{SITE.email}</div>
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
