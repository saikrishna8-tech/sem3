/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdfbf7',
          100: '#fbf5eb',
          200: '#f5e8d1',
          300: '#edd6ae',
          400: '#e3be83',
          500: '#daa25f',
          600: '#ce8845',
          700: '#ac6937',
          800: '#8c5533',
          900: '#72472d',
          950: '#3e2215',
        },
        navy: {
          700: '#1e293b',
          800: '#0f172a',
          900: '#020617',
        },
        gold: {
          DEFAULT: '#daa25f',
          light: '#f5e8d1',
          dark: '#ac6937',
        }
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'white-gold': 'linear-gradient(135deg, #ffffff 0%, #fdfbf7 50%, #f5e8d1 100%)',
        'navy-gold': 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #3e2215 100%)',
      }
    },
  },
  plugins: [],
}
