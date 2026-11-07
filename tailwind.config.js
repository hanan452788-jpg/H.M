/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paw: {
          50: '#FDF8F3',
          100: '#FBF0E4',
          200: '#F7DFCA',
          300: '#F0C5A3',
          400: '#E79F6E',
          500: '#DE7E41',
          600: '#C96229',
          700: '#A74B1E',
          800: '#863C1D',
          900: '#6E321B',
        },
        sage: {
          50: '#F3F8F5',
          100: '#E3F0E8',
          200: '#C7E1D2',
          500: '#2E8B57',
          600: '#236D44',
          700: '#1B5434',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FAF8F5',
          200: '#F5EFEB',
          300: '#EBE2D8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(120, 80, 40, 0.08)',
        'soft-lg': '0 10px 30px -4px rgba(120, 80, 40, 0.12)',
        'soft-hover': '0 16px 36px -6px rgba(120, 80, 40, 0.16)',
      }
    },
  },
  plugins: [],
}

