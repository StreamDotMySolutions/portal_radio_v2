/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        dark: {
          'primary': '#0d6efd',
          'secondary': '#6c757d',
          'accent': '#0dcaf0',
          'neutral': '#212529',
          'base-100': '#1a1a1a',
          'base-200': '#212529',
          'base-300': '#2d2d2d',
          'info': '#0dcaf0',
          'success': '#198754',
          'warning': '#ffc107',
          'error': '#dc3545',
        },
      },
    ],
    darkTheme: 'dark',
  },
}
