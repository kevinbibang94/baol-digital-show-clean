/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { xl: '1200px' },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          300: '#ffd2b8',
          400: '#ffb07a',
          500: '#ff6633',
          600: '#e6552a',
          700: '#cc4a22',
        },
      },
      boxShadow: {
        glow: '0 20px 80px rgba(255, 102, 51, 0.28)',
      },
      backgroundImage: {
        'grid-slate':
          'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
}

