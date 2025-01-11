<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="bg-blue-900 text-white shadow-md p-5">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <h1 class="text-2xl font-bold">Empire of Cards</h1>
      <nav class="space-x-4">
        <RouterLink
          to="/"
          class="hover:text-blue-300 focus:outline-none focus:ring focus:ring-white"
          >Home</RouterLink
        >
        <RouterLink
          to="/about"
          class="hover:text-blue-300 focus:outline-none focus:ring focus:ring-white"
          >About</RouterLink
        >
      </nav>
    </div>
  </header>

  <main class="py-16 bg-gray-100">
    <div class="max-w-4xl mx-auto text-center px-6">
      <!-- Updated to use logo.png -->
      <img src="@/assets/logo.png" alt="Empire of Cards Logo" class="w-48 h-48 mx-auto mb-6" />
      <h2 class="text-4xl font-bold mb-4">Welcome to the Empire of Cards</h2>
      <p class="text-lg text-gray-700 mb-6">
        Step into the world of Sahul, where history is shaped by feathers and fire.
      </p>
      <div class="space-x-4">
        <RouterLink
          to="/stories"
          class="bg-blue-700 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Read the Stories
        </RouterLink>
        <RouterLink
          to="/community"
          class="text-blue-700 underline hover:text-blue-900 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Join the Community
        </RouterLink>
      </div>
    </div>

    <section class="mt-16 bg-white py-12">
      <div class="max-w-4xl mx-auto px-6">
        <h3 class="text-3xl font-bold mb-6">Explore the World of Sahul</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-gray-50 p-6 rounded-lg shadow">
            <h4 class="text-xl font-semibold mb-2">Lore and History</h4>
            <p class="text-gray-700">
              Learn about the rise of the Werribee Traders Association and the creatures of Sahul.
            </p>
            <RouterLink to="/lore" class="mt-3 inline-block text-blue-700 hover:underline">
              Explore Lore
            </RouterLink>
          </div>
          <div class="bg-gray-50 p-6 rounded-lg shadow">
            <h4 class="text-xl font-semibold mb-2">Recent Chronicles</h4>
            <p class="text-gray-700">Catch up on the latest chapters of Avelia's story.</p>
            <RouterLink to="/stories" class="mt-3 inline-block text-blue-700 hover:underline">
              Read Chronicles
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="bg-gray-800 text-white py-8">
    <div class="max-w-4xl mx-auto text-center">
      <p>&copy; 2025 Empire of Cards. All rights reserved.</p>
      <RouterLink to="/privacy" class="underline hover:text-gray-400">Privacy Policy</RouterLink>
    </div>
  </footer>
</template>
