import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'green-dark':   '#1E5A44',
        'green-mid':    '#3A7D5A',
        'green-accent': '#2D8A5E',
        'green-light':  '#9FD3B1',
        'green-pale':   '#E6F4EB',
        'app-bg':       '#F7FBF8',
        'app-surface':  '#FFFFFF',
        'app-border':   '#E0EDE5',
        'text-primary': '#1A2E24',
        'text-secondary': '#4A6B58',
        'text-muted':   '#7A9B88',
      },
      fontFamily: { sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'] },
      borderRadius: { card: '16px', input: '10px' },
      boxShadow: { card: '0 2px 16px rgba(30,90,68,0.08)', 'card-hover': '0 4px 24px rgba(30,90,68,0.14)' },
    },
  },
  plugins: [],
}
export default config
