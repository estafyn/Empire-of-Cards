<template>
  <article class="prose max-w-none bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-3xl font-bold mb-4">{{ title }}</h2>
    <div v-html="content" class="markdown-content"></div>
  </article>
</template>

<script setup lang="ts">
defineProps<{ content: string; title: string }>()
</script>

<style scoped>
.markdown-content {
  word-wrap: break-word;
}

.bg-white {
  @apply bg-white dark:bg-gray-800;
}

.prose {
  @apply text-gray-800 dark:text-gray-200 leading-relaxed;
}

h2 {
  @apply text-blue-700 dark:text-blue-300;
}
</style>
