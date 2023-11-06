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
      lime: colors.lime
    },
    extend: {
      fontFamily: {
        euphoria: ['Euphoria', 'cursive']
      }
    },
  },
  plugins: [],
}

