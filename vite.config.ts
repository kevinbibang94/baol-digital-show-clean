import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 👇 Ajout du fallback pour React Router
    historyApiFallback: true
  }
})
