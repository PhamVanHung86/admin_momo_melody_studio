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

      keyframes: {
        bloom: {
          "0%": { transform: "scale(0.82)", opacity: "0.75" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        pulseCenter: {
          "0%, 100%": { r: "16" },
          "50%": { r: "19" },
        },
      },
      animation: {
        "spin-slow": "spin 4.5s linear infinite", // dùng lại keyframe "spin" có sẵn của Tailwind
        bloom: "bloom 1.4s ease-in-out infinite alternate",
        "pulse-center": "pulseCenter 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
