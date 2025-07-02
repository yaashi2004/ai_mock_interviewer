import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',        // App Router pages and layouts
    './components/**/*.{ts,tsx}', // Reusable UI components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
