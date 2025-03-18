<script setup lang="ts">
//package imports
import { computed, onMounted, ref } from 'vue'
//store imports
import { useBookStore } from '@/stores/bookStore'
//component imports
import Navbar from '@/components/Navbar.vue'

const bookStore = useBookStore()

onMounted(async () => {
  await bookStore.getAllBooks()
})
const books = computed(() => bookStore.books)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div v-for="(book, index) in books" class="text-3xl text-red-500">
      <p class="font-bold text-2xl text-black">Book {{ index+1 }}:</p>
      <!-- TODO to remove errors create Book IF -->
      <p>Book title: {{ book.title }}</p>
      <p>Book author: {{ book.author }}</p>
      <p>Book ISBN: {{ book.isbn }}</p>
      <p>Book published date: {{ book.publishedDate }}</p>
      <p>Book cover image: {{ book.coverImage }}</p>
      <p>Book genres: {{ book.genres.join(', ') }}</p>
      <p>Book ratings: {{ book.ratings.map(r => r.rating).join(', ') }}</p>
      <p>Book average rating: {{ book.averageRating }}</p>
    </div>
  </div>
</template>
