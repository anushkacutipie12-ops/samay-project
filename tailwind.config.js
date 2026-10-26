/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        samay: {
          blue: '#1E3A8A',
          green: '#10B981',
          amber: '#F59E0B',
          red: '#EF4444',
          navy: '#0F172A',
          saffron: '#FF6F00'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
