<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MarkdownPage from '@/components/MarkdownPage.vue'
import TableOfContents from '@/components/TableOfContents.vue'

const contentFiles: Record<string, () => Promise<string>> = import.meta.glob('./content/**/*.md', {
  query: '?raw',
  import: 'default',
}) as unknown as Record<string, () => Promise<string>>

type FileEntry = {
  name: string
  path: string
  content: string | null
}

type FolderStructure = {
  rootFiles: FileEntry[]
  folders: {
    [key: string]: FileEntry[]
  }
}

const folderStructure = ref<FolderStructure>({
  rootFiles: [],
  folders: {},
})

const defaultFilePath = './content/Welcome.md'
const selectedContent = ref<string | null>(null)
const selectedTitle = ref<string>('Welcome')
const selectedFilePath = ref<string | null>(defaultFilePath) // Track the currently selected file path
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const showSidebar = ref(true)

const loadFiles = async () => {
  try {
    const newStructure: FolderStructure = {
      rootFiles: [],
      folders: {},
    }

    for (const path in contentFiles) {
      const parts = path.split('/')
      const fileName = parts[parts.length - 1].replace('.md', '')

      if (parts.length <= 3) {
        newStructure.rootFiles.push({ name: fileName, path, content: null })
      } else {
        const folderName = parts[2]
        if (!newStructure.folders[folderName]) {
          newStructure.folders[folderName] = []
        }
        newStructure.folders[folderName].push({ name: fileName, path, content: null })
      }
    }

    newStructure.rootFiles.sort((a, b) => a.name.localeCompare(b.name))
    for (const folder in newStructure.folders) {
      newStructure.folders[folder].sort((a, b) => a.name.localeCompare(b.name))
    }

    folderStructure.value = newStructure

    // Load welcome.md as the initial content
    const markdownContent = await contentFiles[defaultFilePath]?.()
    selectedContent.value = markdownContent || 'Error: No welcome content found.'
  } catch (error) {
    console.error('Error loading files:', error)
    errorMessage.value = 'Error loading file structure.'
  }
}

const showMarkdownContent = async ({
  filePath,
  fileName,
}: {
  filePath: string
  fileName: string
}) => {
  isLoading.value = true
  errorMessage.value = null
  selectedTitle.value = fileName
  selectedFilePath.value = filePath // Set the selected file path to highlight the item

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
    <header
      class="bg-stone-900 text-yellow-300 shadow-md p-5 border-b-4 border-yellow-700 sticky top-0 z-50"
    >
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <button
          @click="() => showMarkdownContent({ filePath: defaultFilePath, fileName: 'Welcome' })"
          class="flex items-center gap-4"
        >
          <img src="@/assets/logo.png" alt="Empire of Cards Logo" class="h-12 w-12" />
          <h1 class="text-4xl font-bold">Empire of Cards</h1>
        </button>
        <button @click="showSidebar = !showSidebar" class="md:hidden text-yellow-300">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="showSidebar" d="M6 18L18 6M6 6l12 12" />
            <path v-else d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex gap-6 pt-6">
        <aside class="bg-stone-900 w-64 rounded-lg shadow-lg">
          <TableOfContents
            :folderStructure="folderStructure"
            :selectedFilePath="selectedFilePath"
            @fileSelected="showMarkdownContent"
          />
        </aside>

        <main class="flex-1">
          <div class="bg-stone-700 p-8 rounded-lg">
            <MarkdownPage
              v-if="selectedContent"
              :content="selectedContent"
              :title="selectedTitle"
            />
            <div v-if="isLoading" class="text-center">Loading content...</div>
            <div v-if="errorMessage" class="text-center text-red-500">{{ errorMessage }}</div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
