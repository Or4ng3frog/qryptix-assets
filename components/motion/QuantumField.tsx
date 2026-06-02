'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Quantum data-network backdrop — a constellation of gold nodes joined by faint
 * connection lines, with a few "data pulses" travelling along the links. Pure
 * SVG (no rAF loop) so it stays light. Static when reduced-motion is requested.
 *
 * Coordinates live in a 1000×560 viewBox; the SVG is sliced to cover its parent.
 */

type Pt = { x: number; y: number; r?: number; core?: boolean };

const NODES: Pt[] = [
  { x: 120, y: 90 },
  { x: 300, y: 160 },
  { x: 180, y: 330 },
  { x: 380, y: 420 },
  { x: 520, y: 250, r: 5, core: true },
  { x: 680, y: 130 },
  { x: 640, y: 360 },
  { x: 820, y: 250 },
  { x: 900, y: 120 },
  { x: 940, y: 380 },
  { x: 480, y: 90 },
  { x: 760, y: 440 },
  { x: 240, y: 500 },
  { x: 1040, y: 250 },
];

const EDGES: [number, number][] = [
  [0, 1], [1, 4], [1, 10], [0, 2], [2, 3], [3, 4], [4, 5], [4, 6],
  [5, 7], [6, 7], [5, 10], [7, 8], [7, 13], [6, 11], [9, 13], [7, 9],
  [3, 12], [11, 9], [8, 13], [2, 12],
];

// Links that carry a travelling pulse (edge index, duration, delay).
const PULSES: { a: number; b: number; dur: number; delay: number }[] = [
  { a: 1, b: 4, dur: 3.2, delay: 0 },
  { a: 4, b: 5, dur: 2.6, delay: 0.8 },
  { a: 7, b: 13, dur: 3.0, delay: 1.6 },
  { a: 6, b: 7, dur: 2.4, delay: 2.2 },
  { a: 4, b: 6, dur: 3.4, delay: 1.1 },
];

export function QuantumField({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`pointer-events-none ${className}`}
      style={{
        maskImage: 'radial-gradient(ellipse 75% 75% at 50% 45%, #000 55%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 45%, #000 55%, transparent 100%)',
      }}
      aria-hidden
    >
      <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        {/* connection lines */}
        <g stroke="rgba(227,179,65,0.18)" strokeWidth="1">
          {EDGES.map(([a, b], i) => (
            <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} />
          ))}
        </g>

        {/* nodes */}
        {NODES.map((n, i) => (
          <g key={i}>
            {n.core && (
              <circle cx={n.x} cy={n.y} r={16} fill="none" stroke="rgba(227,179,65,0.4)" strokeWidth="1" />
            )}
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r ?? 2.5}
              fill={n.core ? '#F4D88A' : '#E3B341'}
              className={reduce ? '' : 'animate-pulse-glow'}
              style={reduce ? undefined : { animationDelay: `${(i % 5) * 0.5}s` }}
            />
            {n.core && (
              <circle cx={n.x} cy={n.y} r={9} fill="rgba(244,216,138,0.18)" />
            )}
          </g>
        ))}

        {/* travelling data pulses */}
        {!reduce &&
          PULSES.map((p, i) => (
            <motion.circle
              key={`p-${i}`}
              r={2.6}
              fill="#F4D88A"
              initial={{ cx: NODES[p.a].x, cy: NODES[p.a].y, opacity: 0 }}
              animate={{
                cx: [NODES[p.a].x, NODES[p.b].x],
                cy: [NODES[p.a].y, NODES[p.b].y],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}
            />
          ))}
      </svg>
    </div>
  );
}
