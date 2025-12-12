/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/index.tsx"
  ],
  presets: [require("nativewind/preset")],

  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        primary: {
          light: '#f7d794',
          default: '#ec8d22ff',
          dark: '#222222'
        },
        background: {
          light: '#f1f2f6',
          dark: '#333333',
          glass: 'rgba(0,0,0,0.2)',
          googleButton: '#e55039'
        },
        text: {
          light: '#ced6e0',
          dark: '#333333'
        }
      }
    },
  },
  plugins: [],
}

