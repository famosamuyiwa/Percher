/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "plus-jakarta-regular": ["Plus-Jakarta-Regular", "sans-serif"],
        "plus-jakarta-medium": ["Plus-Jakarta-Medium", "sans-serif"],
        "plus-jakarta-light": ["Plus-Jakarta-Light", "sans-serif"],
        "plus-jakarta-extralight": ["Plus-Jakarta-ExtraLight", "sans-serif"],
        "plus-jakarta-bold": ["Plus-Jakarta-Bold", "sans-serif"],
        "plus-jakarta-semibold": ["Plus-Jakarta-SemiBild", "sans-serif"],
        "plus-jakarta-extrabold": ["Plus-Jakarta-ExtraBold", "sans-serif"],
      },
      colors: {
        primary: {
          100: "#0061FF0A",
          200: "#0061FF1A",
          300: "#0061FF",
        },
        accent: {
          100: "#FBFBFD",
        },
        black: {
          DEFAULT: "#000000",
          100: "#8C8E98",
          200: "#666876",
          300: "#191D31",
        },
        danger: "#F75555",
      },
    },
  },
  plugins: [],
};
