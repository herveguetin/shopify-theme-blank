/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: ["./**/*.{liquid,html,js}"],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      stone: colors.stone,
      red: colors.red,
      amber: colors.amber
    },
    extend: {
      fontFamily: {
        josefin: ['Josefin', 'sans-serif'],
        josefinlight: ['JosefinLight', 'sans-serif'],
        bodoni: ['Bodoni', 'serif'],
      }
    },
  },
  plugins: [],
}

