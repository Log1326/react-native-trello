/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        primary: '#1465de',
        grey: '#A6A3AF',
        fontLight: '#fff',
        fontDark: '#292929',
      }
    },
  },
  plugins: [],
}

