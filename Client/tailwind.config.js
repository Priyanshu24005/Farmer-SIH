/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'serif'],
      },
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-soft': 'var(--color-surface-soft)',
        border: 'var(--color-border)',
        ink: 'var(--color-ink)',
        muted: 'var(--color-muted)',
        sidebar: 'var(--color-sidebar)',
        primary: 'var(--color-primary)',
        'on-primary': 'var(--color-on-primary)',
        accent: 'var(--color-accent)',
        'accent-soft': 'var(--color-accent-soft)',
        highlight: 'var(--color-highlight)',
      },
    },
  },
  plugins: [],
}