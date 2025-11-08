import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Allow access from other devices on the network
    proxy: {
      // Proxy API requests to the backend server during development
      '/api': {
        target: 'http://backend:6001',
        changeOrigin: true,
      },
    },
  },
})