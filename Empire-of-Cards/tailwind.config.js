import typography from '@tailwindcss/typography'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cassowary-blue': '#1d4e89',
        'feather-gold': '#d4a857',
        'earth-brown': '#5c3d2e',
        'sunset-orange': '#cf6e38',
      },
      boxShadow: {
        'inset-light': 'inset 2px 2px 6px rgba(255, 255, 255, 0.15)',
        'rope-border': '0 0 0 3px rgba(140, 84, 37, 0.8)',
      },
    },
  },
  plugins: [typography],
}
