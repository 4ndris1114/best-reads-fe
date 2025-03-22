<script setup lang="ts">
//package imports
import { computed, onMounted, ref } from 'vue'
//store imports
import { useBookStore } from '@/stores/bookStore'
//component imports
import Navbar from '@/components/Navbar.vue'
import BookListView from './BookListView.vue'

const bookStore = useBookStore()

onMounted(async () => {
  await bookStore.getAllBooks()
})
const books = computed(() => bookStore.books)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <BookListView />
  </div>
</template>
