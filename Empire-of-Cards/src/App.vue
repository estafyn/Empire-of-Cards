<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Import markdown files dynamically
const contentFiles: Record<string, () => Promise<{ default: string }>> = import.meta.glob(
  './content/**/*.md',
) as Record<string, () => Promise<{ default: string }>>

// **Type Declarations**
type FileEntry = {
  name: string
  path: string
  content: string | null
}

type FolderStructure = Record<string, FileEntry[]>

// **Reactive State**
const folders = ref<Record<string, FolderStructure>>({})
const selectedContent = ref<string | null>(null)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

// **Helper Function to Load Markdown Files**
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

// **Function to Load and Display Markdown Content**
const showMarkdownContent = async (filePath: string) => {
  isLoading.value = true
  errorMessage.value = null

  try {
    const module = await contentFiles[filePath]?.()
    selectedContent.value = module?.default || 'Error: No content found.'
  } catch (error) {
    errorMessage.value = 'Error loading content. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// **Load Files on Mount**
onMounted(loadFiles)
</script>

<template>
  <!-- Header Section -->
  <header class="bg-stone-900 text-yellow-300 shadow-md p-5 border-b-4 border-yellow-700">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <h1 class="text-4xl font-bold font-serif tracking-wider">Empire of Cards</h1>
    </div>
  </header>

  <!-- Main Section -->
  <main class="py-16 bg-stone-800 text-yellow-200">
    <div class="max-w-4xl mx-auto text-center px-6">
      <img
        src="@/assets/logo.png"
        alt="Empire of Cards Logo"
        class="w-40 h-40 mx-auto mb-6 rounded-full shadow-lg border-4 border-yellow-600"
      />
      <h2 class="text-5xl font-bold mb-4 font-serif text-yellow-300">Welcome to Sahul's Legacy</h2>
      <p class="text-xl mb-6 text-yellow-400">
        Where iron tracks meet the jungle, and legends are carved in steel and feathers.
      </p>
    </div>

    <!-- Content Section -->
    <section class="mt-16 bg-stone-700 py-12 rounded-xl shadow-xl border border-yellow-600">
      <div class="max-w-4xl mx-auto px-6">
        <h3 class="text-3xl font-bold mb-6 font-serif text-yellow-200">Explore Stories and Lore</h3>

        <!-- Folder Structure Display -->
        <div class="grid grid-cols-1 gap-8">
          <div
            v-for="(foldersList, category) in folders"
            :key="category"
            class="bg-stone-800 p-6 rounded-lg shadow-lg border border-yellow-500"
          >
            <h4 class="text-2xl font-semibold mb-4 capitalize text-yellow-300">{{ category }}</h4>
            <div v-for="(files, folderName) in foldersList" :key="folderName" class="mb-4">
              <h5 class="text-lg font-bold text-yellow-400">{{ folderName }}</h5>
              <ul class="list-disc list-inside">
                <li v-for="file in files" :key="file.path">
                  <button
                    @click="showMarkdownContent(file.path)"
                    class="text-yellow-400 hover:text-yellow-200 hover:bg-yellow-600 px-2 py-1 rounded-md focus:outline-none focus:ring focus:ring-yellow-300 transition-colors"
                  >
                    {{ file.name.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="mt-10 text-center text-yellow-300">Loading content...</div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-10 text-center text-red-500">{{ errorMessage }}</div>

        <!-- Markdown Content Display -->
        <div
          v-if="selectedContent && !isLoading"
          class="mt-10 prose bg-stone-900 text-yellow-300 p-6 rounded-lg shadow-lg border border-yellow-600"
        >
          <h3 class="text-xl font-semibold mb-4">Selected Content</h3>
          <article v-html="selectedContent"></article>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Responsive styling for mobile and larger screens */
img {
  max-width: 100%;
  height: auto;
}

button {
  @apply font-semibold transition-colors duration-300;
}
</style>
