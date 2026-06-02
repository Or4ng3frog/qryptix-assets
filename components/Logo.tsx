import type { CSSProperties } from 'react';

/**
 * Qryptix mark — premium gold reinterpretation of the original "Q".
 * Pure geometric SVG (no glow / no circuit clutter): a Q ring + angular tail,
 * a faint orbital sweep, and a glowing core node that echoes the site's
 * QuantumField hub. Recognisable, dark-UI native, crisp at any size.
 *
 * Server-safe: no hooks. A fixed gradient id is fine even with multiple
 * instances — every definition is identical, so they resolve to the same gold.
 */
export function LogoMark({
  className = '',
  style,
  title = 'Qryptix',
}: {
  className?: string;
  style?: CSSProperties;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={style}
      fill="none"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="qtxGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4D88A" />
          <stop offset="0.5" stopColor="#E3B341" />
          <stop offset="1" stopColor="#9A6F24" />
        </linearGradient>
      </defs>

      {/* orbital sweep — the planet/atom signature */}
      <ellipse
        cx="50"
        cy="50"
        rx="44"
        ry="15"
        transform="rotate(-28 50 50)"
        stroke="url(#qtxGold)"
        strokeWidth="1.6"
        opacity="0.55"
      />
      {/* network endpoints on the orbit */}
      <circle cx="88.9" cy="29.3" r="2.4" fill="url(#qtxGold)" />
      <circle cx="11.1" cy="70.7" r="2.4" fill="url(#qtxGold)" />

      {/* Q bowl */}
      <circle cx="50" cy="50" r="29" stroke="url(#qtxGold)" strokeWidth="5" />
      {/* Q tail — crosses the ring at lower-right */}
      <line x1="63" y1="63" x2="82" y2="82" stroke="url(#qtxGold)" strokeWidth="5" strokeLinecap="round" />

      {/* core node */}
      <circle cx="50" cy="50" r="10" fill="#F4D88A" opacity="0.16" />
      <circle cx="50" cy="50" r="5" fill="#F4D88A" />
    </svg>
  );
}

/**
 * Full logo lockup (mark + wordmark) or icon-only.
 * `size` is the mark height in px; the wordmark scales from it.
 */
export function Logo({
  variant = 'full',
  size = 32,
  className = '',
}: {
  variant?: 'full' | 'icon';
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center ${className}`} style={{ gap: size * 0.32 }}>
      <LogoMark style={{ width: size, height: size }} />
      {variant === 'full' && (
        <span
          className="font-grotesk font-semibold text-ivory leading-none"
          style={{ fontSize: size * 0.46, letterSpacing: '0.2em', paddingLeft: '0.05em' }}
        >
          QRYPTIX
        </span>
      )}
    </span>
  );
}
