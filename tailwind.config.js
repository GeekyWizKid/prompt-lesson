/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Anthropic 风格色彩系统
        neutral: {
          50: '#fefdf9',
          100: '#fefcf6',
          200: '#fcf8f0',
          300: '#f7f0e4',
          400: '#e8dcc6',
          500: '#c9b99a',
          600: '#a89875',
          700: '#8b7958',
          800: '#6f6144',
          900: '#5c5037',
          950: '#1a1614',
        },
        orange: {
          50: '#fff8f4',
          100: '#ffeee6',
          200: '#ffd9c2',
          300: '#ffbc8f',
          400: '#ff9458',
          500: '#ff7043',
          600: '#f0541e',
          700: '#c6420e',
          800: '#9d3610',
          900: '#7e2f10',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'soft': '0 1px 2px 0 rgba(26, 22, 20, 0.04), 0 1px 3px 0 rgba(26, 22, 20, 0.06)',
        'elevated': '0 4px 8px 0 rgba(26, 22, 20, 0.08), 0 2px 4px 0 rgba(26, 22, 20, 0.06)',
        'floating': '0 8px 16px 0 rgba(26, 22, 20, 0.12), 0 4px 8px 0 rgba(26, 22, 20, 0.08)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}