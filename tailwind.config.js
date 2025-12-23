const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  experimental: {
    optimizeUniversalDefaults: true,
  },
  content: [
    './pages/**/*.js',
    './components/**/*.js',
    './layouts/**/*.js',
    './lib/**/*.js',
    './styles/**/*.css',
    './data/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        '9/16': '56.25%',
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        sans: ['Geist', 'InterVariable', ...defaultTheme.fontFamily.sans],
        mono: ['Geist Mono', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        // ============================================
        // SEMANTIC DESIGN TOKENS (CSS variables)
        // ============================================
        surface: {
          base: 'var(--color-surface-base)',
          elevated: 'var(--color-surface-elevated)',
          overlay: 'var(--color-surface-overlay)',
          inset: 'var(--color-surface-inset)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          muted: 'var(--color-text-muted)',
        },
        accent: {
          subtle: 'var(--color-accent-subtle)',
          emphasis: 'var(--color-accent-emphasis)',
          warm: 'var(--color-accent-warm)',
        },
        border: {
          DEFAULT: 'var(--color-border-default)',
          subtle: 'var(--color-border-subtle)',
          strong: 'var(--color-border-strong)',
          accent: 'var(--color-border-accent)',
        },
        interactive: {
          DEFAULT: 'var(--color-interactive-default)',
          hover: 'var(--color-interactive-hover)',
          active: 'var(--color-interactive-active)',
          disabled: 'var(--color-interactive-disabled)',
        },
        // ============================================
        // LEGACY TOKENS (for backwards compatibility)
        // ============================================
        // Warm Paper Design System
        paper: {
          // Light mode
          light: {
            bg: 'hsl(40, 30%, 97%)',
            card: 'hsl(40, 25%, 95%)',
            text: 'hsl(30, 15%, 15%)',
            muted: 'hsl(30, 10%, 40%)',
            border: 'hsl(35, 15%, 85%)',
            accent: 'hsl(35, 20%, 88%)',
          },
          // Dark mode - charcoal/ink
          dark: {
            bg: 'hsl(30, 5%, 10.5%)', // #1b1b1b
            card: 'hsl(30, 5%, 12%)', // #1e1e1e
            elevated: 'hsl(30, 5%, 14%)',
            text: 'hsl(40, 20%, 92%)',
            muted: 'hsl(40, 10%, 60%)',
            border: 'hsl(30, 5%, 20%)',
            accent: 'hsl(35, 15%, 25%)',
          },
        },
        // Warm brown for focus/accents
        warm: {
          50: 'hsl(35, 30%, 95%)',
          100: 'hsl(35, 25%, 90%)',
          200: 'hsl(35, 20%, 80%)',
          300: 'hsl(35, 18%, 70%)',
          400: 'hsl(35, 15%, 55%)',
          500: 'hsl(35, 15%, 45%)',
          600: 'hsl(35, 15%, 35%)',
          700: 'hsl(30, 20%, 25%)',
          800: 'hsl(30, 15%, 18%)',
          900: 'hsl(30, 10%, 12%)',
        },
        // Keep primary for backward compatibility, but warmer
        primary: {
          50: 'hsl(35, 30%, 95%)',
          100: 'hsl(35, 25%, 90%)',
          200: 'hsl(35, 20%, 80%)',
          300: 'hsl(35, 18%, 70%)',
          400: 'hsl(35, 15%, 55%)',
          500: 'hsl(35, 15%, 45%)',
          600: 'hsl(35, 15%, 35%)',
          700: 'hsl(30, 20%, 25%)',
          800: 'hsl(30, 15%, 18%)',
          900: 'hsl(30, 10%, 12%)',
          950: 'hsl(30, 8%, 8%)',
        },
        gray: colors.neutral,
        // Dark mode backgrounds
        dark: {
          bg: 'hsl(30, 5%, 10.5%)',
          card: 'hsl(30, 5%, 12%)',
          border: 'hsl(30, 5%, 20%)',
        },
      },
      backgroundImage: {
        // Subtle paper texture gradients
        'paper-texture': 'linear-gradient(135deg, hsl(40, 25%, 95%) 0%, hsl(35, 20%, 93%) 100%)',
        'ink-gradient': 'linear-gradient(135deg, hsl(30, 5%, 12%) 0%, hsl(30, 8%, 8%) 100%)',
        // Escher-inspired patterns
        'escher-lines': `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 2px,
          hsl(30, 5%, 20%) 2px,
          hsl(30, 5%, 20%) 4px
        )`,
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        // Escher-inspired animations
        'rotate-slow': 'rotate-slow 20s linear infinite',
        'rotate-reverse': 'rotate-reverse 25s linear infinite',
        morph: 'morph 8s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'draw-line': 'draw-line 2s ease-out forwards',
        tessellate: 'tessellate 12s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.8' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'rotate-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'draw-line': {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        tessellate: {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '25%': { transform: 'translateX(5px) translateY(-5px)' },
          '50%': { transform: 'translateX(0) translateY(-10px)' },
          '75%': { transform: 'translateX(-5px) translateY(-5px)' },
          '100%': { transform: 'translateX(0) translateY(0)' },
        },
      },
      boxShadow: {
        paper: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'paper-md': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'paper-lg': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: 'hsl(30, 15%, 15%)',
            a: {
              color: 'hsl(35, 15%, 35%)',
              '&:hover': {
                color: 'hsl(35, 20%, 25%)',
              },
              code: { color: 'hsl(35, 15%, 35%)' },
            },
            h1: {
              fontWeight: '600',
              letterSpacing: theme('letterSpacing.tight'),
              color: 'hsl(30, 15%, 15%)',
            },
            h2: {
              fontWeight: '600',
              letterSpacing: theme('letterSpacing.tight'),
              color: 'hsl(30, 15%, 15%)',
            },
            h3: {
              fontWeight: '600',
              color: 'hsl(30, 15%, 15%)',
            },
            'h4,h5,h6': {
              color: 'hsl(30, 15%, 15%)',
            },
            pre: {
              backgroundColor: 'hsl(30, 5%, 12%)',
            },
            code: {
              color: 'hsl(35, 15%, 35%)',
              backgroundColor: 'hsl(35, 20%, 90%)',
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            details: {
              backgroundColor: 'hsl(35, 20%, 90%)',
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
            },
            hr: { borderColor: 'hsl(35, 15%, 85%)' },
            'ol li::marker': {
              fontWeight: '600',
              color: 'hsl(30, 10%, 40%)',
            },
            'ul li::marker': {
              backgroundColor: 'hsl(30, 10%, 40%)',
            },
            strong: { color: 'hsl(30, 15%, 15%)' },
            blockquote: {
              color: 'hsl(30, 15%, 15%)',
              borderLeftColor: 'hsl(35, 15%, 85%)',
            },
          },
        },
        dark: {
          css: {
            color: 'hsl(40, 20%, 92%)',
            a: {
              color: 'hsl(35, 18%, 70%)',
              '&:hover': {
                color: 'hsl(40, 20%, 92%)',
              },
              code: { color: 'hsl(35, 18%, 70%)' },
            },
            h1: {
              fontWeight: '600',
              letterSpacing: theme('letterSpacing.tight'),
              color: 'hsl(40, 20%, 92%)',
            },
            h2: {
              fontWeight: '600',
              letterSpacing: theme('letterSpacing.tight'),
              color: 'hsl(40, 20%, 92%)',
            },
            h3: {
              fontWeight: '600',
              color: 'hsl(40, 20%, 92%)',
            },
            'h4,h5,h6': {
              color: 'hsl(40, 20%, 92%)',
            },
            pre: {
              backgroundColor: 'hsl(30, 5%, 12%)',
            },
            code: {
              backgroundColor: 'hsl(30, 5%, 18%)',
            },
            details: {
              backgroundColor: 'hsl(30, 5%, 18%)',
            },
            hr: { borderColor: 'hsl(30, 5%, 20%)' },
            'ol li::marker': {
              fontWeight: '600',
              color: 'hsl(40, 10%, 60%)',
            },
            'ul li::marker': {
              backgroundColor: 'hsl(40, 10%, 60%)',
            },
            strong: { color: 'hsl(40, 20%, 92%)' },
            thead: {
              th: {
                color: 'hsl(40, 20%, 92%)',
              },
            },
            tbody: {
              tr: {
                borderBottomColor: 'hsl(30, 5%, 20%)',
              },
            },
            blockquote: {
              color: 'hsl(40, 20%, 92%)',
              borderLeftColor: 'hsl(30, 5%, 25%)',
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
