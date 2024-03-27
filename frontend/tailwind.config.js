/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"),require("daisyui"), require('@tailwindcss/forms')],
  daisyui: {
    themes: ["dracula"]
  }
}

