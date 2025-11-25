import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/ogservers": {
        target: "https://lobby.ogame.gameforge.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ogservers/, ""),
      },
      "/ogapi": {
        target: "http://localhost:3001", // para universe.xml (proxy dinámico por server.js si lo usas)
        changeOrigin: true
      }
    },
  },
})
