import type { Metadata } from 'next';
import { WhitepaperSidebar } from '@/components/WhitepaperSidebar';
import { SITE } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Qryptix Whitepaper v1.3 — Technical & Economic Specification',
  description: 'The full technical and economic specification for Qryptix (QTX): tokenomics, vesting, architecture, miner program, security, and risk disclosure.',
};

// ---- Prose helpers ----
function H2({ id, num, children }: { id: string; num: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-display font-semibold text-3xl mt-16 mb-4 scroll-mt-24">
      <span className="font-mono text-xl text-fog mr-4">{num}</span>
      {children}
    </h2>
  );
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display font-medium text-xl text-ghost mt-9 mb-3">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-mist leading-relaxed mb-4 text-[15.5px]">{children}</p>;
}
function Lead({ children }: { children: React.ReactNode }) {
  return <p className="text-lg text-ghost leading-relaxed mb-6 pl-5 border-l-2 border-violet">{children}</p>;
}
function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2 mb-4 pl-1">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2.5 text-mist text-[15.5px]">
          <span className="text-gradient mt-1">→</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
function Callout({ variant = 'info', label, children }: { variant?: 'info' | 'warn' | 'danger'; label: string; children: React.ReactNode }) {
  const styles = {
    info: 'border-l-violet [&_.lbl]:text-violet-bright',
    warn: 'border-l-amber-400 [&_.lbl]:text-amber-400',
    danger: 'border-l-red-400 [&_.lbl]:text-red-400',
  }[variant];
  return (
    <div className={`glass rounded-xl border-l-2 p-5 my-5 ${styles}`}>
      <div className="lbl text-[11px] uppercase tracking-[0.12em] font-semibold mb-2">{label}</div>
      <div className="text-sm text-mist leading-relaxed space-y-2">{children}</div>
    </div>
  );
}
function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="my-6 rounded-xl border border-violet/10 overflow-hidden glass">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-abyss/60">
            {head.map((h) => (
              <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-ghost font-semibold border-b border-violet/10">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-violet/[0.06] last:border-0 hover:bg-violet/[0.03]">
              {r.map((c, j) => (
                <td key={j} className={`px-4 py-3 ${j === 0 ? 'text-ghost font-medium' : 'text-mist'}`}>
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
  <span className="font-mono text-cyan-bright">{children}</span>
);

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-void/90 backdrop-blur-xl border-b border-violet/10">
        <div className="mx-auto max-w-[1280px] px-8 py-3.5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/Q_Only.png" alt="Qryptix" className="h-8 w-8" />
            <span className="font-display font-semibold">QRYPTIX</span>
            <span className="text-xs text-fog ml-2 pl-3 border-l border-violet/15 hidden sm:inline">
              Whitepaper v1.3
            </span>
          </a>
          <a href="/" className="text-sm text-mist hover:text-ghost transition-colors">
            ← Back to home
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-8 grid lg:grid-cols-[260px_1fr] gap-16">
        <WhitepaperSidebar />

        <main className="py-12 pb-32 max-w-3xl">
          {/* Title */}
          <div className="mb-16 pb-12 border-b border-violet/10">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gradient mb-4">
              Qryptix · Technical & Economic Specification
            </div>
            <h1 className="font-display font-semibold text-5xl mb-4 leading-tight">Qryptix Whitepaper v1.3</h1>
            <p className="text-xl text-mist leading-relaxed mb-7">
              A practical multi-utility token on Base (Ethereum L2), with a hardware-backed rewards layer and
              transparent emissions. This document describes what QTX is, how it works, and what it is not.
            </p>
            <div className="flex flex-wrap gap-2">
              {['ERC-20', 'Base · chain 8453', '1B total supply', 'LP locked 12m', 'TGE Q1 2027'].map((t) => (
                <span key={t} className="rounded-full glass px-3 py-1.5 text-xs font-mono text-mist">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* 01 Summary */}
          <H2 id="summary" num="01">Executive summary</H2>
          <Lead>
            Qryptix (QTX) is an ERC-20 token deployed on Base, Coinbase&apos;s Ethereum Layer-2 network. It is
            designed as a multi-utility token for trading, payments, hardware-backed mining rewards, and staking —
            built around a fixed supply of 1,000,000,000 QTX, on-chain enforced vesting, and a transparent
            five-phase pre-sale.
          </Lead>
          <P>
            The project is operated as a solo founder endeavour, with the operating entity in setup (Dubai,
            VARA-aligned jurisdiction). Pre-sale reservations are open today; actual token purchases will only be
            enabled after an independent smart-contract audit is published and the operating entity is finalised.
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
            <p><strong className="text-ghost">Total supply:</strong> 1,000,000,000 QTX (fixed, no mint function after deployment).</p>
            <p><strong className="text-ghost">Network:</strong> Base mainnet (chain ID 8453). Compatible with all EVM tooling.</p>
            <p><strong className="text-ghost">Vesting:</strong> 10% at TGE, 90% linear over 8 months for presale buyers. Team locked 12 months + 36-month linear.</p>
            <p><strong className="text-ghost">LP lock:</strong> Initial DEX liquidity locked for 12 months at launch.</p>
            <p><strong className="text-ghost">Presale:</strong> 5 phases · $0.006 → $0.015 → $0.030 → $0.060 → $0.125 per QTX.</p>
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
            Qryptix is designed against both patterns. The token has a defined utility floor — it rewards verified
            hardware contribution and stakers — and the project structure is built to be verifiable: doxxed
            founder, on-chain enforced tokenomics, reservation-based presale with no funds taken until audit and
            entity are in place.
          </P>

          {/* 03 Solution */}
          <H2 id="solution" num="03">The Qryptix approach</H2>
          <P>The design rests on three principles, each chosen because it is verifiable rather than aspirational.</P>
          <H3>3.1 Verifiable on-chain mechanics</H3>
          <P>
            Every economic parameter that matters — total supply, vesting schedule, LP lock duration, emission caps
            — is enforced by the smart contract on Base, not by a Medium post or a Discord announcement. Once
            deployed and verified on Basescan, the rules cannot be changed retroactively without on-chain
            governance.
          </P>
          <H3>3.2 Hardware-backed utility</H3>
          <P>
            The largest single allocation (30% of supply) is dedicated to rewards for verified hardware
            contribution through the Qryptix Miner program. This creates a structural reason for QTX to exist
            beyond speculation: hardware operators earn QTX, demand is partially driven by exposure to that reward
            stream, and supply is metered out over up to 48 months under a degressive emission schedule.
          </P>
          <P>
            The hardware program is treated as a real product, not a marketing prop. Manufacturer engagement is in
            progress as of Q2 2026; no preorders are accepted today, and published specifications are explicitly
            indicative until validated against working prototypes.
          </P>
          <H3>3.3 Transparency over momentum</H3>
          <P>
            Where most presales optimise for fast capital intake, Qryptix is structured to optimise for participant
            safety. Reservations are non-binding, no payment is taken before audit completion, and the buy flow is
            gated behind a public list of preconditions (Section 11). This is slower than aggressive marketing
            playbooks — and it is the right default given the regulatory and reputational environment for token
            launches in 2026.
          </P>

          {/* 04 Architecture */}
          <H2 id="architecture" num="04">Technical architecture</H2>
          <H3>4.1 Contract design</H3>
          <P>QTX is a standard ERC-20 on Base, with the following supplementary mechanisms:</P>
          <UL items={[
            <><strong className="text-ghost">Vesting registry:</strong> on-chain allocations with cliff and linear-release parameters per category.</>,
            <><strong className="text-ghost">Claim portal:</strong> lets presale participants claim vested tokens after TGE.</>,
            <><strong className="text-ghost">Multisig ownership:</strong> critical functions controlled by a 3-of-5 multisig post-launch.</>,
            <><strong className="text-ghost">LP lock:</strong> 12-month timelock on initial DEX liquidity via an established third-party locker.</>,
          ]} />
          <pre className="rounded-xl glass border border-violet/10 p-5 my-5 overflow-x-auto font-mono text-[13px] text-mist leading-relaxed">
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
            <p>The contract address and verified source code will be linked here once the audit is complete. Until then, on-chain interaction is limited to view functions.</p>
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
            A Next.js dApp for reservation, presale, and claim interfaces; a Postgres database for reservation
            records; event indexers reading from Base for state synchronisation; and the manufacturer-side firmware
            stack for miners (specified separately).
          </P>

          {/* 05 Tokenomics */}
          <H2 id="tokenomics" num="05">Tokenomics</H2>
          <P>The total supply of 1,000,000,000 QTX is allocated across nine categories, each paired with a specific vesting schedule (Section 6).</P>
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
          <P>All schedules are enforced by the on-chain vesting registry and cannot be modified after TGE without on-chain governance.</P>
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
          <P>Theoretical maximums; actual figures depend on miner activation and stake participation.</P>
          <Table
            head={['From TGE', 'Circulating', '% of total']}
            rows={[
              ['TGE', <Mono key="a">~17M</Mono>, '~1.7%'],
              ['+3 months', <Mono key="b">~80M</Mono>, '~8%'],
              ['+8 months', <Mono key="c">~200M</Mono>, '~20%'],
              ['+12 months', <Mono key="d">~310M</Mono>, '~31%'],
              ['+24 months', <Mono key="e">~580M</Mono>, '~58%'],
              ['+48 months', <Mono key="f">~1B</Mono>, '~100%'],
            ]}
          />
          <H3>6.2 Degressive emission curve</H3>
          <P>
            The Ecosystem allocation follows a degressive schedule, rewarding early miner operators more heavily and
            reducing emissions ~15% year-on-year, with quarterly caps to prevent gaming via short-term hash bursts.
          </P>

          {/* 07 Presale */}
          <H2 id="presale" num="07">Pre-sale structure</H2>
          <P>Five sequential phases. When a phase is fully allocated, the next begins at the higher price. Progression is determined by allocation fill rate, not manual triggers.</P>
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
          <H3>7.1 Reservation phase</H3>
          <P>Today the site accepts <strong className="text-ghost">reservations</strong>, not purchases. A reservation records email, wallet address, and intended amount, and locks in the current phase price. No funds are accepted; reservations can be cancelled anytime.</P>
          <H3>7.2 Purchase preconditions</H3>
          <P>The buy flow activates only when <strong className="text-ghost">all</strong> of the following are met:</P>
          <UL items={[
            'Smart-contract audit completed by a recognised provider and published.',
            'Operating entity established with a published address.',
            'Treasury & ecosystem wallets migrated to a 3-of-5 multisig.',
            'Updated whitepaper published reflecting audit findings.',
          ]} />
          <H3>7.3 Purchase mechanics (when active)</H3>
          <P>Purchases are made in USDC on Base via a self-custody wallet. Reserved participants get a 72-hour priority window at the reserved phase price; after that, unfilled reservations return to the open pool.</P>
          <H3>7.4 Claim at TGE</H3>
          <P>No tokens are delivered immediately. At TGE (planned Q1 2027), 10% becomes claimable; the remaining 90% vests linearly over 8 months.</P>

          {/* 08 Miners */}
          <H2 id="miners" num="08">Hardware miner program</H2>
          <P>The primary mechanism for distributing the 30% Ecosystem allocation. Operators run physical hardware that contributes verified work and earn QTX in return.</P>
          <Callout variant="warn" label="Status as of May 2026">
            <p>The miner program is in <strong className="text-ghost">manufacturer-selection phase</strong>. No units are available for purchase. Published specifications are indicative and may change. Pre-orders are not accepted.</p>
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
          <P>Rewards are distributed pro-rata to verified contribution per emission window. Individual operator weight is capped to prevent centralisation — no single address earns more than a defined percentage of any window regardless of hash contribution.</P>
          <H3>8.3 Manufacturing & delivery</H3>
          <P>Manufacturer engagement is in early discussion as of Q2 2026. First batch targeted for early Q2 2027, contingent on prototype validation. Should validation fail or be delayed, the timeline will be updated transparently.</P>

          {/* 09 Staking */}
          <H2 id="staking" num="09">Staking design</H2>
          <P>A 12% allocation is dedicated to staking. Stakers lock QTX for fixed terms in exchange for a share of pool emissions; longer locks receive higher reward weights.</P>
          <H3>9.1 Lock tiers</H3>
          <P>Three tiers: 30 days (1.0×), 90 days (1.5×), 180 days (2.5×). Early unstaking forfeits accumulated rewards for that period; principal is always returnable.</P>
          <H3>9.2 Emission schedule</H3>
          <P>Degressive, ~10% quarterly decay — rewarding early stakers more heavily and tapering as staked supply grows.</P>
          <H3>9.3 Anti-gaming</H3>
          <P>Per-address weight is capped. Distribution accounts for stake duration as well as size, so a small long-term staker isn&apos;t heavily outweighed by a large short-term one.</P>

          {/* 10 Governance */}
          <H2 id="governance" num="10">Governance & treasury</H2>
          <H3>10.1 Multisig structure</H3>
          <P>Treasury and ecosystem-emission contracts are controlled by a 3-of-5 multisig after launch. Signers: the founder, one technical advisor, one legal/compliance advisor, one community-elected signer, and one rotating quarterly signer. Identities are public.</P>
          <H3>10.2 Treasury operations</H3>
          <P>The 16% Treasury funds development and audits, legal and compliance, infrastructure, ecosystem grants, and a contingency reserve. Quarterly transparency reports detail expenditures by category.</P>
          <H3>10.3 Future governance</H3>
          <P>Token-weighted governance is planned post-launch. Core economic parameters (total supply, cliff durations, LP lock) are <strong className="text-ghost">not</strong> governance-adjustable; scope is added incrementally as the system matures.</P>

          {/* 11 Security */}
          <H2 id="security" num="11">Security & audits</H2>
          <H3>11.1 Audit status</H3>
          <P>As of May 2026, the smart contract has <strong className="text-ghost">not yet been independently audited</strong>. Vendor selection is in progress (candidates: Coinsult, CertiK, Hacken). The buy flow will not activate until the audit is completed and published.</P>
          <Callout variant="warn" label="Why this matters">
            <p>Many presales advertise &quot;audit in progress&quot; with vendor logos without an active engagement. We do not list vendor logos until an audit is actively underway with a signed engagement.</p>
          </Callout>
          <H3>11.2 Audit scope</H3>
          <P>Token contract, vesting registry, claim portal, and staking/miner-reward modules. The report will include severity-classified findings, the team&apos;s response, and verification of fixes.</P>
          <H3>11.3 Bug bounty</H3>
          <P>Active from TGE onwards, covering critical and high-severity findings in deployed contracts.</P>
          <H3>11.4 Operational security</H3>
          <P>Deployer keys on hardware-secured signing devices; multisig signers on independent hardware wallets; no private keys on cloud infrastructure; cold-signed deployment transactions.</P>

          {/* 12 Legal */}
          <H2 id="legal" num="12">Legal & compliance</H2>
          <H3>12.1 Operating entity</H3>
          <P>Being established in Dubai under the VARA framework. Once established, it assumes all operational responsibilities including treasury, supplier contracts, and customer-facing obligations.</P>
          <H3>12.2 Jurisdictional restrictions</H3>
          <P>Participation may be restricted or prohibited in certain jurisdictions — the EU under MiCAR, the US under securities laws, the UK under FCA rules, and others. Participants are responsible for ensuring compliance with local law. The site may apply geographic restrictions.</P>
          <H3>12.3 No financial advice</H3>
          <P>Nothing here constitutes financial, investment, legal, tax, or accounting advice. Consult qualified professional advisors before any decision regarding QTX.</P>
          <H3>12.4 KYC / AML</H3>
          <P>KYC at purchase time depends on the final entity&apos;s obligations and purchase size, and will be published before the buy flow opens. Reservation does not require KYC.</P>

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
          <P>The project is operated by a single founder. Founder unavailability could materially delay or prevent execution. Multisig and treasury structures provide some continuity, but solo-founder execution concentration is higher than larger teams.</P>
          <H3>13.5 Hardware program risk</H3>
          <P>Miner development depends on manufacturer engagement, prototype validation, and supply-chain conditions. The program may be delayed, scaled down, or cancelled; in that case the Ecosystem allocation would be redirected per multisig-approved governance.</P>
          <H3>13.6 Market risk</H3>
          <P>Post-TGE price is market-determined. Initial liquidity is locked, but secondary trading may be thin or volatile. There is no obligation on the entity to support price.</P>

          {/* 14 Roadmap */}
          <H2 id="roadmap" num="14">Roadmap</H2>
          <P>Reflects current planning as of Q2 2026. Dates are targets, not commitments.</P>
          <Table
            head={['Period', 'Status', 'Milestone']}
            rows={[
              ['Q3 2025', 'Done', 'Token contract deployed on Base; website v1 live'],
              ['Q2 2026', 'Active', 'Reservation phase; entity setup; audit selection; whitepaper v1.3'],
              ['Q3–Q4 2026', 'Planned', 'Audit published; multisig migration; manufacturer engagement; staking testnet'],
              ['Q1 2027', 'Planned', 'TGE; DEX listing; claim portal; staking launch'],
              ['Early Q2 2027', 'Planned', 'Hardware miner Batch #1 (contingent on validation)'],
            ]}
          />

          {/* 15 Disclaimers */}
          <H2 id="disclaimers" num="15">Disclaimers</H2>
          <Callout variant="danger" label="Final disclaimer">
            <p>This whitepaper is provided for informational purposes only. It is not an offer to sell or a solicitation of an offer to buy QTX in any jurisdiction where such offer or solicitation would be unlawful. QTX is a speculative digital asset. Nothing herein constitutes financial, investment, legal, tax, or accounting advice. Information is current as of publication and may become outdated; the most recent version on the official website governs in case of conflict.</p>
            <p>By accessing this document and participating in any way, you confirm that you understand the risks in Section 13, that you have consulted appropriate professional advisors as needed, and that you are not located in a jurisdiction where participation is restricted. The founder, contributors, and any future operating entity disclaim all liability to the maximum extent permitted by law for losses arising from participation in or use of the Qryptix project.</p>
          </Callout>

          {/* Bottom nav */}
          <div className="mt-20 pt-8 border-t border-violet/10 flex gap-4">
            <a href="/" className="flex-1 rounded-2xl glass p-6 transition-all hover:border-violet/30">
              <div className="text-[11px] uppercase tracking-wider text-fog mb-1.5">← Back to</div>
              <div className="font-display font-medium text-ghost">Qryptix Home</div>
            </a>
            <a href={`mailto:${SITE.email}`} className="flex-1 rounded-2xl glass p-6 transition-all hover:border-violet/30">
              <div className="text-[11px] uppercase tracking-wider text-fog mb-1.5">Questions?</div>
              <div className="font-display font-medium text-ghost">{SITE.email}</div>
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
