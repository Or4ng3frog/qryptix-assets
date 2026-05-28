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
        // Brand — from logo, punchier / more saturated
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
        'brand-gradient': 'linear-gradient(120deg, #0FE3CE 0%, #6B6BFF 52%, #9D5CFF 100%)',
        'brand-radial': 'radial-gradient(circle at 50% 0%, rgba(157,92,255,0.28), transparent 70%)',
        'grid': "linear-gradient(rgba(157,92,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(157,92,255,0.06) 1px, transparent 1px)",
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
