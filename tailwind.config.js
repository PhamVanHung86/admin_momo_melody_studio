/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "pastel-pink": "#FFB7C5",
        "pastel-pink-light": "#FFD6E0",
        "pastel-yellow": "#FFF0A0",
        "pastel-blue": "#B8DEFF",
        "pastel-blue-light": "#D6EEFF",
        "bg-page": "#FFFAF5",
        "bg-card": "#FFF0F5",
        "text-main": "#4A4A6A",
      },
    },
  },
  plugins: [],
};
