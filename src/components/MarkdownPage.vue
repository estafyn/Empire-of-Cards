<script setup lang="ts">
import { ref, watch } from 'vue'
import MarkdownIt from 'markdown-it'

// Define props
const props = defineProps<{ filePath: string }>()

const content = ref<string>('') // Holds the loaded Markdown content
const glossaryTerms = ref<Map<string, string>>(new Map()) // Map of term -> anchor link

// Initialize MarkdownIt with plugins
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

// Custom plugin to automatically link glossary terms
const linkGlossaryTerms = (markdownContent: string): string => {
  if (glossaryTerms.value.size === 0) return markdownContent

  let processedContent = markdownContent

  // Don't process content if we're already in the glossary
  if (props.filePath.includes('Glossary.md')) return processedContent

  // Replace terms with links, but avoid replacing terms in headings, code blocks, or existing links
  glossaryTerms.value.forEach((link, term) => {
    // Create a regex that matches the term as a whole word, but not inside links, headings, or code blocks
    // This is a simplified approach - a full parser would be more robust
    const regex = new RegExp(`\\b(${term})\\b(?![^<]*>|[^<>]*<\/a>)`, 'g')
    processedContent = processedContent.replace(
      regex,
      `[${term}](/src/assets/content/Glossary.md${link})`,
    )
  })

  return processedContent
}

// Load glossary terms
const loadGlossaryTerms = async () => {
  try {
    // Only load glossary if we're not already in it
    if (props.filePath.includes('Glossary.md')) return

    const response = await fetch('/src/assets/content/Glossary.md')
    if (!response.ok) throw new Error('Failed to load glossary.')

    const glossaryContent = await response.text()

    // Extract headings and create anchor links
    const headingRegex = /###\s+(.+)/g
    let match

    while ((match = headingRegex.exec(glossaryContent)) !== null) {
      const term = match[1].trim()
      const anchor = `#${term
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')}`
      glossaryTerms.value.set(term, anchor)
    }
  } catch (error) {
    console.error('Error loading glossary:', error)
  }
}

// Watch for changes to props.filePath and fetch content
watch(
  () => props.filePath, // Watch for changes in filePath
  async (newFilePath) => {
    if (!newFilePath) {
      content.value = 'Error: No file path provided.'
      return
    }

    try {
      await loadGlossaryTerms() // Load glossary terms first

      const response = await fetch(newFilePath)
      if (!response.ok) throw new Error('Failed to load file.')

      let rawContent = await response.text() // Load the Markdown file content

      // Process content to link glossary terms
      rawContent = linkGlossaryTerms(rawContent)

      content.value = rawContent
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
