/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1F1B17',
        bg: '#F8F6F3',
        "bg-light": '#F0EDE8',
        accent: '#B8863A',
        surface: '#FFFFFF',
        "surface-muted": '#F0EDE8',
        muted: '#8A8580',
        surabaya: {
          gold: '#B8863A',
          red: '#8B1A1A',
          orange: '#D4722A',
          cream: '#F5E6D3',
          dark: '#1A1512',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        wider: '0.05em',
        widest: '0.1em',
      },
    },
  },
  plugins: [],
};
