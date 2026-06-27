import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Boshqa qurilmalardan ham kirish mumkin
    // ✅ Proxy: /api → backend. Cookie same-origin bo'ladi, CORS muammo yo'q
    proxy: {
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // Cookie same-origin uchun
        cookieDomainRewrite: 'localhost',
      }
    }
  },
  optimizeDeps: {
    // Paket o'rnatilmasa ham build ishlasin — runtime'da dinamik import qilinadi
    exclude: ['jspdf', 'jspdf-autotable', 'chart.js', 'react-chartjs-2', 'date-fns', 'date-fns/locale']
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      // Paket o'rnatilmasa ham build xato bermasligi uchun — runtime'da dinamik import qilinadi
      external: (id) => {
        return ['jspdf', 'jspdf-autotable', 'chart.js', 'react-chartjs-2'].includes(id) ||
               id.startsWith('date-fns');
      },
    },
  }
})