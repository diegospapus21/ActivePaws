/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#fdf9f3',
          100: '#f5efe6',
          200: '#ede0d0',
          300: '#dfc9b0',
          400: '#ceaa87',
        },
        paw: {
          50:  '#fdf8ec',
          100: '#f9edd0',
          200: '#f2d89e',
          300: '#e8be63',
          400: '#dfa530',
          500: '#c9891a',
          600: '#a86d12',
          700: '#875210',
          800: '#6e4115',
          900: '#5c3614',
        },
        bark: {
          50:  '#f9f5f2',
          100: '#ede5dc',
          200: '#d8c9b8',
          300: '#bea48e',
          400: '#a07e63',
          500: '#8c6448',
          600: '#714e38',
          700: '#5c3d2e',
          800: '#4a3126',
          900: '#3d2820',
        },
      },
      fontFamily: {
        cursive: ['"Dancing Script"', 'cursive'],
        display: ['"Playfair Display"', 'serif'],
        body: ['"Nunito"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
