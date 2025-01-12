<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

const emit = defineEmits(['fileSelected'])
const { selectedFilePath } = defineProps<{ selectedFilePath: string | null }>()

const folderStructure = ref<FolderStructure>({
  rootFiles: [],
  folders: {},
})

const formatTitle = (text: string): string => {
  return text.replace(/\.[^/.]+$/, '')
}

const selectFile = (filePath: string): void => {
  emit('fileSelected', { filePath })
}

const loadFiles = async () => {
  const contentFiles = import.meta.glob('@/assets/content/**/*.{md,png,jpg,webp}', {
    eager: true,
  }) as Record<string, { default: string }>

  const newStructure: FolderStructure = {
    rootFiles: [],
    folders: {},
  }

  for (const path in contentFiles) {
    const fileUrl = contentFiles[path].default
    const parts = path.split('/')
    const fileName = parts[parts.length - 1]

    if (parts.length <= 4) {
      newStructure.rootFiles.push({ name: fileName, path: fileUrl })
    } else {
      const folderName = parts[parts.length - 2]
      if (!newStructure.folders[folderName]) {
        newStructure.folders[folderName] = []
      }
      newStructure.folders[folderName].push({ name: fileName, path: fileUrl })
    }
  }

  folderStructure.value = newStructure
}

onMounted(loadFiles)
</script>

<template>
  <div class="p-6 overflow-y-auto h-full">
    <h3 class="text-2xl font-bold text-yellow-300 mb-6">Table of Contents</h3>
    <p
      v-if="!folderStructure.rootFiles.length && !Object.keys(folderStructure.folders).length"
      class="text-yellow-400"
    >
      No files found.
    </p>

    <div v-if="folderStructure.rootFiles.length > 0" class="mb-8">
      <h4 class="text-lg font-bold text-yellow-300 mb-2">Root Files</h4>
      <ul class="space-y-2">
        <li v-for="file in folderStructure.rootFiles" :key="file.path">
          <button
            @click="selectFile(file.path)"
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

    <div v-for="(files, folderName) in folderStructure.folders" :key="folderName" class="mb-6">
      <h5 class="text-lg font-bold text-yellow-300 mb-2 capitalize">
        {{ formatTitle(folderName.toString()) }}
      </h5>
      <ul class="space-y-2">
        <li v-for="file in files" :key="file.path">
          <button
            @click="selectFile(file.path)"
            :aria-current="file.path === selectedFilePath ? 'page' : false"
            :class="{
              'border-4 border-yellow-400 bg-yellow-700/20': file.path === selectedFilePath,
              'hover:bg-yellow-600/20 ': file.path !== selectedFilePath,
            }"
            class="w-full text-left px-3 py-1.5 rounded-md transition-colors pl-6 text-yellow-400"
            aria-label="Select file"
          >
            <span v-if="file.name.match(/\.(png|jpg|webp)$/)">🖼️</span>
            {{ formatTitle(file.name) }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
