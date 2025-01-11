import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'

// Import default view component
import App from '../App.vue'

// Import all markdown files from the 'content' folder
const contentFiles = import.meta.glob('../content/**/*.md')

// Define routes
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
    component: defineAsyncComponent(() =>
      import('../components/MarkdownPage.vue').then((component) => ({
        ...component,
        props: {
          contentLoader: async () => (await contentFiles[filePath]()).default,
          title: fileName.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()),
        },
      })),
    ),
  })
})

// Create and export router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
