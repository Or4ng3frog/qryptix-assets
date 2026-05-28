export type WPSection = {
  id: string;
  title: string;
  body: React.ReactNode;
};

// Whitepaper content lives in the page component to keep JSX inline.
// This file holds the section index for the sidebar.
export const WP_INDEX: { id: string; label: string }[] = [
  { id: 'summary', label: 'Executive summary' },
  { id: 'problem', label: 'Problem & motivation' },
  { id: 'solution', label: 'The Qryptix approach' },
  { id: 'architecture', label: 'Technical architecture' },
  { id: 'tokenomics', label: 'Tokenomics' },
  { id: 'vesting', label: 'Vesting & emissions' },
  { id: 'presale', label: 'Pre-sale structure' },
  { id: 'miners', label: 'Hardware miner program' },
  { id: 'staking', label: 'Staking design' },
  { id: 'governance', label: 'Governance & treasury' },
  { id: 'security', label: 'Security & audits' },
  { id: 'legal', label: 'Legal & compliance' },
  { id: 'risk', label: 'Risk factors' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'disclaimers', label: 'Disclaimers' },
];
