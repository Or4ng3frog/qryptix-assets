import type { Metadata } from 'next';
import { LegalLayout, H2, P, UL } from '@/components/LegalLayout';
import { SITE, PRESALE } from '@/lib/config';

export const metadata: Metadata = {
  title: 'PreSale Terms — Qryptix',
  description: 'Specific terms governing participation in the Qryptix PreSale.',
};

export default function PresaleTermsPage() {
  return (
    <LegalLayout
      title="PreSale Terms"
      updated="May 2026"
      intro="These terms apply specifically to participation in the Qryptix PreSale, in addition to the general Terms of Use, Risk Disclosure, and Refund Policy."
    >
      <H2>1. What you are participating in</H2>
      <P>
        The Qryptix PreSale offers early supporters the opportunity to participate ahead of the Token Generation
        Event (TGE). Participation is described as early supporter participation and is not an investment product.
        QTX tokens are not claimable until launch / TGE.
      </P>

      <H2>2. Pricing and stages</H2>
      <P>
        The PreSale runs in sequential stages, each with a fixed price per QTX. When a stage&apos;s allocation is
        filled, the next stage begins at a higher price. The price applicable to your participation is the price of
        the stage active at the time your participation is recorded.
      </P>

      <H2>3. Limits and payment</H2>
      <UL items={[
        `Minimum participation: $${PRESALE.minBuyUsd} (USD-equivalent).`,
        `Maximum participation per wallet: $${PRESALE.maxBuyUsd.toLocaleString()} (USD-equivalent).`,
        `Accepted currencies: ${PRESALE.currencies.join(', ')} on the Base network.`,
        'You are responsible for sending payment from a wallet you control and for any network fees.',
      ]} />

      <H2>4. Token claim and vesting</H2>
      <P>
        No tokens are delivered at the time of participation. At TGE, a portion of your allocation unlocks and the
        remainder vests over time according to the published vesting schedule. Vesting terms are subject to
        finalisation and will be confirmed before TGE.
      </P>

      <H2>5. Refunds</H2>
      <P>
        Refunds are governed solely by the published Refund Policy. In summary, refunds may apply only if the
        project cannot deliver a viable launch, and only up to the point of token claim / TGE. Please read the
        Refund Policy in full.
      </P>

      <H2>6. No guarantees</H2>
      <P>
        Participation does not guarantee any value increase, liquidity, exchange listing, or rewards. The project
        is early-stage and may change, be delayed, or not launch. See the Risk Disclosure.
      </P>

      <H2>7. Required acknowledgements</H2>
      <P>Before participating, you must confirm that you understand and accept the following:</P>
      <UL items={[
        'Qryptix is an early-stage crypto project, participation is speculative, and no listing, liquidity, reward or value increase is guaranteed.',
        'You have read and accept the PreSale Terms, Refund Policy, and Risk Disclosure.',
      ]} />

      <H2>8. Contact</H2>
      <P>
        Questions can be directed to {SITE.email}. This document is a working draft and must be finalised by
        qualified legal counsel before {SITE.name} accepts any funds.
      </P>
    </LegalLayout>
  );
}
