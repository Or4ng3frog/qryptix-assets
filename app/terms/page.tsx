import type { Metadata } from 'next';
import { LegalLayout, H2, P, UL } from '@/components/LegalLayout';
import { SITE } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Terms of Use — Qryptix',
  description: 'Terms governing the use of the Qryptix website and PreSale.',
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Use"
      updated="May 2026"
      intro={`These terms govern your use of ${SITE.domain} and your participation in the Qryptix PreSale. By using the site you agree to these terms.`}
    >
      <H2>1. Eligibility</H2>
      <P>
        You must be of legal age in your jurisdiction and legally permitted to participate in crypto-asset
        activities. You are responsible for ensuring that your participation complies with all laws applicable to
        you. Access may be restricted in certain jurisdictions.
      </P>

      <H2>2. Nature of the PreSale</H2>
      <P>
        Participation in the Qryptix PreSale is offered as early supporter participation, not as an investment
        product. No promise of profit, value increase, listing, liquidity, or rewards is made. Tokens are not
        claimable until launch / TGE.
      </P>

      <H2>3. No financial advice</H2>
      <P>
        Content on this site is for general information only and does not constitute financial, investment, legal,
        tax, or accounting advice. You should consult qualified professional advisors before participating.
      </P>

      <H2>4. Acknowledged risks</H2>
      <P>
        By participating you acknowledge the risks set out in the Risk Disclosure, including the possibility of
        total loss. You confirm you have read and accepted the Risk Disclosure and Refund Policy.
      </P>

      <H2>5. Accounts and wallets</H2>
      <UL items={[
        'You are responsible for the security of your account credentials and wallet.',
        'We never ask for your private keys or seed phrase. Never share them with anyone.',
        'You are responsible for providing an accurate wallet address for any allocation or refund.',
      ]} />

      <H2>6. Prohibited use</H2>
      <P>
        You may not use the site for unlawful purposes, to circumvent jurisdictional restrictions, to engage in
        money laundering or sanctions evasion, or to interfere with the operation or security of the site.
      </P>

      <H2>7. Intellectual property</H2>
      <P>
        The Qryptix name, logo, and site content are the property of the project and its founder, except where
        otherwise noted. You may not reproduce them without permission.
      </P>

      <H2>8. Limitation of liability</H2>
      <P>
        To the maximum extent permitted by law, the founder, contributors, and any future operating entity
        disclaim all liability for losses arising from your use of the site or participation in the PreSale, except
        as expressly set out in the Refund Policy.
      </P>

      <H2>9. Changes</H2>
      <P>
        These terms may be updated as the project and its operating entity are finalised. Material changes will be
        communicated through official channels.
      </P>

      <H2>10. Contact</H2>
      <P>
        Questions can be directed to {SITE.email}. This document is a working draft and must be finalised by
        qualified legal counsel before {SITE.name} accepts any funds.
      </P>
    </LegalLayout>
  );
}
