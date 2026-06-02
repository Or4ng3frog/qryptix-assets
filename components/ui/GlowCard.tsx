'use client';

import { useRef, type ReactNode } from 'react';

/**
 * Premium glass card with an optional pointer-following gold spotlight.
 * The spotlight updates CSS custom properties directly on the node (no React
 * re-render), so it stays cheap even with many cards on screen. Caller controls
 * surface styling (glass-luxe / rounding / borders) via `className`.
 */
export function GlowCard({
  children,
  className = '',
  spotlight = true,
}: {
  children: ReactNode;
  className?: string;
  spotlight?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={spotlight ? onMove : undefined}
      className={`group relative overflow-hidden ${className}`}
    >
      {spotlight && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(227,179,65,0.10), transparent 60%)',
          }}
        />
      )}
      <div className="relative h-full">{children}</div>
    </div>
  );
}
