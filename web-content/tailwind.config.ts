import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        "base-gray": "#F3F3F3",
        "gray-slate-25": "#E7F6EC",
        "gray-slate-50": "#F0F2F5",
        "gray-slate-100": "#E8EAED",
        "gray-slate-200": "#F9FAFB",
        "gray-slate-300": "#D7DADF",
        "gray-slate-400": "#818B9C",
        "gray-slate-500": "#636C7E",
        "gray-slate-900/8": "#8A988AED",

        "black-slate-700": "#2D3139",
        "black-slate-800": "#20293A",
        "black-slate-900": "#0F172A",

        "blue-slate-600": "#1E5FAE",

        "white-slate-100/70": "#FFFFFFC2",

        "green-slate-50": "#ECFDF5",
        "green-slate-800": "#065F46",

        "red-slate-50": "#FEF3F2",
        "red-slate-800": "#991B1B",
      },
      boxShadow: {
        "1xl": "0 4px 4px -4px rgb(0 0 0 / 0.15)",
      },
      flex: {
        "0": "1 1 0%",
        "2": "1 1 25%",
        "3": "1 1 50%",
        "4": "1 1 100%",
        "5": "1 1 60%",
        "6": "1 1 40%",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "cs-bg": "url('../public/images/homepage.jpg')",
      },
      fontFamily: {
        sans: ["var(--font-metropolis)"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
} satisfies Config;
