/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html'
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        navy: '#0F1E64',
        mint: '#50B699',
        orange: '#EC6B1A',
        charcoal: '#2C2C34',
        offwhite: '#F8F9FB',
        jetblack: '#121212',
        slate: '#6C7A89',
        success: '#3BB273',
        amber: '#FFB020',
        error: '#E74C3C',
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(180deg, #0F1E64 0%, #2C2C34 100%)',
      },
    },
  },
  plugins: [],
};
