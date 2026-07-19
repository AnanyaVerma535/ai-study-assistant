/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#1B2129",
        },
        base: {
          DEFAULT: "#FAFAF8",
          dark: "#0F1419",
        },
        accent: {
          DEFAULT: "#4C7EFF",
          hover: "#3A6AE8",
        },
        warm: "#F5B942",
        danger: "#E5484D",
        "text-muted": "#8B93A1",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [],
};
