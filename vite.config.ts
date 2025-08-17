import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('pixi')) return 'pixi';
            if (id.includes('fantastical')) return 'namegen';
            return 'vendor';
          }
        },
      },
    },
    //chunkSizeWarningLimit: 700,
  },
})