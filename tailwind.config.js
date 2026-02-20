const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Alias Gray to Slate for better readability/premium feel
        gray: colors.slate,

        // Light Mode - Existing
        'surface': '#f5f5f5',
        'border': '#e0e0e0',
        'text-secondary': '#666666',

        // ============================================
        // PREMIUM DARK MODE PALETTE
        // Linear/Vercel/GitHub Dimmed Inspired
        // ============================================

        'dark': {
          // Canvas Backgrounds - Deep Matte Slate (Cool-toned)
          '950': '#0a0c10',  // Deepest - Sidebar/Nav
          '900': '#0d1017',  // Primary background
          '850': '#111520',  // Elevated background
          '800': '#161b26',  // Card/Surface base
          '750': '#1c2333',  // Card hover / Elevated surface
          '700': '#242d3d',  // Tertiary surface

          // Borders - Ultra subtle (not distracting)
          'border': 'rgba(148, 163, 184, 0.08)',
          'border-subtle': 'rgba(148, 163, 184, 0.05)',
          'border-accent': 'rgba(148, 163, 184, 0.12)',

          // ============================================
          // TYPOGRAPHY HIERARCHY
          // Increased Brightness for Better Readability
          // ============================================

          // High Emphasis (95% brightness) - Headings, Titles
          'text-primary': '#f8fafc',     // slate-50 - Primary headings

          // Medium Emphasis (85% brightness) - Body text, Data
          'text-secondary': '#e2e8f0',   // slate-200 - Body paragraphs

          // Low Emphasis (70% brightness) - Labels, Captions
          'text-tertiary': '#cbd5e1',    // slate-300 - Secondary info

          // Muted (55% brightness) - Placeholders, Disabled
          'text-muted': '#94a3b8',       // slate-400 - Hints, disabled

          // Very Muted (40% brightness) - Barely visible
          'text-faint': '#64748b',       // slate-500 - Decorative only
        },

        // Accent colors optimized for dark mode (softer saturation)
        'accent': {
          'blue': '#60a5fa',     // blue-400
          'indigo': '#818cf8',   // indigo-400
          'purple': '#a78bfa',   // purple-400
          'emerald': '#34d399',  // emerald-400
          'amber': '#fbbf24',    // amber-400
          'rose': '#fb7185',     // rose-400
          'cyan': '#22d3ee',     // cyan-400
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        // Dark mode shadows - subtle, no harsh edges
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
        'dark-glow': '0 0 20px rgba(99, 102, 241, 0.15)',
      },
      backgroundImage: {
        // Subtle gradients for dark mode surface elevation
        'dark-gradient': 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%)',
        'dark-radial': 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.05) 0%, transparent 50%)',
      }
    },
  },
  plugins: [],
}
