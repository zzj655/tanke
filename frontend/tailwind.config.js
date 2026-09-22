/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        military: {
          bg: "#1a2e1a",
          primary: "#2d5016",
          accent: "#4a7c2c",
          highlight: "#8bb04a",
          text: "#e8f0d8",
          dim: "#7a9a5a",
        },
        desert: {
          bg: "#2b2200",
          primary: "#5c4416",
          accent: "#8b6914",
          highlight: "#daa520",
          text: "#f5e6c8",
          dim: "#9a8050",
        },
        forest: {
          bg: "#0d1f0d",
          primary: "#1a3d1a",
          accent: "#2d6a2d",
          highlight: "#5cb85c",
          text: "#d4e8d4",
          dim: "#5a8a5a",
        },
        simple: {
          bg: "#f5f5f5",
          primary: "#333333",
          accent: "#666666",
          highlight: "#0099cc",
          text: "#222222",
          dim: "#999999",
        },
        night: {
          bg: "#0a0a1a",
          primary: "#1a1a3a",
          accent: "#2a4a8a",
          highlight: "#5588dd",
          text: "#d0d0f0",
          dim: "#5a5a8a",
        },
      },
      fontFamily: {
        sans: ["'Microsoft YaHei'", "'SimHei'", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "shake": "shake 0.5s",
        "pulse-glow": "pulseGlow 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(139,176,74,0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(139,176,74,0.8)" },
        },
      },
    },
  },
  plugins: [],
}
