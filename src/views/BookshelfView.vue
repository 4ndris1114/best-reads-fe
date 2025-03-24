<template>
 <Navbar/>
  <div class="bookshelf-container">
    <div v-if="loading" class="text-center text-gray-600">Loading books...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

    <div v-else>
      <!-- Bookshelf Title -->
      <div class="mt-20 shelf-label text-center mb-8">
        <span class="text-3xl font-extrabold text-[#9F6932] bg-[#1D1617] py-2 px-4 rounded-lg border-4 border-[#522623]">
           {{ $route.params.id}} <!--display id of bookshelf -->
        </span>
      </div>

    <div class bookshelf-container=" p-4 bookshelf">
      <div v-for="(shelf, index) in shelves" :key="index" class="shelf">
        <div v-for="book in shelf" :key="book.isbn" class="book"
             :style="{ width: getBookWidth(book.title), backgroundColor: getRandomColor() }">
          <span class="book-title">{{ book.title }}</span>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import { ref, computed, onMounted } from "vue";
import { BookService } from "@/services/BookService";

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
const bookColors = ["#2A374D", "#444A41", "#9F6932", "#522623"];

const fetchBooks = async () => {
  try {
    const bookService = new BookService();
    books.value = await bookService.getAll();
  } catch (err) {
    error.value = "Failed to load books.";
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
</script>

<style scoped>
.bookshelf-container {
  padding: 1rem;
  background-color: #1D1617;
}

.bookshelf {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

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
}
.shelf-label {
  font-family: 'Garamond', serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
}
</style>
