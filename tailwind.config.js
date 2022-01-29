module.exports = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: "0% 50%" },
          '50%': { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        gradient: "gradient 15s ease infinite"
      },
      backgroundImage: {
        "gradient-pattern": "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)"
      }
    },
  },
  plugins: [],
}
