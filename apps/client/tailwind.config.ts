import { heroui } from "@heroui/react";
import { type Config } from "tailwindcss";

export default {
  content: ["../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  plugins: [heroui({})],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem"
      }
    }
  }
} as Config;
