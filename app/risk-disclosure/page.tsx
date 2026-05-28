import type { Metadata } from 'next';
import { LegalLayout, H2, P, UL } from '@/components/LegalLayout';
import { RISKS, SITE } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Risk Disclosure — Qryptix',
  description: 'Full risk disclosure for participating in the Qryptix PreSale.',
};

export default function RiskDisclosurePage() {
  return (
    <LegalLayout
      title="Risk Disclosure"
      updated="May 2026"
      intro="Please read this disclosure carefully before participating in the Qryptix PreSale. Participation is entirely voluntary and carries substantial risk, including the risk of losing all funds you contribute."
    >
      <H2>1. Summary of risks</H2>
      <UL items={RISKS.map((r) => r)} />

      <H2>2. Early-stage nature</H2>
      <P>
        Qryptix is at an early stage. As of the date of this document, the smart contract has not been
        independently audited, the operating entity is still being established, and no token claim or distribution
        system is yet live. The project may change materially, be delayed, or — in a worst case — not launch at
        all.
      </P>

      <H2>3. No guarantees</H2>
      <P>
        Nothing on {SITE.domain} or in any related material constitutes a promise or guarantee of value, profit,
        listing, liquidity, or rewards. The hardware and reward layer described in our materials is planned but not
        guaranteed and may be delayed, scaled down, or cancelled.
      </P>

      <H2>4. Total loss</H2>
      <P>
        You may lose the entire amount you contribute. QTX has no guaranteed price floor, no buyback obligation,
        and no claim on the assets of the founder or any future operating entity beyond what is set out in the
        published Refund Policy. Only contribute funds you can afford to lose entirely.
      </P>

      <H2>5. Technical risk</H2>
      <P>
        Smart contracts may contain undiscovered vulnerabilities even after auditing. The Base network depends on
        Ethereum security and its rollup infrastructure; a failure at either layer could affect Qryptix. Loss of
        wallet keys, phishing, and user error can all result in permanent loss of funds.
      </P>

      <H2>6. Regulatory risk</H2>
      <P>
        The regulatory treatment of crypto-assets varies by country and is evolving. Participation may be
        restricted or prohibited in your jurisdiction, including the European Union under MiCAR, the United States
        under securities laws, the United Kingdom under FCA rules, and others. You are solely responsible for
        determining whether you are legally permitted to participate.
      </P>

      <H2>7. Not financial advice</H2>
      <P>
        Nothing here constitutes financial, investment, legal, tax, or accounting advice. You should consult
        qualified professional advisors before participating.
      </P>

      <H2>8. Acknowledgement</H2>
      <P>
        By participating in the Qryptix PreSale you confirm that you have read and understood this disclosure, that
        you accept these risks, and that you are participating voluntarily. This document is a working draft and
        must be finalised by qualified legal counsel before {SITE.name} accepts any funds.
      </P>
    </LegalLayout>
  );
}
