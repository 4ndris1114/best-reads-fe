<template>
  <section id="bookshelves">
    <h2 class="text-2xl font-bold mb-4"><fa icon="bookmark" class="text-black mr-1" /> Bookshelves</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div v-for="shelf in bookshelves" :key="shelf.id"
        class="bg-yellow-100 p-4 rounded drop-shadow-xl text-center">
        <h3 class="text-sm word-break">
          {{ shelf.name.length > 17 ? shelf.name.substring(0, 17) + '...' : shelf.name }}
        </h3>
        <p class="text-xs text-gray-500">{{ shelf.books.length }} books</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { IBookshelf } from "@/types/interfaces/IBookshelf";

defineProps<{
  bookshelves: IBookshelf[]
}>();
</script>
