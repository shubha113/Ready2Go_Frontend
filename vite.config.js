import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'firebase-messaging-sw.js') {
            return 'firebase-messaging-sw.js'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    },
    // Explicitly copy the service worker
    copyPublicDir: true
  },
  // Ensure service worker is copied
  publicDir: resolve(__dirname, 'public')
})