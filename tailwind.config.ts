import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep space base
        void: '#05060A',
        abyss: '#080A11',
        carbon: '#0E1119',
        slate: '#161A26',
        steel: '#1F2433',
        // Brand — from logo
        cyan: {
          DEFAULT: '#3DE0D0',
          bright: '#5FF5E6',
          dim: '#229488',
        },
        violet: {
          DEFAULT: '#A88BFF',
          bright: '#C4AEFF',
          dim: '#6B4FD8',
        },
        // Text
        ghost: '#EEEFF7',
        mist: '#A4A7BD',
        fog: '#676B82',
      },
      fontFamily: {
        display: ['ClashDisplay', 'system-ui', 'sans-serif'],
        sans: ['Satoshi', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'mega': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        'giant': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.0', letterSpacing: '-0.03em' }],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(120deg, #3DE0D0 0%, #A88BFF 100%)',
        'brand-radial': 'radial-gradient(circle at 50% 0%, rgba(168,139,255,0.15), transparent 70%)',
        'grid': "linear-gradient(rgba(168,139,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(168,139,255,0.04) 1px, transparent 1px)",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'shimmer': 'shimmer 3s linear infinite',
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
