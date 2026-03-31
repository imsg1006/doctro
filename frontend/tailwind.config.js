/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#ecfdf5',  // Light emerald/green background
          100: '#d1fae5', 
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Emerald accents
          600: '#059669',
          700: '#047857',
          800: '#18181b', // Black shade for bold text
          900: '#09090b', // Deep black for darkest text
        },
        primary: {
          50: '#f4f4f5',
          100: '#e4e4e7',
          200: '#d4d4d8',
          300: '#a1a1aa',
          400: '#71717a',
          500: '#27272a', // Button background (shade of black)
          600: '#18181b', // Button hover (deep black)
          700: '#09090b',
          800: '#000000',
          900: '#000000',
        },
        indigo: {
          50: '#f4f4f5',
          100: '#e4e4e7',
          200: '#d4d4d8',
          300: '#a1a1aa',
          400: '#71717a',
          500: '#27272a', // Secondary buttons
          600: '#18181b', 
          700: '#09090b',
          800: '#000000',
          900: '#000000',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
