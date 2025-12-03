/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: 'var(--color-neon-green)',
        void: 'var(--color-void)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'chaos': 'chaos 20s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        chaos: {
          '0%': { transform: 'translate(0, 0) rotate(0deg) scale(1)' },
          '20%': { transform: 'translate(30%, -20%) rotate(20deg) scale(1.2)' },
          '40%': { transform: 'translate(-20%, 30%) rotate(-20deg) scale(0.8)' },
          '60%': { transform: 'translate(30%, 30%) rotate(10deg) scale(1.1)' },
          '80%': { transform: 'translate(-30%, -30%) rotate(-10deg) scale(0.9)' },
          '100%': { transform: 'translate(0, 0) rotate(0deg) scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
