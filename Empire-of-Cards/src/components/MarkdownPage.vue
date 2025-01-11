<script setup lang="ts">
import { marked } from 'marked'
import { defineProps } from 'vue'

defineProps<{ content: string; title: string }>()

const renderMarkdown = (markdown: string) => {
  if (!markdown.trim()) return '<p>No content to display.</p>' // Handle empty markdown case
  try {
    const result = marked.parse(markdown)
    return result
  } catch (error) {
    console.error('Error during markdown rendering:', error)
    return '<p>Error rendering markdown content: ' + error + '</p>'
  }
}
</script>

<template>
  <article
    class="prose max-w-none bg-stone-800 p-8 rounded-xl shadow-lg border border-yellow-700 text-yellow-200"
  >
    <h2 class="text-4xl font-bold mb-4 font-serif text-yellow-300 tracking-wide">{{ title }}</h2>
    <div v-if="content" v-html="renderMarkdown(content)" class="markdown-content"></div>
    <div v-else class="text-yellow-400 italic">No content found.</div>
  </article>
</template>
