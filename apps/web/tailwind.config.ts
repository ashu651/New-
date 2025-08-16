import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        muted: '#9CA3AF'
      },
      borderRadius: {
        md: '12px',
        lg: '16px',
        xl: '24px'
      }
    }
  },
  plugins: []
};

export default config;