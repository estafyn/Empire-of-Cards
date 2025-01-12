<script setup lang="ts">
// Type definitions for files and folder structure
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
defineProps<{ folderStructure: FolderStructure; selectedFilePath: string | null }>()

// Emits
const emit = defineEmits(['fileSelected'])

// Format title helper function
const formatTitle = (text: string): string => {
  return text.replace(/\..*/g, ' ')
}

// Handle file selection event
const selectFile = (filePath: string, fileName: string): void => {
  emit('fileSelected', { filePath, fileName })
}
</script>

<template>
  <div class="p-6 overflow-y-auto h-full">
    <h3 class="text-2xl font-bold text-yellow-300 mb-6">Table of Contents</h3>

    <!-- Fallback message if no files are found -->
    <p
      v-if="!folderStructure.rootFiles.length && !Object.keys(folderStructure.folders).length"
      class="text-yellow-400"
    >
      No files found.
    </p>

    <!-- Root Files List -->
    <div v-if="folderStructure.rootFiles.length > 0" class="mb-8">
      <ul class="space-y-2">
        <li v-for="file in folderStructure.rootFiles" :key="file.path">
          <button
            @click="selectFile(file.path, file.name)"
            :aria-current="file.path === selectedFilePath ? 'page' : false"
            :class="{
              'border-4 border-yellow-400 bg-yellow-700/20': file.path === selectedFilePath,
              'hover:bg-yellow-600/20 ': file.path !== selectedFilePath,
            }"
            class="w-full text-left px-3 py-1.5 rounded-md transition-colors text-yellow-400"
          >
            <span v-if="file.name.match(/\.(png|jpg|webp)$/)">🖼️</span>
            {{ formatTitle(file.name) }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Folder Lists -->
    <div v-for="(files, folderName) in folderStructure.folders" :key="folderName" class="mb-6">
      <h5 class="text-lg font-bold text-yellow-300 mb-2 capitalize">
        {{ formatTitle(folderName.toString()) }}
      </h5>
      <ul class="space-y-2">
        <li v-for="file in files" :key="file.path">
          <button
            @click="selectFile(file.path, file.name)"
            :aria-current="file.path === selectedFilePath ? 'page' : false"
            :class="{
              'border-4 border-yellow-400 bg-yellow-700/20': file.path === selectedFilePath,
              'hover:bg-yellow-600/20 ': file.path !== selectedFilePath,
            }"
            class="w-full text-left px-3 py-1.5 rounded-md transition-colors pl-6 text-yellow-400"
          >
            <span v-if="file.name.match(/\.(png|jpg|webp)$/)">🖼️</span>
            {{ formatTitle(file.name) }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
