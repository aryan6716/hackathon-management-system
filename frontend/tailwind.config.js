/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        dark: {
          950: '#0B0F1A',
          900: '#111626',
          800: '#171e36',
          700: '#1e2645',
          600: '#253055',
          500: '#2d3a68',
        },
        brand: {
          primary: '#7C5CFF',
          accent: '#00D4FF',
          success: '#22C55E',
          error: '#EF4444',
          violet: '#7C5CFF', // Kept for backwards compatibility
          blue: '#00D4FF', // Kept for backwards compatibility 
          purple: '#7C5CFF', // Kept for backwards compatibility
        },
        glass: {
          border: 'rgba(255, 255, 255, 0.1)',
          bg: 'rgba(255, 255, 255, 0.05)',
        }
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #7C5CFF 0%, #00D4FF 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(124,92,255,0.1) 0%, rgba(0,212,255,0.05) 100%)',
        'gradient-radial-purple': 'radial-gradient(ellipse at top left, rgba(124,92,255,0.15) 0%, transparent 60%)',
        'gradient-radial-blue': 'radial-gradient(ellipse at bottom right, rgba(0,212,255,0.1) 0%, transparent 60%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
        'brand': '0 4px 32px rgba(124,92,255,0.3)',
        'card-hover': '0 12px 48px rgba(124,92,255,0.2), 0 0 0 1px rgba(124,92,255,0.3)',
        'glow': '0 0 40px rgba(124,92,255,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'slide-in-left': 'slideInLeft 0.3s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'blob': 'blob 7s infinite',
        'gradient': 'gradient 15s ease infinite',
        'shake': 'shake 0.4s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '50%': { transform: 'translateX(4px)' },
          '75%': { transform: 'translateX(-2px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
