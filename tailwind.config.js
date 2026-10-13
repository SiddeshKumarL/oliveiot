/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4a7c59', // Forest Green
          container: '#78a886',
          fixed: '#c8e8d0',
        },
        secondary: {
          DEFAULT: '#6b6358', // Warm Grey/Brown
          container: '#f0e8db',
        },
        tertiary: {
          DEFAULT: '#705c30', // Warm Amber
          container: '#c4a66a',
        },
        background: {
          warm: '#faf6f0', // Warm Cream
          container: '#f0ece4',
          high: '#eae6de',
          highest: '#e4e0d8',
          low: '#f5f1ea',
          lowest: '#ffffff',
        },
        text: {
          main: '#2e3230',
          muted: '#4a4e4a',
        }
      },
      fontFamily: {
        serif: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'stitch': '12px',
      },
      boxShadow: {
        'stitch': '0 4px 20px rgba(46, 50, 48, 0.06)',
      }
    },
  },
  plugins: [],
}
