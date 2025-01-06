import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      events: 'events',
      buffer: 'buffer',
    },
  },
  define: {
    'process.env': {}, // Mock environment variables for browser
  },
})
