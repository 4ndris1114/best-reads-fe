<template>
  <div v-if="books.length === 0">
    <p class="text-gray-500">No books in the "{{ shelfName }}" shelf.</p>
  </div>
  <div v-else>
    <h1 class="text-2xl flex flex-col items-center text-highlight font-bold mb-4">{{ shelfName }}</h1>
      <div v-for="book in books" :key="book.id" class="flex flex-col items-center w-1/2 bg-white  rounded-lg shadow-lg">
        <router-link :to="'/bookdetails/' + book.id">
        <CloudinaryImage :publicId="book.coverImage" alt="Book cover" />
      </router-link>        <h2 class="text-sm font-semibold mt-4">{{ book.title }}</h2>
        <h3 class="text-xs font-semibold mt-4">{{ book.author }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useBookStore } from '@/stores/bookStore';
import { useUserStore } from '@/stores/userStore';
import CloudinaryImage from '@/components/CloudinaryImage.vue';
import type { IBook } from '@/types/interfaces/IBook';

const props = defineProps({
  shelfName: {
    type: String,
    required: true,
  },
});

const bookStore = useBookStore();
const userStore = useUserStore();

const books = computed<IBook[]>(() => {
  const userShelves = userStore.loggedInUser ? userStore.loggedInUser.bookshelves : [];
  const shelf = userShelves.find(shelf => shelf.name === props.shelfName);
  if (shelf) {
    return shelf.books.map(bookId => bookStore.books.find(book => book.id === bookId)).filter(book => book !== undefined);
  }
  return [];
});

// Fetch books when the component is mounted
onMounted(() => {
  fetchBooks();
});

const fetchBooks = async () => {
  await bookStore.fetchBooks();
  await userStore.fetchUserBookshelves();
};

// Watch the shelfName prop for changes and refetch books if necessary
watch(() => props.shelfName, fetchBooks);

</script>

<style scoped>
</style>
