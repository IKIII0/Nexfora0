// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}", // Arahkan ke semua file JS/JSX di folder client/src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
