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
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
        },
        char: {
          950: "#f8fafc",
          900: "#ffffff",
          800: "#e2e8f0",
          700: "#cbd5e1",
          600: "#94a3b8",
        },
      },
      boxShadow: {
        glow: "0 0 60px -10px rgba(244,63,94,0.35)",
      },
    },
  },
  plugins: [],
};
