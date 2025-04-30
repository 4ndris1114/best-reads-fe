<template>
  <div>
    <div v-if="!isLoading && books.length === 0">
      <p class="text-center text-gray-500 mt-8">No books currently in the "Currently Reading" shelf.</p>
    </div>

    <div v-if="isLoading" class="text-center text-gray-500 mt-8">
      Loading books...
    </div>

    <div v-else-if="books.length > 0">
      <h1 class="text-2xl text-center text-highlight font-bold mb-6">Currently Reading</h1>
      <div class="space-y-4 max-w-xl mx-auto">
        <div
          v-for="book in books"
          :key="book.id"
          class="flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-200 gap-4"
        >
          <!-- Left side: Book cover -->
          <div class="flex-shrink-0 w-20 h-28">
            <router-link :to="'/bookdetails/' + book.id">
              <CloudinaryImage
                :publicId="book.coverImage"
                alt="Book cover"
                class="w-full h-full object-cover rounded"
              />
            </router-link>
          </div>

          <!-- Right side: Book name, progress bar, and edit button -->
          <div class="flex-grow flex flex-col justify-between min-h-[7rem]">
            <div>
              <!-- Book title -->
              <h2 class="text-lg font-semibold text-gray-800 mb-1">{{ book.title }}</h2>

              <!-- Progress bar -->
              <div class="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-1">
                <div
                  class="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
                  :style="calculateBarStyle(book)"
                ></div>
              </div>

              <!-- Progress numbers and edit button -->
              <div class="text-xs text-gray-600 flex justify-between items-center">
                <span>{{ book.currentPage }} / {{ book.totalPages }} pages</span>
                <span class="font-medium">({{ calculateProgressPercentage(book) }}%)</span>
              </div>
            </div>

            <div class="mt-2">
              <button
                @click="editProgress(book)"
                class="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-1 py-0.5"
              >
                Update progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useBookStore } from '@/stores/bookStore'; // Adjust path if needed
import { useUserStore } from '@/stores/userStore'; // Adjust path if needed
import CloudinaryImage from '@/components/CloudinaryImage.vue'; // Adjust path if needed
import type { IBook } from '@/types/interfaces/IBook'; // Adjust path and ensure IBook has needed fields

// --- State ---
const bookStore = useBookStore();
const userStore = useUserStore();
const isLoading = ref(true); // Loading state

// --- Computed Properties ---
// Fetch books for the "Currently Reading" shelf
const books = computed<IBook[]>(() => {
  const userShelves = userStore.loggedInUser?.bookshelves ?? [];
  const shelf = userShelves.find(shelf => shelf.name === "Currently Reading"); // Use "Currently Reading" directly

  if (shelf && bookStore.books.length > 0) {
    return shelf.books
      .map(bookId => bookStore.books.find(book => book.id === bookId))
      .filter((book): book is IBook => book !== undefined);
  }
  return [];
});

// --- Methods ---

// Fetch necessary data
const fetchData = async () => {
  isLoading.value = true;
  try {
    // Fetch all books and user's shelves concurrently for efficiency
    await Promise.all([
      bookStore.fetchBooks(),
      userStore.fetchUserBookshelves() // Ensure this fetches the user's shelves with book IDs
    ]);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false;
  }
};

// Calculate dynamic style for the progress bar width
const calculateBarStyle = (book: IBook) => {
  if (!book.totalPages || book.totalPages <= 0) {
    return { width: '0%' };
  }
  const progress = (book.currentPage / book.totalPages) * 100;
  return { width: `${Math.min(progress, 100)}%` };
};

// Calculate progress percentage as a string
const calculateProgressPercentage = (book: IBook): string => {
  if (!book.totalPages || book.totalPages <= 0) {
    return '0';
  }
  return ((readingProgress.currentPage / book.totalPages) * 100).toFixed(0);
};

// Handle the click on the "Update progress" button
const editProgress = (book: IBook) => {
  console.log('Editing progress for:', book.title, book.id);
  // Implement your logic here
};

// Fetch data when the component is first mounted
onMounted(() => {
  fetchData();
});

// Watch for changes in the shelfName prop and refetch data if it changes
watch(() => "Currently Reading", () => {
  fetchData();
}, { immediate: true }); // Ensures the fetch is done when component is mounted
</script>

<style scoped>
</style>
