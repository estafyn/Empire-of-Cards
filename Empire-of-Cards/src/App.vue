<script setup lang="ts">
import { ref } from 'vue'

// Import markdown files dynamically
const contentFiles: Record<string, () => Promise<{ default: string }>> = import.meta.glob(
  '@/content/**/*.md',
) as Record<string, () => Promise<{ default: string }>>

// Define types
type FileEntry = {
  name: string
  path: string
  content: string | null
}

type FolderStructure = {
  [folderName: string]: FileEntry[]
}

// Reactive data
const folders = ref<{ [category: string]: FolderStructure }>({})
const selectedContent = ref<string | null>(null)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

// Load files and organize folder structure
const loadFiles = async () => {
  const processFiles = async (
    files: Record<string, () => Promise<{ default: string }>>,
    category: string,
  ) => {
    for (const path in files) {
      const parts = path.split('/')
      const folderName = parts[2] // e.g., "src/content/{folder}/{file}.md"
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

  await processFiles(contentFiles, 'content')
}

// Show markdown content
const showMarkdownContent = async (filePath: string) => {
  isLoading.value = true
  errorMessage.value = null
  try {
    const module = (await contentFiles[filePath]?.()) as { default: string }
    selectedContent.value = module.default || 'Error: No content found.'
  } catch (error) {
    errorMessage.value = 'Error loading content. Please try again.'
  } finally {
    isLoading.value = false
  }
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

        <!-- Display folder structure for content -->
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
                    {{ file.name.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Display loading state -->
        <div v-if="isLoading" class="mt-10 text-center text-blue-700">Loading content...</div>

        <!-- Display error message -->
        <div v-if="errorMessage" class="mt-10 text-center text-red-500">
          {{ errorMessage }}
        </div>

        <!-- Display selected markdown content -->
        <div
          v-if="selectedContent && !isLoading"
          class="mt-10 prose bg-gray-50 p-6 rounded-lg shadow"
        >
          <h3 class="text-xl font-semibold mb-4">Selected Content</h3>
          <article v-html="selectedContent"></article>
        </div>
      </div>
    </section>
  </main>
</template>
