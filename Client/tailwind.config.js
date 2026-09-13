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
        // Clean modern sans for Admin headings/KPIs (Fraunces webfont is not
        // loaded; fell back to generic serif). Admin-only token in practice.
        display: ['"Segoe UI"', 'system-ui', '-apple-system', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-soft': 'var(--color-surface-soft)',
        border: 'var(--color-border)',
        ink: 'var(--color-ink)',
        muted: 'var(--color-muted)',
        sidebar: 'var(--color-sidebar)',
        primary: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
        'on-primary': 'var(--color-on-primary)',
        accent: 'rgb(var(--color-accent-rgb) / <alpha-value>)',
        'accent-soft': 'rgb(var(--color-accent-soft-rgb) / <alpha-value>)',
        highlight: 'var(--color-highlight)',
      },
    },
  },
  plugins: [],
}