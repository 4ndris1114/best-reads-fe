import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#1D1617", // Dark background
        surface: "#262630", // Slightly lighter dark
        primary: "#2A374D", // Deep blueish shade
        secondary: "#444A41", // Muted green-gray
        accent: "#9F6932", // Warm brown-orange
        highlight: "#522623", // Dark reddish-brown
      },
    },
  },
};

export default config;
