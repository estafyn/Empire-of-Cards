<script setup lang="ts">
import { defineProps } from 'vue'
import MarkdownIt from 'markdown-it'

defineProps<{ content: string; title: string }>()

const md = new MarkdownIt({
  html: true, // Enable HTML within markdown
  linkify: true,
  typographer: true,
})
</script>

<template>
  <article
    class="prose max-w-none bg-stone-800 p-8 rounded-xl shadow-lg border border-yellow-700 text-yellow-200"
  >
    <h2 class="text-4xl font-bold mb-4 font-serif text-yellow-300 tracking-wide">{{ title }}</h2>
    <div v-html="md.render(content)" class="markdown-content"></div>
  </article>
</template>
