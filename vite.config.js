import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // En dev, la API corre aparte en :8080. En producción la sirve el mismo dominio (Traefik o nginx).
    proxy: {
      '/api': 'http://localhost:8080',
      '/metrics': 'http://localhost:8080',
      '/healthz': 'http://localhost:8080',
    },
  }
})
