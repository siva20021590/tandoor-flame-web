import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#fff8f1",
          100: "#ffecd6",
          200: "#ffd4a8",
          300: "#ffb370",
          400: "#ff8a3a",
          500: "#ef6a1c",
          600: "#d0510f",
          700: "#a63c0d",
          800: "#7c2c0c",
          900: "#5a1f08",
        },
        charcoal: {
          50: "#f7f6f4",
          100: "#e8e5e0",
          200: "#cbc5bb",
          300: "#a79e91",
          400: "#85796a",
          500: "#655c50",
          600: "#4b443b",
          700: "#35302a",
          800: "#1f1c19",
          900: "#120f0d",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-pattern":
          "radial-gradient(ellipse at top, rgba(239,106,28,0.15), transparent 60%), radial-gradient(ellipse at bottom, rgba(166,60,13,0.25), transparent 60%)",
      },
    },
  },
  plugins: [],
};
export default config;
