/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          deep: '#191a3d',
          DEFAULT: '#2e306a',
          light: '#4a4f9e',
          bright: '#6b72d6',
          dim: '#1e2048',
        },
        void: '#050507',
        panel: '#0b0b12',
        edge: 'rgba(255,255,255,0.07)',
        // Layered surfaces. Higher index reads as nearer the viewer.
        surface: {
          0: '#050507',
          1: '#08080e',
          2: '#0b0b12',
          3: '#101019',
          4: '#15161f',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        // Objects sitting on a surface: contact shadow + ambient falloff.
        rest: '0 1px 2px rgba(0,0,0,0.5), 0 8px 24px -12px rgba(0,0,0,0.9)',
        lift: '0 2px 4px rgba(0,0,0,0.5), 0 24px 56px -20px rgba(0,0,0,0.95)',
        deep: '0 40px 100px -32px rgba(0,0,0,1)',
        glow: '0 0 48px -12px rgba(74,79,158,0.55)',
        'glow-lg': '0 0 90px -16px rgba(74,79,158,0.6)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
