import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // --- AÑADE ESTA SECCIÓN ---
  server: {
    host: true, // Necesario para que Docker exponga el servidor correctamente
    port: 5174, // Le decimos a Vite que este es su puerto oficial
    strictPort: true, // Hará que Vite falle si el puerto 5174 está ocupado, en lugar de intentar con otro
  }
})