export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        darkblue: '#0A3A5A',
        deepSkyBlue: '#2C84D6',
        paleCyan: '#82D5F9',
        water: '#E7F6FF',
        lightGreen: '#B8F5C3',
        green: '#4CAF50',
        pink: '#FFC1D6',
        lightSalmon: '#FFA07A',
        gold: '#FFC107'
      },
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif']
      },
      boxShadow: {
        card: '0 8px 20px rgba(0,0,0,0.08)'
      }
    }
  }
}
