import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Ensure firebase-messaging-sw.js is in the build output
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'firebase-messaging-sw.js') {
            return 'firebase-messaging-sw.js'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})