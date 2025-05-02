/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        dmSans: ['DM Sans', 'sans-serif'],
        cormorantGaramond: ['Cormorant Garamond', 'serif'],
        specialGothic: ['Special Gothic Expanded One', 'sans-serif'],
        sofiaSans: ['Sofia Sans Semi Condensed', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        ctaButton: 'var(--color-ctaButton)',
        darkGreen: 'var(--color-darkGreen)',
        gradientDarkGreen: 'var(--color-gradientDarkGreen)',
        gradientLightGreen: 'var(--color-gradientLightGreen)',
        ash: 'var(--color-ash)',
        lightAsh: 'var(--color-lightAsh)',
      },
    },
  },
  plugins: [],
} 