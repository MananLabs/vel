/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vel: {
          void: '#050507',
          surface: '#0C0C10',
          elevated: '#12121A',
          panel: '#0F0F16',
          accent: '#6D5FFF',
          'accent-hover': '#7B6FFF',
          blue: '#3B82F6',
          teal: '#14B8A6',
          amber: '#F59E0B',
          green: '#22C55E',
          red: '#EF4444',
          pink: '#EC4899',
        },
      },
      fontFamily: {
        hero: ['"DotGothic16"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
      },
    },
  },
  plugins: [],
};
