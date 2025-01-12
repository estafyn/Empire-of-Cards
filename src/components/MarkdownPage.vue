<script setup lang="ts">
import { ref, watch } from 'vue'
import MarkdownIt from 'markdown-it'

// Define props
const props = defineProps<{ filePath: string }>()

const content = ref<string>('') // Holds the loaded Markdown content
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

// Watch for changes to props.filePath and fetch content
watch(
  () => props.filePath, // Watch for changes in filePath
  async (newFilePath) => {
    if (!newFilePath) {
      content.value = 'Error: No file path provided.'
      return
    }

    try {
      const response = await fetch(newFilePath)
      if (!response.ok) throw new Error('Failed to load file.')
      content.value = await response.text() // Load the Markdown file content
    } catch (error) {
      console.error('Error loading markdown:', error)
      content.value = 'Error: Unable to load content.'
    }
  },
  { immediate: true },
)
</script>

<template>
  <article
    class="prose max-w-none bg-stone-800 p-8 rounded-xl shadow-lg border border-yellow-700 text-yellow-200"
  >
    <div v-html="md.render(content)" class="markdown-content"></div>
  </article>
</template>
