module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['active','disabled'], //This has been added to support for active Pseudo-class in tailwind.css,
      textColor:['disabled'],
      cursor:['disabled']
    },
  },
  plugins: [],
}
