module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: '#6366f1', // indigo-500
          dark: '#4f46e5', // indigo-700
        },
      },
      borderRadius: {
        'xl': '1rem',
      },
    },
  },
  safelist: ['dark', 'light'],
  plugins: [],
};
