<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MarkdownPage from '@/components/MarkdownPage.vue'

const contentFiles: Record<string, () => Promise<string>> = import.meta.glob('./content/**/*.md', {
  as: 'raw',
}) as unknown as Record<string, () => Promise<string>>

type FileEntry = {
  name: string
  path: string
  content: string | null
}

type FolderStructure = Record<string, FileEntry[]>

const folders = ref<Record<string, FolderStructure>>({})
const selectedContent = ref<string | null>(null)
const selectedTitle = ref<string | null>(null)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const showSidebar = ref(true)

const loadFiles = async () => {
  const processFiles = async (files: Record<string, () => Promise<string>>, category: string) => {
    for (const path in files) {
      const parts = path.split('/')
      const folderName = parts[2]

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

const showMarkdownContent = async (filePath: string, fileName: string) => {
  isLoading.value = true
  errorMessage.value = null
  selectedTitle.value = fileName.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())

  try {
    const markdownContent = await contentFiles[filePath]?.()
    selectedContent.value = markdownContent || 'Error: No content found.'
  } catch (error) {
    console.error('Error loading markdown file:', error)
    errorMessage.value = 'Error loading content. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadFiles)
</script>

<template>
  <div class="min-h-screen bg-stone-800">
    <!-- Header -->
    <header
      class="bg-stone-900 text-yellow-300 shadow-md p-5 border-b-4 border-yellow-700 sticky top-0 z-50"
    >
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center gap-4">
          <img
            src="@/assets/logo.png"
            alt="Empire of Cards Logo"
            class="h-12 w-12 rounded-full shadow-lg border-2 border-yellow-600"
          />
          <h1 class="text-4xl font-bold font-serif tracking-wider">Empire of Cards</h1>
        </div>
        <button
          @click="showSidebar = !showSidebar"
          class="md:hidden text-yellow-300 hover:text-yellow-200 transition-colors"
        >
          <span class="sr-only">Toggle Menu</span>
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="showSidebar"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>

    <!-- Main Content with Sidebar -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex gap-6 pt-6">
        <!-- Sidebar -->
        <aside
          :class="[
            'bg-stone-900 rounded-lg shadow-lg border border-yellow-700',
            showSidebar ? 'block' : 'hidden md:block',
            'w-full md:w-64 lg:w-80 flex-shrink-0',
            'transition-all duration-300 ease-in-out',
            'sticky top-24 h-[calc(100vh-6rem)]',
          ]"
        >
          <div class="p-6 overflow-y-auto h-full">
            <h3 class="text-2xl font-bold text-yellow-300 mb-6">Table of Contents</h3>
            <div v-for="(foldersList, category) in folders" :key="category">
              <h4 class="text-xl font-semibold mb-3 capitalize text-yellow-400">{{ category }}</h4>
              <div v-for="(files, folderName) in foldersList" :key="folderName" class="mb-6">
                <h5 class="text-lg font-bold text-yellow-300 mb-2">{{ folderName }}</h5>
                <ul class="space-y-2">
                  <li v-for="file in files" :key="file.path">
                    <button
                      @click="showMarkdownContent(file.path, file.name)"
                      class="w-full text-left text-yellow-400 hover:text-yellow-200 hover:bg-yellow-600/20 px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-colors"
                    >
                      {{ file.name.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) }}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 min-w-0">
          <div class="bg-stone-700 rounded-lg shadow-lg border border-yellow-600 p-8">
            <!-- Initial Welcome Content -->
            <div v-if="!selectedContent && !isLoading" class="text-center">
              <img
                src="@/assets/logo.png"
                alt="Empire of Cards Logo"
                class="w-32 h-32 mx-auto mb-6 rounded-full shadow-lg border-4 border-yellow-600"
              />
              <h2 class="text-4xl font-bold mb-4 font-serif text-yellow-300">
                Welcome to Sahul's Legacy
              </h2>
              <p class="text-xl mb-6 text-yellow-400">
                Where iron tracks meet the jungle, and legends are carved in steel and feathers.
              </p>
            </div>

            <!-- Loading and Error States -->
            <div v-if="isLoading" class="text-center text-yellow-300">Loading content...</div>
            <div v-if="errorMessage" class="text-center text-red-500">{{ errorMessage }}</div>

            <!-- Markdown Content -->
            <MarkdownPage
              v-if="selectedContent && !isLoading && selectedTitle"
              :content="selectedContent"
              :title="selectedTitle"
            />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
