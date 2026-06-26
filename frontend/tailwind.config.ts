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
          DEFAULT: "#1C1B1B", // Deep charcoal black anchor
          container: "#2B2A2A",
        },
        surface: {
          DEFAULT: "#FFFFFF", // Base canvas
          dim: "#F4F4F4", // Soft light gray sectioning
          container: "#F1EDEC", // Container backgrounds
          low: "#F7F3F2",
          high: "#EBE7E6",
        },
        outline: {
          DEFAULT: "#747878",
          variant: "#C4C7C7", // Hairline borders
        },
        accent: {
          DEFAULT: "#2E4A62", // Tech blue highlights
        },
      },
      borderRadius: {
        none: "0px",
        sm: "0px",
        DEFAULT: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        "3xl": "0px",
        full: "0px", // Strict sharp style
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        editorial: "0 30px 60px -12px rgba(0, 0, 0, 0.04)", // Soft ambient shadow
      },
    },
  },
  plugins: [],
};
export default config;
