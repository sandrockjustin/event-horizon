/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './client/**/*.html',
    './client/**/*.js',
    './client/**/*.jsx',
    './client/**/*.ts',
    './client/**/*.tsx',
    './node_modules/react-toastify/dist/ReactToastify.css',
  ],
  safelist: ['bg-${color}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#080942',
        secondary: '#472151',
        third: '#624185',
        fourth: '#f2ad73',
        fifth: '#ffa345',
        purple: {
          1: '#3c1d8a',
        },
        gray: '#8A8E91',
        colorblind: {
          primary: '#1f78b4', // blue
          secondary: '#33a02c', // green
          accent: '#ff7f00', // orange
          background: '#f7f7f7', // light gray
          text: '#000000', // black
        },
      },
    },
  },
  plugins: [],
};

// normal space themes
// #3b2747
// #472151
// #624185
// #f2ad73	
// #ffa345
//
// color blind theme