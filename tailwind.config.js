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
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.yellow.200'),
            h1: {
              color: theme('colors.feather-gold'),
              fontWeight: 'bold',
            },
            h2: {
              color: theme('colors.sunset-orange'),
            },
            h3: {
              color: theme('colors.cassowary-blue'),
            },
            a: {
              color: theme('colors.feather-gold'),
              textDecoration: 'underline',
              '&:hover': {
                color: theme('colors.sunset-orange'),
              },
            },
            strong: {
              color: theme('colors.feather-gold'),
            },
            code: {
              backgroundColor: theme('colors.earth-brown'),
              padding: '2px 4px',
              borderRadius: '4px',
              color: theme('colors.yellow.100'),
            },
          },
        },
        invert: {
          css: {
            '--tw-prose-body': theme('colors.stone.200'),
            '--tw-prose-headings': theme('colors.feather-gold'),
            '--tw-prose-links': theme('colors.sunset-orange'),
            '--tw-prose-bold': theme('colors.feather-gold'),
            '--tw-prose-captions': theme('colors.earth-brown'),
          },
        },
      }),
    },
  },
  plugins: [typography],
}
