/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#8b5cf6',    // Purple - Tech feel
        secondary: '#ec4899',  // Pink - Energy
        accent: '#06b6d4'      // Cyan - Laboratory feel
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}
