import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Explicitly handle firebase-messaging-sw.js
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'firebase-messaging-sw' 
            ? 'firebase-messaging-sw.js'
            : 'assets/[name]-[hash].js'
        }
      }
    }
  },
  // Ensure service worker is treated correctly
  base: '/'
})