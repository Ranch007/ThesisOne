import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { resolve } from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    ...(mode !== 'single'
      ? [
          VitePWA({
            registerType: 'autoUpdate',
            manifest: {
              name: '江大毕业论文排版工具',
              short_name: '论文排版',
              theme_color: '#ffffff',
              display: 'standalone',
              icons: [
                { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
                { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
              ],
            },
            workbox: {
              globPatterns: ['**/*.{js,css,html,woff2}'],
            },
          }),
        ]
      : []),
    ...(mode === 'single' ? [viteSingleFile()] : []),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/docx')) return 'vendor-docx'
          if (id.includes('node_modules/mammoth')) return 'vendor-mammoth'
        },
      },
    },
  },
}))
