import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        daydream: ["Daydream", "sans-serif"],
        "rumble": ["Rumble", "sans-serif"],
        popfun: ["Popfun", "sans-serif"],
        "super-funky": ["Super Funky", "sans-serif"],
      },
      colors: {
        light: {
          yellow: "#FFF501", 
          purple: "#AA9BFE",
          orange: "#FF8A00",
          green: "#36AF84",
          blue: "#0094FF",
          red: "#EA1718",
          "pink": "#E5A7BC",
          "salmon": "#F4CEC4",
          // purple: "#DECBF4" ,
          "purple-light" : "#F4F1E5",
          "text" : "#000000",
          "text-light" : "#F4F4F4",
        }
      }
    },
  },
  plugins: [],
};
export default config;
