/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFD700',
          dark: '#CC9900',
          light: '#FFE680',
        },
        secondary: {
          DEFAULT: '#4B0082',
          dark: '#360060',
          light: '#8A2BE2',
        },
        background: {
          primary: '#121212',
          secondary: '#1E1E1E',
          tertiary: '#2A2A2A',
        },
        text: {
          light: '#FFFFFF',
          dark: '#000000',
          gray: '#808080',
        },
        status: {
          success: '#4CAF50',
          danger: '#F44336',
          warning: '#FF9800',
          info: '#2196F3',
          gold: '#FFD700',
        },
      },
      fontFamily: {
        regular: ['Poppins-Regular'],
        medium: ['Poppins-Medium'],
        bold: ['Poppins-Bold'],
        light: ['Poppins-Light'],
        semiBold: ['Poppins-SemiBold'],
      },
    },
  },
  plugins: [],
}
