import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api-proxy': {
        target: 'https://api-uat.vinhomes.biz.vn/hovixi/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy/, ''),
        headers: {
          Origin: 'https://api-uat.vinhomes.biz.vn',
          Referer: 'https://api-uat.vinhomes.biz.vn/',
        },
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) {
              return 'vendor-mui';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            return 'vendor-others';
          }
        },
      },
    },
  },
})
