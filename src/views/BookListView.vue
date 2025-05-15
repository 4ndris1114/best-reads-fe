<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold text-center mb-4">Book List</h1>

    <div v-if="loading" class="text-center text-gray-600">Loading books...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BookCard v-for="book in books" :key="book.isbn" :book="book" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type {IBook} from '@/types/interfaces/IBook';
import type {IRating} from '@/types/interfaces/IRating';
import BookCard from '@/components/BookCard.vue';
import { BookService } from '@/services/BookService';

const books = ref<IBook[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchBooks = async () => {
  try {
    const bookService = new BookService();
    books.value = await bookService.getAll();
  } catch (err: any) {
    error.value = "Failed to load books.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchBooks);
</script>
