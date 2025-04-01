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
        <BookModal v-on-click-outside :book="selectedBook" :isVisible="isModalVisible" @closeModal="closeModal" />
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
import { vOnClickOutside } from '@vueuse/components'
import type { IBookshelf } from '@/types/interfaces/IBookshelf';

const loading = computed(() => shelfStore.loading);
const error = ref<string | null>(null);
const selectedBook = ref<IBook | null>(null);
const bookStore = useBookStore();
const isModalVisible = ref(false);
const isShelfVisible = ref(false);
const shelfStore = useShelfStore();
import axios from 'axios';
const userStore = useUserStore();
const bookshelves = computed(() => shelfStore.bookshelves ? shelfStore.bookshelves : []);
const selectedBookshelf = ref<IBookshelf | null>(bookshelves.value.length > 0 ? bookshelves.value[0] : null);

const swipeToNextBookshelf = (increment: number) => {
  const currentIndex = bookshelves.value.findIndex((bookshelf) => bookshelf.id === selectedBookshelf.value?.id);
  let nextIndex = (currentIndex + increment) % bookshelves.value.length;
  if (nextIndex < 0) {
    nextIndex = bookshelves.value.length - 1; // Wrap around
  }
  selectedBookshelf.value = bookshelves.value[nextIndex];
}

const addBookshelf = async (name: string) => {
  if (!userStore.loggedInUser) return;

  try {
    const response = await axios.post(`/api/bookshelf/${userStore.loggedInUser.id}`, {
      name: name,
      books: [],
    });

    // Add the newly created bookshelf to the store
    userStore.loggedInUser.bookshelves.push(response.data);
    selectedBookshelf.value = response.data;

    closeShelfModal(); // Close modal after adding
  } catch (error: any) {
    console.error("Failed to create bookshelf:", error.response?.data || error.message);
  }
};

const openModal = (book: IBook) => {
  selectedBook.value = book;
  isModalVisible.value = true;
};

const addBookToBookshelf = async (bookId: string) => {
  console.log("Book ID type:", typeof bookId, "Value:", bookId);

  if (!userStore.loggedInUser || !selectedBookshelf.value) return;

  try {
    await axios.post(
      `/api/bookshelf/${userStore.loggedInUser.id}/${selectedBookshelf.value.id}/books`,
      bookId, // Ensure it's a string
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    selectedBookshelf.value.books.push({ id: bookId });

    console.log(`Book ${bookId} added to bookshelf ${selectedBookshelf.value.name}`);
  } catch (error: any) {
    console.error("Failed to add book:", error.response?.data || error.message);
  }
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
