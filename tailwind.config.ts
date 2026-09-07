import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0D1117",
        surface: "#151A21",
        surface2: "#1C222B",
        border: "#262D38",
        text: "#E7EAEE",
        muted: "#8B93A1",
        accent: "#E8B94F",
        accentSoft: "#3A331E",
        success: "#4ADE80",
        danger: "#F87171",
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
      },
      borderRadius: {
        DEFAULT: "6px",
      },
    },
  },
  plugins: [],
};

export default config;
