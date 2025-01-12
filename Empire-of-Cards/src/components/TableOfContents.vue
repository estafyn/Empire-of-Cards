<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

type FileEntry = {
  name: string
  path: string
}

type FolderStructure = {
  rootFiles: FileEntry[]
  folders: {
    [key: string]: FileEntry[]
  }
}

// Props
defineProps<{ folderStructure: FolderStructure }>()

// Emits
const emit = defineEmits(['fileSelected'])

// Format title helper
const formatTitle = (text: string) => {
  return text.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
}

// Handle file selection
const selectFile = (filePath: string, fileName: string) => {
  emit('fileSelected', { filePath, fileName }) // Now `emit` is recognized
}
</script>

<template>
  <div class="p-6 overflow-y-auto h-full">
    <h3 class="text-2xl font-bold text-yellow-300 mb-6">Table of Contents</h3>

    <!-- Root Files -->
    <div v-if="folderStructure.rootFiles.length > 0" class="mb-8">
      <ul class="space-y-2">
        <li v-for="file in folderStructure.rootFiles" :key="file.path">
          <button
            @click="selectFile(file.path, file.name)"
            class="w-full text-left text-yellow-400 hover:text-yellow-200 hover:bg-yellow-600/20 px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-colors"
          >
            {{ formatTitle(file.name) }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Folders -->
    <div v-for="(files, folderName) in folderStructure.folders" :key="folderName" class="mb-6">
      <h5 class="text-lg font-bold text-yellow-300 mb-2 capitalize">
        {{ formatTitle(folderName.toString()) }}
      </h5>
      <ul class="space-y-2">
        <li v-for="file in files" :key="file.path">
          <button
            @click="selectFile(file.path, file.name)"
            class="w-full text-left text-yellow-400 hover:text-yellow-200 hover:bg-yellow-600/20 px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-colors pl-6"
          >
            {{ formatTitle(file.name) }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
