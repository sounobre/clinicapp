// Caminho: tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Habilitar o modo escuro baseado em classe
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}