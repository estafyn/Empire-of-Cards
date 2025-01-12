import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(), // Add dev tools plugin
  ],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  assetsInclude: ['**/*.md'], // Ensures markdown files can be imported
})
