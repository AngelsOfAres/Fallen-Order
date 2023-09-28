const colors = require('tailwindcss/colors')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
			colors: {
				cyan: colors.cyan,
        orange: colors.orange
			},
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
