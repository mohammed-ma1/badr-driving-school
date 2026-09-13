/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Primary ramp is pulled from the training car itself (a vivid traffic
        // orange), so the site and the car in the street read as one brand.
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        // brand-500 is too light to carry white text at body sizes, so anything
        // sitting on it uses this near-black instead.
        'on-brand': '#2a1206',
        // Asphalt tones for the dark "road" sections (exam, stats, footer).
        asphalt: {
          700: '#22262e',
          800: '#181b21',
          900: '#0f1115',
        },
        ink: '#0c0a09',
      },
      fontFamily: {
        sans: ['Tajawal', 'Cairo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Tajawal has no Latin design of its own; phone numbers and Latin copy
        // read better in Open Sans.
        latin: ['"Open Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(120, 60, 20, 0.18)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.06)',
        lifted: '0 24px 60px -24px rgba(120, 60, 20, 0.35)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'slide-down': { '0%': { opacity: '0', transform: 'translateY(-8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        // The mobile drawer enters from the reading-start edge; RTL flips the sign.
        'slide-in-start': { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        // Dashed lane markings running under the hero.
        'lane-scroll': { '0%': { backgroundPosition: '0 0' }, '100%': { backgroundPosition: '-120px 0' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        'ping-slow': { '0%': { transform: 'scale(1)', opacity: '0.5' }, '100%': { transform: 'scale(1.9)', opacity: '0' } },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out both',
        'slide-down': 'slide-down 0.2s ease-out both',
        'slide-in-start': 'slide-in-start 0.3s ease-out both',
        'lane-scroll': 'lane-scroll 1.2s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
};
