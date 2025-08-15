import type { Config } from 'tailwindcss'

export default {
	content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				brand: {
					50: '#eef2ff', 100: '#e0e7ff', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca',
				},
			},
			borderRadius: {
				lg: '12px',
				xl: '16px',
			},
			boxShadow: {
				soft: '0 2px 10px rgba(0,0,0,0.06)',
			},
		},
	},
	plugins: [],
} satisfies Config