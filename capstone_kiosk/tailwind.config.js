import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
    "./storage/framework/views/*.php",
    "./resources/views/**/*.blade.php",
    "./resources/js/**/*.jsx",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Figtree", ...defaultTheme.fontFamily.sans],
      },

      keyframes: {
  "fade-out-top": {
    "0%": { opacity: "1", transform: "translateY(0)" },
    "100%": { opacity: "0", transform: "translateY(-120px)" },
  },
  "fade-out-bottom": {
    "0%": { opacity: "1", transform: "translateY(0)" },
    "100%": { opacity: "0", transform: "translateY(120px)" },
  },
  "fade-out-left": {
    "0%": { opacity: "1", transform: "translateX(0)" },
    "100%": { opacity: "0", transform: "translateX(-120px)" },
  },
  "fade-out-right": {
    "0%": { opacity: "1", transform: "translateX(0)" },
    "100%": { opacity: "0", transform: "translateX(120px)" },
  },
  "fade-in": {
    "0%": { opacity: "0", transform: "scale(0.95)" },
    "100%": { opacity: "1", transform: "scale(1)" },
  },
},
animation: {
  "fade-out-top": "fade-out-top 2s ease-in-out forwards",
  "fade-out-bottom": "fade-out-bottom 2s ease-in-out forwards",
  "fade-out-left": "fade-out-left 2s ease-in-out forwards",
  "fade-out-right": "fade-out-right 2s ease-in-out forwards",
  "fade-in": "fade-in 1s ease-in forwards",
},

    },
  },

  plugins: [forms],
};
