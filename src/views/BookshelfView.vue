<template>
  <div>
    <Navbar />
    <div class="bookshelf-container bg-slate-900 flex flex-col items-center justify-center p-4 bookshelf h-screen">
      <div class="bookshelf-container p-4 h-[calc(100%-4rem)]">
        <div v-if="loading" class="text-center text-gray-600">Loading bookshelves...</div>
        <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

        <div v-else-if="selectedBookshelf">
          <div class="mt-20 shelf-label text-center mb-8">
            <!-- Bookshelf Title -->
            <!-- Left Arrow Button -->
            <button @click="swipeToNextBookshelf(-1)"
              class="text-white bg-gray-600 p-2 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900">
              <fa icon="chevron-left" />
            </button>

            <span
              class="text-3xl font-extrabold text-[#9F6932] bg-[#1D1617] py-2 px-4 rounded-lg border-4 border-[#522623]">
              {{ selectedBookshelf.name }} <!--display name of bookshelf -->
            </span>
            <!-- Right Arrow Button -->
            <button @click="swipeToNextBookshelf(1)"
              class="text-white bg-gray-600 p-2 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900">
              <fa icon="chevron-right" />
            </button>
            <!-- Button to add a new bookshelf -->
            <div class="flex justify-end">
              <button
                class="text-white bg-gray-600 p-2 mr-5 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                @click="addBookshelf('New Bookshelf')">Add New Bookshelf</button>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="text-center text-gray-600">No bookshelves found. Please add a bookshelf.</div>
        </div>

        <!-- Bookshelf Component -->
        <Bookshelf v-if="selectedBookshelf" :key="selectedBookshelf.id" :shelf="selectedBookshelf" @openModal="openModal" />


        <!-- Modal Component -->
        <BookModal :book="selectedBook" :isVisible="isModalVisible" @closeModal="closeModal" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import BookModal from '@/components/BookModal.vue';
import { BookService } from '../services/BookService';
import Bookshelf from '@/components/Bookshelf.vue';
import type { IBook } from '@/types/interfaces/IBook';
import { useBookStore } from '../stores/bookStore';
import { useShelfStore } from '@/stores/shelfStore';
import { useUserStore } from '../stores/userStore';
import type { IBookshelf } from '@/types/interfaces/IBookShelf';

const loading = computed(() => shelfStore.loading);
const error = ref<string | null>(null);
const selectedBook = ref<IBook | null>(null);
const bookStore = useBookStore();
const isModalVisible = ref(false);
const shelfStore = useShelfStore();
const userStore = useUserStore();
const bookshelves = computed(() => userStore.loggedInUser!.bookshelves);
const selectedBookshelf = ref<IBookshelf | null>(bookshelves.value[0]);

const swipeToNextBookshelf = (increment: number) => {
  const currentIndex = bookshelves.value.findIndex((bookshelf) => bookshelf.id === selectedBookshelf.value?.id);
  let nextIndex = (currentIndex + increment) % bookshelves.value.length;
  if (nextIndex < 0) {
    nextIndex = bookshelves.value.length - 1; // Wrap around
  }
  selectedBookshelf.value = bookshelves.value[nextIndex];
}

// Open modal on book click
const openModal = (book: IBook) => {
  selectedBook.value = book;
  isModalVisible.value = true;
};

// Close modal
const closeModal = () => {
  isModalVisible.value = false;
};

// Function to add a new bookshelf manually to the frontend
const addBookshelf = (name: string) => {
  // const newBookshelf = {
  //   _id: Math.random().toString(36).substring(7), // Generate a random ID
  //   name: name,
  //   books: [],
  // };
  // bookshelves.value.push(newBookshelf);
};
</script>

<style scoped>
.shelf {
  display: flex;
  align-items: flex-end;
  padding: 5px;
  border-bottom: 4px solid #ccc;
}

.shelf-label {
  font-family: 'Garamond', serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
}
</style>
