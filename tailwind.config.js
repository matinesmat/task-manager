/* eslint-disable @typescript-eslint/no-require-imports */
const twAnimate = require("tw-animate-css");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border:     "oklch(var(--border) / <alpha-value>)",
        input:      "oklch(var(--input) / <alpha-value>)",
        ring:       "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",

        primary: {
          DEFAULT:   "oklch(var(--primary) / <alpha-value>)",
          foreground:"oklch(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT:   "oklch(var(--secondary) / <alpha-value>)",
          foreground:"oklch(var(--secondary-foreground) / <alpha-value>)",
        },

        /* add accent, muted, destructive, sidebar, chart‑N the same way */
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [twAnimate],
};
