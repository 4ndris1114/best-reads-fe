<template>
  <div>
    <Navbar />
    <div class="bookshelf-container bg-slate-900 flex flex-col items-center justify-center p-4 bookshelf h-screen">
      <div class="bookshelf-container p-4 h-[calc(100%-4rem)]">
        <div v-if="loading" class="text-center text-gray-600">Loading bookshelves...</div>
        <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

        <div v-else-if="selectedBookshelf">
          <div class="mt-20 shelf-label flex items-center justify-between w-full">
            <div class="flex items-center justify-center flex-1 gap-4">
              <!-- Left Arrow Button -->
              <button @click="swipeToNextBookshelf(-1)"
                class="text-white bg-gray-600 p-2 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                <fa icon="chevron-left" />
              </button>

              <span class="text-3xl font-extrabold text-[#9F6932] bg-[#1D1617] py-2 px-4 rounded-lg border-4 border-[#522623]">
                {{ selectedBookshelf.name }}
              </span>

              <!-- Right Arrow Button -->
              <button @click="swipeToNextBookshelf(1)"
                class="text-white bg-gray-600 p-2 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                <fa icon="chevron-right" />
              </button>
            </div>

            <!-- Add New Bookshelf Button -->
            <button
              class="text-white bg-green-800 ml-4 p-2 rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              @click="openShelfModal">
              Add New Bookshelf
            </button>
          </div>
        </div>

        <div v-else>
          <div class="text-center text-gray-600">No bookshelves found. Please add a bookshelf.</div>
        </div>

        <!-- Bookshelf Component -->
        <Bookshelf v-if="selectedBookshelf" :key="selectedBookshelf.id" :shelf="selectedBookshelf"
          @openModal="openModal" />

        <!-- Modals -->
        <BookModal :book="selectedBook" :isVisible="isModalVisible" @closeModal="closeModal" />
        <NewBookshelfModal :isShelfVisible="isShelfVisible" @closeShelfModal="closeShelfModal" @bookshelfCreated="addBookshelf"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Navbar from '@/components/Navbar.vue';
import BookModal from '@/components/BookModal.vue';
import NewBookshelfModal from '@/components/NewBookshelfModal.vue';
import Bookshelf from '@/components/Bookshelf.vue';
import type { IBook } from '@/types/interfaces/IBook';
import { useBookStore } from '@/stores/bookStore';
import { useShelfStore } from '@/stores/shelfStore';
import { useUserStore } from '@/stores/userStore';
import type { IBookshelf } from '@/types/interfaces/IBookshelf';

const loading = computed(() => shelfStore.loading);
const error = ref<string | null>(null);
const selectedBook = ref<IBook | null>(null);
const bookStore = useBookStore();
const isModalVisible = ref(false);
const isShelfVisible = ref(false);
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

const addBookshelf = (name: string) => {
  const newBookshelf = {
    id: Math.random().toString(36).substring(7), // Generate a random ID
    name: name,
    books: [],
  };
  userStore.loggedInUser!.bookshelves.push(newBookshelf);
  selectedBookshelf.value = newBookshelf;
  console.log(userStore.loggedInUser!.bookshelves);
  closeShelfModal(); // Close modal after adding
}

const openModal = (book: IBook) => {
  selectedBook.value = book;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const openShelfModal = () => {
  isShelfVisible.value = true;
};

const closeShelfModal = () => {
  isShelfVisible.value = false;
};
</script>
<style scoped>


.shelf-label {
  font-family: 'Garamond', serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
}
</style>
