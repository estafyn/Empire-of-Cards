import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(), // Only enable in dev mode
  ],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  assetsInclude: ['**/*.md', '**/*.png', '**/*.jpg', '**/*.webp'], // Include markdown and images
})
