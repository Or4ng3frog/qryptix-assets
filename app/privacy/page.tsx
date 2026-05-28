import type { Metadata } from 'next';
import { LegalLayout, H2, P, UL } from '@/components/LegalLayout';
import { SITE } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Privacy Policy — Qryptix',
  description: 'How Qryptix collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="May 2026"
      intro="This policy explains what data Qryptix collects, why, and how it is handled. We aim to collect only what is necessary to operate the PreSale and your account."
    >
      <H2>1. Data we collect</H2>
      <UL items={[
        'Account data: email address and (if you set one) a password, managed via our authentication provider.',
        'Wallet data: any wallet address you connect or provide for allocation or refunds.',
        'Participation data: PreSale amounts, currency, QTX amounts, transaction hashes, and status.',
        'Refund data: refund requests, reasons, and status.',
        'Technical data: basic logs needed to operate and secure the service.',
      ]} />

      <H2>2. How we use it</H2>
      <P>
        We use your data to operate your account, record and verify PreSale participation, process refund requests
        under the Refund Policy, communicate important updates, and meet any legal obligations of the operating
        entity once established.
      </P>

      <H2>3. Legal basis</H2>
      <P>
        Where the GDPR applies, processing is based on the performance of our agreement with you (your
        participation), our legitimate interests in operating and securing the service, your consent (for optional
        communications), and compliance with legal obligations.
      </P>

      <H2>4. Sharing</H2>
      <P>
        We share data only with service providers necessary to run the platform (for example, authentication and
        database hosting), and where required by law. We do not sell your personal data.
      </P>

      <H2>5. Storage and security</H2>
      <P>
        Data is stored with our infrastructure providers using industry-standard protections. We never store your
        private keys or seed phrase, and we never ask for them. No method of storage or transmission is completely
        secure, and we cannot guarantee absolute security.
      </P>

      <H2>6. Your rights</H2>
      <P>
        Depending on your jurisdiction, you may have rights to access, correct, delete, or port your data, and to
        object to or restrict certain processing. To exercise these rights, contact {SITE.email}.
      </P>

      <H2>7. Retention</H2>
      <P>
        We retain participation and refund records for as long as necessary to operate the PreSale, fulfil claims,
        and meet legal and accounting obligations.
      </P>

      <H2>8. Changes and contact</H2>
      <P>
        This policy may be updated as the operating entity is finalised. Questions can be directed to {SITE.email}.
        This document is a working draft and must be finalised by qualified legal counsel before {SITE.name}{' '}
        accepts any funds.
      </P>
    </LegalLayout>
  );
}
