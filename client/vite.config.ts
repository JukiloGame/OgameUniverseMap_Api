import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // todas las peticiones a /ogame se redirigen al servidor real
      '/ogame': {
        target: 'https://s267-es.ogame.gameforge.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/ogame/, ''),
      },
    },
  },
})
