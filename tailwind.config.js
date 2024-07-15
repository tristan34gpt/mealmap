/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-700": "#1A56DB",
        "primary-600": "#1C64F2",
        "primary-500": "#3F83F8",
      },
      backgroundImage: {},
    },
  },
  plugins: [],
};
