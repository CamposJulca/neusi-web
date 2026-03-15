import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  // En build de producción los assets quedan en /static/react/assets/...
  // En dev el servidor Vite sirve todo desde /
  base: command === 'build' ? '/static/react/' : '/',

  plugins: [react()],

  server: {
    host: '0.0.0.0',
    port: 8073,
    proxy: {
      // Proxiar API de contacto al Django backend
      '/contacto/': {
        target: 'http://localhost:8070',
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: '../neusi_backend/static/react',
    emptyOutDir: true,
  },
}))
