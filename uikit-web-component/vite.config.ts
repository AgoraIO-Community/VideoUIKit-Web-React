import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/AgoraUIKitWebComponent.js`,
        chunkFileNames: `assets/AgoraUIKitWebComponent.js`,
        assetFileNames: `assets/AgoraUIKitWebComponent.css`
      }
    }
  }
})