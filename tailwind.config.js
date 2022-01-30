module.exports = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'silver-chalice': {  DEFAULT: '#A1A1A1',  '50': '#FDFDFD',  '100': '#F3F3F3',  '200': '#DEDEDE',  '300': '#CACACA',  '400': '#B5B5B5',  '500': '#A1A1A1',  '600': '#858585',  '700': '#696969',  '800': '#4D4D4D',  '900': '#313131'},
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: "0% 50%" },
          '50%': { backgroundPosition: "100% 50%" },
        },
        click: {
          '0%, 100%': { transform: "scale(1)" },
          '50%': { transform: "scale(0.97)" }
        }
      },
      animation: {
        gradient: "gradient 15s ease infinite",
        click: "click 200ms ease-in-out"
      },
      backgroundImage: {
        "gradient-pattern": "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)"
      }
    },
  },
  plugins: [],
}
