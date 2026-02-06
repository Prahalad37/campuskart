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
        primary: {
          DEFAULT: "#0B1F3A",
          50: "#E8EBF0",
          100: "#D1D7E1",
          200: "#A3AFC3",
          300: "#7587A5",
          400: "#475F87",
          500: "#0B1F3A",
          600: "#09192E",
          700: "#071323",
          800: "#050D17",
          900: "#02060C",
        },
        secondary: {
          DEFAULT: "#2E3A4A",
          50: "#EEF0F2",
          100: "#DDE0E5",
          200: "#BBC1CB",
          300: "#99A2B1",
          400: "#778397",
          500: "#2E3A4A",
          600: "#252E3B",
          700: "#1C232C",
          800: "#13171E",
          900: "#0A0C0F",
        },
        accent: {
          DEFAULT: "#C6A96B",
          50: "#F8F5EF",
          100: "#F1EBDF",
          200: "#E3D7BF",
          300: "#D5C39F",
          400: "#C7AF7F",
          500: "#C6A96B",
          600: "#9E8756",
          700: "#776540",
          800: "#4F432B",
          900: "#282215",
        },
        background: {
          DEFAULT: "#F7F8FA",
          dark: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "100": "25rem",
        "112": "28rem",
        "128": "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(11, 31, 58, 0.08)",
        card: "0 2px 8px 0 rgba(11, 31, 58, 0.12)",
        elevated: "0 4px 16px 0 rgba(11, 31, 58, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;
