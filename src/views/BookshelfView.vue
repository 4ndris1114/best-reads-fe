<template>
  <Navbar/>
  <div class="bookshelf-container bg-slate-900 flex flex-col items-center justify-center p-4 bookshelf h-[80vh]">
  <div class="bookshelf-container  p-4 h-[calc(100%-4rem)]">
    <div v-if="loading" class="text-center text-gray-600">Loading books...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

    <div v-else>
      <div class="mt-20 shelf-label text-center mb-8">
      <!-- Bookshelf Title -->
      <!-- Left Arrow Button -->
      <button class="text-white bg-gray-600 p-2 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900">
              <fa icon="chevron-left" />
            </button>

        <span class="text-3xl font-extrabold text-[#9F6932] bg-[#1D1617] py-2 px-4 rounded-lg border-4 border-[#522623]">
          {{ $route.params.id }} <!--display id of bookshelf -->
        </span>
         <!-- Right Arrow Button -->
         <button class="text-white bg-gray-600 p-2 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900">
              <fa icon="chevron-right" />
            </button>
            <!-- Button to add a new bookshelf -->
    <div class="flex justify-end">
      <button class="text-white bg-gray-600 p-2 mr-5 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900" @click="addBookshelf('New Bookshelf')">Add New Bookshelf</button>
    </div>
  </div>
      </div>

      <div class="bookshelf-container flex flex-col p-4 bookshelf">
        <div v-for="(shelf, index) in shelves" :key="index" class="shelf justify-center flex items-center p-2 border-b-4 border-[#ccc]">
          <div v-for="book in shelf" :key="book.isbn" class="book flex items-center justify-center text-white text-xs font-bold transform rotate-180 p-1 m-1 rounded-sm cursor-pointer"
               :style="{ width: getBookWidth(book.title), backgroundColor: getRandomColor() }"
               @click="openModal(book)">
            <span class="book-title">{{ book.title }}</span>
          </div>
        </div>
      </div>

      <!-- Modal Component -->
      <Modal :book="selectedBook" :isVisible="isModalVisible" @closeModal="closeModal" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import Modal from '../components/BookModal.vue';
import { BookService } from '../services/BookService';

interface Rating {
  rating: number;
}

interface Book {
  title: string;
  author: string;
  isbn: string;
  publishedDate: string;
  coverImage?: string;
  genres: string[];
  ratings: Rating[];
  averageRating: number;
}

const books = ref<Book[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const selectedBook = ref<Book | null>(null);
const isModalVisible = ref(false);
const bookColors = ['#2A374D', '#444A41', '#9F6932', '#522623'];

const fetchBooks = async () => {
  try {
    const bookService = new BookService();
    books.value = await bookService.getAll();
  } catch (err) {
    error.value = 'Failed to load books.';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchBooks);

// Function to determine book width based on title length
const getBookWidth = (title: string) => {
  const charCount = title.length;
  const width = Math.min(10 + charCount * 2, 100); // Max width of 100px
  return `${width}px`;
};

const bookshelves = ref([
  {
    _id: '67deab42c9048c19a2d52946',
    name: 'Currently Reading',
    books: [],
  },
  {
    _id: '67deab42c9048c19a2d52947',
    name: 'Want to Read',
    books: [],
  },
  {
    _id: '67deab42c9048c19a2d52948',
    name: 'Finished Reading',
    books: [],
  },
]);

// Function to distribute books onto shelves
const shelves = computed(() => {
  const shelfCapacity = 10;
  let arrangedShelves: Book[][] = [];
  let currentShelf: Book[] = [];

  books.value.forEach((book) => {
    if (currentShelf.length < shelfCapacity) {
      currentShelf.push(book);
    } else {
      arrangedShelves.push(currentShelf);
      currentShelf = [book];
    }
  });

  if (currentShelf.length) arrangedShelves.push(currentShelf);
  return arrangedShelves;
});

// Function to randomize book colors
const getRandomColor = () => {
  return bookColors[Math.floor(Math.random() * bookColors.length)];
};

// Open modal on book click
const openModal = (book: Book) => {
  selectedBook.value = book;
  isModalVisible.value = true;
};

// Close modal
const closeModal = () => {
  isModalVisible.value = false;
};

// Function to add a new bookshelf manually to the frontend
const addBookshelf = (name: string) => {
  const newBookshelf = {
    _id: Math.random().toString(36).substring(7), // Generate a random ID
    name: name,
    books: [],
  };
  bookshelves.value.push(newBookshelf);
};
</script>

<style scoped>
.shelf {
  display: flex;
  align-items: flex-end;
  padding: 5px;
  border-bottom: 4px solid #ccc;
}

.book {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  text-align: center;
  font-weight: bold;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  padding: 5px;
  margin: 2px;
  border-radius: 3px;
  cursor: pointer;
}
.shelf-label {
  font-family: 'Garamond', serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
}
</style>
