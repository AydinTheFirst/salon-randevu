import { heroui } from "@heroui/react";
import { type Config } from "tailwindcss";

export default {
  content: [
    "../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        radius: {
          large: "0.5rem",
          medium: "0.375rem",
          small: "0.25rem"
        }
      }
    })
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem"
      }
    }
  }
} as Config;
