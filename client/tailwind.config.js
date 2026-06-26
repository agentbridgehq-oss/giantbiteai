/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        ember: {
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
        },
        char: {
          950: "#0a0a0d",
          900: "#0e0e12",
          800: "#15151b",
          700: "#1f1f27",
        },
      },
      boxShadow: {
        glow: "0 0 60px -10px rgba(249,115,22,0.45)",
      },
    },
  },
  plugins: [],
};
