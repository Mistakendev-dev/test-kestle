/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#2e306a',
          light: '#4a4f9e',
          bright: '#6b72d6',
          dim: '#1e2048',
        },
        void: '#050507',
        panel: '#0b0b12',
        edge: 'rgba(255,255,255,0.07)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
