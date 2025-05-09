/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6fffd',
          100: '#b3fffa',
          200: '#80fff7',
          300: '#4dfff4',
          400: '#1afff1',
          500: '#00e6d9', // Color principal de la marca (el turquesa/cyan brillante del logo)
          600: '#00b3a8',
          700: '#008077',
          800: '#004d46',
          900: '#001a15',
        },
        secondary: {
          DEFAULT: '#001c4d', // Azul oscuro para textos y elementos secundarios
        },
        neutral: {
          50: '#f8fafc',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
