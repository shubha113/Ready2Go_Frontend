import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'firebase-messaging-sw'
            ? 'firebase-messaging-sw.js'
            : 'assets/[name]-[hash].js'
        }
      }
    }
  },
  base: '/',
  // Use absolute path to public directory
  publicDir: resolve(__dirname, './Public')
})