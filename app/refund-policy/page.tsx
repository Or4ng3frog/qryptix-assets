import type { Metadata } from 'next';
import { LegalLayout, H2, P, UL } from '@/components/LegalLayout';
import { REFUND_ELIGIBLE, REFUND_NOT_ELIGIBLE, REFUND_RULES, SITE } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Refund Policy — Qryptix',
  description: 'How and when refunds may apply to Qryptix PreSale participation.',
};

export default function RefundPolicy() {
  return (
    <LegalLayout
      title="Refund Policy"
      updated="May 2026"
      intro="This policy explains the limited circumstances under which a PreSale participant may receive a refund, and the circumstances under which refunds do not apply. Participation in the Qryptix PreSale is speculative; this policy is not a guarantee of return."
    >
      <H2>1. Purpose</H2>
      <P>
        Qryptix is an early-stage crypto project. We recognise that participants contribute funds before the token
        is launched or claimable. This policy is intended to give participants a clear, honest understanding of
        when funds may be returned if the project cannot deliver a viable launch.
      </P>

      <H2>2. When a refund may apply</H2>
      <P>A refund may be available if any of the following occur:</P>
      <UL items={REFUND_ELIGIBLE.map((r) => r)} />
      <P>
        In these situations, eligible participants may request a refund through the Dashboard, subject to the
        conditions in Section 4.
      </P>

      <H2>3. When a refund does not apply</H2>
      <P>A refund is not automatically available in the following situations:</P>
      <UL items={REFUND_NOT_ELIGIBLE.map((r) => r)} />
      <P>
        These reflect normal market and project risks that every participant accepts when taking part in an
        early-stage crypto project.
      </P>

      <H2>4. Conditions and limitations</H2>
      <UL items={REFUND_RULES.map((r) => r)} />
      <P>
        Once tokens have been claimed or distributed at or after TGE (Token Generation Event), the PreSale
        participation is considered fulfilled and no automatic refund applies.
      </P>

      <H2>5. How to request a refund</H2>
      <P>
        Eligible refund requests are submitted through your Qryptix Dashboard under the Refund section. Each
        request moves through the following states: requested → under review → approved or rejected → paid. You can
        track the status of your request at any time in the Dashboard.
      </P>

      <H2>6. Refund currency and fees</H2>
      <P>
        Where technically possible, refunds are issued in the same currency used for the original payment (for
        example USDC, USDT, or ETH on Base). Network and gas fees incurred during the original transaction or the
        refund transaction are generally not refundable.
      </P>

      <H2>7. Changes to this policy</H2>
      <P>
        This policy may be updated as the project structure, operating entity, and legal framework are finalised.
        Material changes will be communicated through the official channels. The version published on{' '}
        {SITE.domain} at the time of your participation governs your refund rights.
      </P>

      <H2>8. Contact</H2>
      <P>
        Questions about this policy can be directed to {SITE.email}. This document is a working draft and must be
        reviewed and finalised by qualified legal counsel before {SITE.name} accepts any funds.
      </P>
    </LegalLayout>
  );
}
