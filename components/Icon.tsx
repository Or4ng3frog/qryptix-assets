import React from 'react';

const paths: Record<string, React.ReactNode> = {
  zap: <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />,
  cpu: <><rect x="6" y="6" width="12" height="12" rx="1" /><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2M9 9h6v6H9z" /></>,
  gauge: <><path d="M12 14l4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></>,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  boxes: <><path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" /><path d="M12 11l8-4.5M12 11v9M12 11L4 6.5" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="M20 6L9 17l-5-5" />,
  external: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6M10 14L21 3" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  alert: <><path d="M12 9v4M12 17h.01" /><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></>,
  doc: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></>,
  twitter: <path d="M18 2h3l-7 8 8 11h-6l-5-6.5L6 21H3l7.5-8.5L3 2h6l4.5 6L18 2z" />,
  telegram: <path d="M22 3L2 11l6 2 2 7 3-4 5 4 4-17z" />,
  discord: <><circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" /><path d="M7.5 7.5c3-1 6-1 9 0M7 16.5c3 1 7 1 10 0M8 7l-1 1c-1.5 2-2 5-1.5 8 1 1 2.5 1.5 4 1.5l1-2M16 7l1 1c1.5 2 2 5 1.5 8-1 1-2.5 1.5-4 1.5l-1-2" /></>,
  github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />,
  linkedin: <><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /><path d="M10 9h4v2c.5-1 2-2 4-2 3 0 4 2 4 5v7h-4v-6c0-1.5-.5-2.5-2-2.5S14 14 14 16v5h-4V9z" /></>,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 6 10-6" /></>,
};

export function Icon({ name, className = '', size = 24 }: { name: string; className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name] ?? null}
    </svg>
  );
}
