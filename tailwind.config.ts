import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        ink: "#111111",
        canvas: "#ffffff",
        "soft-cloud": "#f5f5f5",
        charcoal: "#39393b",
        mute: "#707072",
        stone: "#9e9ea0",
        hairline: "#cacacb",
        "hairline-soft": "#e5e5e5",
        sale: "#d30005",
        success: "#007d48",
        info: "#1151ff",
      },
      borderRadius: { pill: "9999px", card: "0px", md2: "24px" },
      spacing: { section: "48px" },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;