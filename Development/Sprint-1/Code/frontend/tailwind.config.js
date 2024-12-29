/** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dashboardGray: '#C4C4C4',
        buttonGreen: '#28CD88',
        darkGray: '#666666'
      }
    },
  },
  plugins: [],
}
