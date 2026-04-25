/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base
        bg: '#FAFAF9',
        surface: '#FFFFFF',
        ink: '#0A0A0A',
        'ink-2': '#3F3F3F',
        'ink-3': '#737373',
        'ink-4': '#A3A3A3',
        line: '#E8E8E6',
        'line-2': '#F4F4F2',
        // Semantic
        'pos': '#15803D',
        'pos-soft': '#DCFCE7',
        'warn': '#D97706',
        'warn-soft': '#FEF3C7',
        'neg': '#DC2626',
        'neg-soft': '#FEE2E2',
        'info': '#0284C7',
        'info-soft': '#DBEAFE',
        'pink': '#DB2777',
        'pink-soft': '#FCE7F3',
        // Primary & Accent
        'primary': '#0A0A0A',
        'primary-soft': '#F4F4F2',
        'accent': '#84CC16',
        'accent-ink': '#3F6212',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'hero': ['38px', { lineHeight: '1', letterSpacing: '-1.8px', fontWeight: '700' }],
        'h1': ['26px', { lineHeight: '1.1', letterSpacing: '-0.8px', fontWeight: '700' }],
        'h2': ['20px', { lineHeight: '1.2', letterSpacing: '-0.5px', fontWeight: '700' }],
        'h3': ['14px', { lineHeight: '1.3', letterSpacing: '-0.2px', fontWeight: '700' }],
        'body': ['13px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
        'sm': ['12px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
        'xs': ['11px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
        'micro': ['10px', { lineHeight: '1.4', letterSpacing: '0.5px', fontWeight: '700' }],
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
        'pill': '999px',
      },
      borderWidth: {
        'thick': '1.5px',
        'thin': '1px',
      },
      spacing: {
        's1': '4px',
        's2': '8px',
        's3': '12px',
        's4': '14px',
        's5': '16px',
        's6': '20px',
        's7': '24px',
      },
      boxShadow: {
        none: 'none',
      },
    },
  },
  plugins: [],
}
