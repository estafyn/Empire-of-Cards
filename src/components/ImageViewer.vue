<template>
  <div class="flex justify-center">
    <img :src="src" :alt="alt" class="w-full max-w-4xl rounded-lg shadow-lg" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: 'Image',
  },
})
</script>
