// frontend/tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  // Aquí le decimos a Tailwind que escanee todos tus archivos .tsx y .jsx en la carpeta src
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config