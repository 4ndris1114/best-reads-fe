<template>
  <div class="flex flex-col h-full overflow-y-auto items-center">
    <div v-if="relatedBooks.length === 0">
      <p class="text-center text-gray-500">No related books found.</p>
    </div>
    <div v-else class="w-full">
      <h1 class="text-3xl text-center my-5 text-primary font-bold">Readers also liked</h1>
      <div class="flex flex-wrap justify-center gap-6">
        <div
          v-for="book in relatedBooks"
          :key="book.id"
          class="flex flex-col items-center cursor-pointer p-2 w-64 bg-white rounded-lg shadow-lg"
        >
          <router-link :to="'/bookdetails/' + book.id">
            <CloudinaryImage :publicId="book.coverImage" alt="Book cover" />
          </router-link>
          <h2 class="text-md font-bold mt-4 text-center">{{ book.title }}</h2>
          <h3 class="text-sm font-semibold text-center">{{ book.author }}</h3>
          <p class="text-sm text-gray-700 font-semibold mt-2">
            <fa :icon="['fas', 'star']" class="text-yellow-500"></fa>
            {{ book.averageRating.toFixed(1) }}
          </p>
<button
  @click="addToBookshelf('Want to Read', book.id)"
  class="mt-4 cursor-pointer flex items-center bg-highlight text-white py-2 px-4 rounded-md"
>
  <fa icon="circle-plus" class="mr-2" />Want to read
</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useBookStore } from '@/stores/bookStore';
import { useShelfStore } from '@/stores/shelfStore';
import { useUserStore } from '@/stores/userStore';
import CloudinaryImage from '@/components/CloudinaryImage.vue';
import type { IBook } from '@/types/interfaces/IBook';
import ToastNotification from './ToastNotification.vue';
import { useToastStore } from '@/stores/toastStore'

const toastStore = useToastStore();
const bookStore = useBookStore();
const shelfStore = useShelfStore();
const userStore = useUserStore();
const loggedInUser = computed(() => userStore.loggedInUser);

const props = defineProps<{
  genres: string[];
  bookId: string; // or `number` if it's a number
}>();

onMounted(() => {
  bookStore.getAllBooks();
});

const relatedBooks = computed<IBook[]>(() => {
  if (!props.genres || !bookStore.books.length) return [];

  return bookStore.books.filter(book =>
    book.id !== props.bookId &&
    book.genres?.some(genre =>
      props.genres.some(input =>
        genre.toLowerCase().includes(input.toLowerCase())
      )
    )
  );
});
const addToBookshelf = async (shelfName: string, bookId: string) => {
  // Find the shelf by its name
  const shelf = shelfStore.bookshelves.find(b => b.name === shelfName);

  if (!shelf) {
    console.error(`Bookshelf "${shelfName}" not found.`);
    toastStore.triggerToast("Bookshelf not found.", "error");
    return;
  }

  // Check if the book is already in the bookshelf
  const isBookAlreadyInShelf = shelf.books.some(book => book.id === bookId);

  if (isBookAlreadyInShelf) {
    console.error(`Book with ID "${bookId}" is already in the bookshelf "${shelfName}".`);
    toastStore.triggerToast("This book is already added to this bookshelf", "error");
    return;
  }

  // Proceed with adding the book to the bookshelf
  try {
    await shelfStore.addBookToBookshelf(loggedInUser.value!.id, shelf.id, bookId);
    toastStore.triggerToast("Book added to shelf successfully!", "success");
  } catch (error) {
    console.error("Error adding book to bookshelf:", error);
    toastStore.triggerToast("Failed to add book to shelf. Please try again.", "error");
  }
};


</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}</style>
