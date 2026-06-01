import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Premium Dark Luxe (new system — see design-system/qryptix/MASTER.md) ──
        // Dark-only canvas, warm-tinted near-blacks
        obsidian: '#08080A', // page canvas
        onyx: '#0C0C10',     // section bands
        graphite: '#121217', // cards / glass base
        raised: '#1A1A21',   // inputs, raised surfaces
        // Gold — the single brand accent
        gold: {
          DEFAULT: '#E3B341',
          bright: '#F4D88A',
          deep: '#9A6F24',
        },
        champagne: '#EBE3CE',
        // Text
        ivory: '#F4F1EA',
        ash: '#A8A39A',
        taupe: '#6E6A62',

        // ── Legacy tokens (old cyan/violet system — retained during rebuild) ──
        void: '#05060A',
        abyss: '#080A11',
        carbon: '#0E1119',
        slate: '#161A26',
        steel: '#1F2433',
        cyan: {
          DEFAULT: '#0FE3CE',
          bright: '#3DFFEC',
          dim: '#0A9D8F',
        },
        violet: {
          DEFAULT: '#9D5CFF',
          bright: '#B98BFF',
          dim: '#7B2EFF',
        },
        ghost: '#EEEFF7',
        mist: '#A4A7BD',
        fog: '#676B82',
      },
      fontFamily: {
        // New luxe system
        serif: ['Playfair Display', 'Georgia', 'serif'], // display headlines
        grotesk: ['Inter', 'system-ui', 'sans-serif'],   // body / UI
        // Legacy (retained during rebuild)
        display: ['ClashDisplay', 'system-ui', 'sans-serif'],
        sans: ['Satoshi', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // New luxe scale
        'display-xl': ['clamp(3rem, 8vw, 6.5rem)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'display': ['clamp(2.25rem, 5vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.015em' }],
        // Legacy
        'mega': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        'giant': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.0', letterSpacing: '-0.03em' }],
      },
      letterSpacing: {
        eyebrow: '0.22em',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.16, 1, 0.3, 1)',
        sync: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      backgroundImage: {
        // New luxe gradients
        'gold-gradient': 'linear-gradient(120deg, #F4D88A 0%, #E3B341 48%, #9A6F24 100%)',
        'gold-sheen': 'linear-gradient(110deg, #9A6F24, #F4D88A, #E3B341, #F4D88A, #9A6F24)',
        'obsidian-fade': 'radial-gradient(ellipse at 50% 0%, rgba(227,179,65,0.14), transparent 70%)',
        'grid-gold': "linear-gradient(rgba(227,179,65,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(227,179,65,0.05) 1px, transparent 1px)",
        // Legacy
        'brand-gradient': 'linear-gradient(120deg, #0FE3CE 0%, #6B6BFF 52%, #9D5CFF 100%)',
        'brand-radial': 'radial-gradient(circle at 50% 0%, rgba(157,92,255,0.28), transparent 70%)',
        'grid': "linear-gradient(rgba(157,92,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(157,92,255,0.06) 1px, transparent 1px)",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'sheen': 'sheen 7s linear infinite',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        sheen: {
          '0%': { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
