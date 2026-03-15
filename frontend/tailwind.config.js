/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neural-purple': '#6B4EFF',
        'neural-mid':    '#8e86ff',
        'neural-gold':   '#FFB347',
        'synapse-cyan':  '#00CFFF',
        'deep-space':    '#05041A',
      },
    },
  },
  plugins: [],
}
