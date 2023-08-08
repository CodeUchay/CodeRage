/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          100: "#ede4fe",
          200: "#dbcafd",
          300: "#c9affd",
          400: "#b795fc",
          500: "#a57afb",
          600: "#8462c9",
          700: "#634997",
          800: "#423164",
          900: "#211832",
        },
      },
    },
  },
  plugins: [],
};
