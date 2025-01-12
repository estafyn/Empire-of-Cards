<script setup lang="ts">
import { ref } from 'vue'
import TableOfContents from '@/components/TableOfContents.vue'
import MarkdownPage from '@/components/MarkdownPage.vue'
import ImageViewer from '@/components/ImageViewer.vue'

// State variables
const selectedFilePath = ref<string | null>('@/assets/content/Welcome.md')
const selectedTitle = ref<string>('Welcome')
const showSidebar = ref(true)

const showContent = (file: { filePath: string; fileName: string }) => {
  selectedFilePath.value = file.filePath
  selectedTitle.value = file.fileName.replace(/\.[^/.]+$/, '') // Remove extension for title
}
</script>

<template>
  <div class="min-h-screen bg-stone-800">
    <header
      class="bg-stone-900 text-yellow-300 shadow-md p-5 border-b-4 border-yellow-700 sticky top-0 z-50"
    >
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <button
          @click="showContent({ filePath: 'content/Welcome.md', fileName: 'Welcome.md' })"
          class="flex items-center gap-4"
        >
          <img src="/assets/logo.png" alt="Empire of Cards Logo" class="h-12 w-12" />
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
          <TableOfContents :selectedFilePath="selectedFilePath" @fileSelected="showContent" />
        </aside>

        <main class="flex-1">
          <div class="bg-stone-700 p-8 rounded-lg">
            <MarkdownPage
              v-if="selectedFilePath && selectedFilePath.endsWith('.md')"
              :filePath="selectedFilePath"
            />
            <ImageViewer
              v-else-if="
                selectedFilePath &&
                ['.png', '.jpg', '.webp'].some((ext) => selectedFilePath?.endsWith(ext))
              "
              :src="selectedFilePath"
              :alt="selectedTitle"
            />
            <div v-else class="text-center text-red-500">No content available.</div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
