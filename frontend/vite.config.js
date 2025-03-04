import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://backend:3000',
        changeOrigin: true
      },
      '/auth': {
        target: 'http://backend:3000',
        changeOrigin: true
      }
    }
  },
  // Isso é importante para o Vue Router funcionar no modo history
  build: {
    // gera arquivo 404.html que redirecionará para index.html
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})