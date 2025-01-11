import { createRouter, createWebHistory } from 'vue-router'

// Import default view components
import App from '../App.vue'

// Import all markdown files from the 'content' folder
const contentFiles = import.meta.glob('../content/**/*.md')

const routes = [
  {
    path: '/',
    component: App,
  },
]

// Add dynamic routes for markdown files
Object.keys(contentFiles).forEach((filePath) => {
  const fileName = filePath.split('/').pop()?.replace('.md', '') || 'unknown'
  const folderPath = filePath.split('/')[2] // e.g., `lore`, `stories`

  routes.push({
    path: `/${folderPath}/${fileName}`,
    name: `${folderPath}-${fileName}`,
    component: async () => {
      const markdownModule = await contentFiles[filePath]()
      return {
        template: `<article class="prose max-w-none bg-white p-6 rounded-lg shadow"><h2 class="text-3xl font-bold mb-4">${fileName.replaceAll('-', ' ').replace(/^\w/, (c) => c.toUpperCase())}</h2><div v-html="content"></div></article>`,
        data() {
          return {
            content: markdownModule.default,
          }
        },
      }
    },
  })
})

// Create router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
