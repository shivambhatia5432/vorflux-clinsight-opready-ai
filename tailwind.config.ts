import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Typeform-inspired palette
        surface: {
          DEFAULT: '#191919',
          raised: '#242424',
          overlay: '#2e2e2e',
          border: '#383838',
        },
        accent: {
          DEFAULT: '#0445AF',
          hover: '#0356d4',
          light: '#e8f0fe',
        },
        ink: {
          DEFAULT: '#ffffff',
          muted: '#a0a0a0',
          subtle: '#666666',
        },
        // Status colors
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.4)',
        'card-hover': '0 4px 24px rgba(0,0,0,0.6)',
        glow: '0 0 0 3px rgba(4,69,175,0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
