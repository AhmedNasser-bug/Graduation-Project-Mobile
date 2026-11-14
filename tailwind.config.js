/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#EAF6FA',
        brand: {
          teal: '#12617A',
          dark: '#0B2E40',
          muted: '#5A7684',
          border: '#7BAEC4',
          accent: '#197693',
          light: '#F4FAFD'
        },
        badge: {
          highBg: '#FDE8E8',
          highText: '#C81E1E',
          highBorder: '#F8B4B4',
          medBg: '#EBF0FF',
          medText: '#1E40AF',
          optimal: '#0E9F6E',
          resolvedBg: '#E0E7FF',
          resolvedText: '#1E3A8A',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(11, 46, 64, 0.04)',
        'float': '0 8px 24px rgba(18, 97, 122, 0.25)',
      }
    },
  },
  plugins: [],
}
