const colors = require('tailwindcss/colors')
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/map/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      dark: 'colors.slate[900]',
      darkLight: 'colors.slate[700]',
      light: 'colors.slate[200]',
      white: 'colors.slate[50]',
      primary: 'colors.sky[600]',
      success: '#27C485',
      warning: '#F1B650',
      error: '#EC2D18',
      gray: '#DFD6D6',
      palePurple: '#CEC9DF'
    },
    extend: {
      fontSize: {
        base: ['18px', '24px'],
        small: ['16px', '20px']
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        manrope: ['var(--font-manrope)'],
      },
      display: ["group-hover"],
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        textSecondary: 'hsl(var(--text-secondary))',
        textPrimary: 'hsl(var(--text-primary))',
        borderPrimary: 'hsl(var(--border-primary))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      }
    },
    keyframes: {
      overlayShow: {
        from: {
          opacity: '0'
        },
        to: {
          opacity: '1'
        }
      },
      contentShow: {
        from: {
          opacity: '0',
          transform: 'translate(-50%, -48%) scale(0.96)'
        },
        to: {
          opacity: '1',
          transform: 'translate(-50%, -50%) scale(1)'
        }
      }
    },
    animation: {
      overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)'
    }
  },
  plugins: [require("tailwindcss-animate")]
};
