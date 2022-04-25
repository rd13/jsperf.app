module.exports = {
  mode: 'jit', // https://v2.tailwindcss.com/docs/just-in-time-mode
  content: [
    './components/**/*.{js,jsx,ts,tsx,vue}',
    './pages/**/*.{js,jsx,ts,tsx,vue}',
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
