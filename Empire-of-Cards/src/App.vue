<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// Import markdown files dynamically
const storyFiles = import.meta.glob('@/stories/**/*.md')
const loreFiles = import.meta.glob('@/lore/**/*.md')

// Define folder structure
type FileEntry = {
  name: string
  path: string
  content: string | null
}

type FolderStructure = {
  [folderName: string]: FileEntry[]
}

const folders = ref<{ [category: string]: FolderStructure }>({})
const selectedContent = ref<string | null>(null)

const loadFiles = async () => {
  const processFiles = async (
    files: Record<string, () => Promise<{ default: string }>>,
    category: string,
  ) => {
    for (const path in files) {
      const parts = path.split('/')
      const folderName = parts[2] // e.g., "src/stories/{folder}/{file}.md"
      if (!folders.value[category]) folders.value[category] = {}
      if (!folders.value[category][folderName]) folders.value[category][folderName] = []

      const fileName = parts[parts.length - 1].replace('.md', '')
      folders.value[category][folderName].push({
        name: fileName,
        path,
        content: null,
      })
    }
  }

  await processFiles(storyFiles, 'stories')
  await processFiles(loreFiles, 'lore')
}

const showMarkdownContent = async (filePath: string) => {
  const module = (await storyFiles[filePath]?.()) || loreFiles[filePath]?.()
  selectedContent.value = module?.default || 'Error loading content.'
}

// Load files when component is mounted
loadFiles()
</script>

<template>
  <header class="bg-blue-900 text-white shadow-md p-5">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <h1 class="text-2xl font-bold">Empire of Cards</h1>
    </div>
  </header>

  <main class="py-16 bg-gray-100">
    <div class="max-w-4xl mx-auto text-center px-6">
      <img src="@/assets/logo.png" alt="Empire of Cards Logo" class="w-48 h-48 mx-auto mb-6" />
      <h2 class="text-4xl font-bold mb-4">Welcome to the Empire of Cards</h2>
      <p class="text-lg text-gray-700 mb-6">
        Step into the world of Sahul, where history is shaped by feathers and fire.
      </p>
    </div>

    <section class="mt-16 bg-white py-12">
      <div class="max-w-4xl mx-auto px-6">
        <h3 class="text-3xl font-bold mb-6">Explore Stories and Lore</h3>

        <!-- Display folder structure for stories and lore -->
        <div class="grid grid-cols-1 gap-8">
          <div
            v-for="(foldersList, category) in folders"
            :key="category"
            class="bg-gray-50 p-6 rounded-lg shadow"
          >
            <h4 class="text-2xl font-semibold mb-4 capitalize">{{ category }}</h4>
            <div v-for="(files, folderName) in foldersList" :key="folderName" class="mb-4">
              <h5 class="text-lg font-bold">{{ folderName }}</h5>
              <ul class="list-disc list-inside">
                <li v-for="file in files" :key="file.path">
                  <button
                    @click="showMarkdownContent(file.path)"
                    class="text-blue-700 hover:underline focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    {{ file.name.replaceAll('-', ' ').replace(/^\w/, (c) => c.toUpperCase()) }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Display selected markdown content -->
        <div v-if="selectedContent" class="mt-10 prose bg-gray-50 p-6 rounded-lg shadow">
          <h3 class="text-xl font-semibold mb-4">Selected Content</h3>
          <article v-html="selectedContent"></article>
        </div>
      </div>
    </section>
  </main>
</template>
