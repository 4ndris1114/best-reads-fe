<template>
  <div class="flex flex-col w-[60vw] mx-auto px-4 overflow-x-hidden"
  :class="{ 'h-[40vh]': isAtHome, 'h-[60vh]': !isAtHome }">
    <!-- Empty state -->
    <div v-if="books.length === 0"
      class="flex flex-col items-center justify-center text-center flex-grow py-12 space-y-4 text-white">
      <div class="text-8xl">📚</div>
      <p class="text-3xl font-semibold">No books on this bookshelf</p>
      <p class="text-lg text-gray-400 max-w-xs">Add your first book to get started!</p>
      <div class="w-full max-w-3xl h-48 border-b-8 border-accent rounded-md"></div>
    </div>

    <!-- Bookshelf rows -->
    <div v-else v-for="(shelfBooks, index) in chunkedBooks" :key="index"
      class="flex justify-center items-end mb-2 border-b-8 border-[#5b3826]"
      :class="{ 'w-fit': isAtHome, 'w-full': !isAtHome }">
      <div v-for="{ book, color, height } in shelfBooks" :key="book.id"
        class="flex items-center justify-center rotate-180 p-1 m-1 rounded-sm cursor-pointer font-bold text-xs text-center leading-none uppercase writing-vertical"
        :style="{
          height: `${height}px`,
          width: getBookWidth(book.title),
          backgroundColor: color,
          color: getContrastingTextColor(color),
        }"
        @click="emits('openModal', book)">
        <span class="overflow-hidden max-h-full break-words px-1" style="writing-mode: vertical-rl">{{ book.title }}</span>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import type { IBookshelf } from '@/types/interfaces/IBookshelf';
import type { IBook } from '@/types/interfaces/IBook';
import { useBookStore } from '../stores/bookStore';
import type { IBookshelfBook } from '@/types/interfaces/IBookshelfBook';

const chunkedBooks = computed(() => {
  const chunks = [];
  for (let i = 0; i < styledBooks.value.length; i += props.isAtHome ? 4 : 10) {
    chunks.push(styledBooks.value.slice(i, i + props.isAtHome ? 4 : 10));
  }
  return chunks;
});

const bookStore = useBookStore();
const books = ref<IBook[]>([]);

const props = defineProps({
  shelf: {
    type: Object as () => IBookshelf,
    required: true,
  },
  isAtHome: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits<{
  (e: 'openModal', book: IBook): void
}>();

// Add this to watch for shelf changes
watch(() => props.shelf, (newVal) => {
  if (newVal) {
    getBooksAndStyles();
  }
});

// And/or add this to load on mount
onMounted(() => {
  if (props.shelf) {
    getBooksAndStyles();
  }
});

const bookColors = ['#2A374D', '#444A41', '#9F6932', '#522623'];

// Color usage tracker
const colorUsage = ref<Record<string, number>>({
  '#2A374D': 0,
  '#444A41': 0,
  '#9F6932': 0,
  '#522623': 0,
});

const totalBooks = ref(0);

// Store color and height for each book
const styledBooks = ref<{ book: IBook, color: string, height: number }[]>([]);

const getBooksAndStyles = async () => {
  const bookPromises = props.shelf.books.map(async (bb: IBookshelfBook) => {

    let book = bookStore.books.find((b: IBook) => b.id === bb.id);
    if (!book) {
      try {
        book = await bookStore.getBookById(bb.id);
        if (book) bookStore.books.push(book);
      } catch (error) {
        console.error(`Error fetching book ${bb.id}`, error);
      }
    }
    return book;
  });

  books.value = (await Promise.all(bookPromises)).filter((b): b is IBook => b !== null);

  totalBooks.value = books.value.length;
  assignColorsAndHeights();
  await nextTick();
  adjustBookTitleSizes();
}

const adjustBookTitleSizes = () => {
  const books = document.querySelectorAll('.book');

  books.forEach((book) => {
    const title = book.querySelector('.book-title') as HTMLElement;
    if (!title) return;

    const maxHeight = book.clientHeight - 10; // accounting for padding

    // Shrink font until it fits within 2 lines
    let fontSize = parseFloat(window.getComputedStyle(title).fontSize);
    const lineHeight = parseFloat(window.getComputedStyle(title).lineHeight || "1");

    while (title.scrollHeight > maxHeight && fontSize > 10) {
      fontSize -= 1;
      title.style.fontSize = `${fontSize}px`;
    }
  });
};

const assignColorsAndHeights = () => {
  styledBooks.value = [];
  let lastColor = '';
  let repeatCount = 0;

  books.value.forEach((book) => {
    let color = '';
    do {
      const potentialColors = bookColors.filter(c =>
        colorUsage.value[c] / totalBooks.value < 0.3 &&
        (c !== lastColor || repeatCount < 2)
      );

      color = potentialColors.length ? potentialColors[Math.floor(Math.random() * potentialColors.length)] : bookColors[Math.floor(Math.random() * bookColors.length)];
    } while (!color);

    if (color === lastColor) {
      repeatCount++;
    } else {
      repeatCount = 1;
    }

    lastColor = color;
    colorUsage.value[color]++;

    const height = Math.floor(Math.random() * 60) + 100; // 100px - 160px height range

    styledBooks.value.push({ book, color, height });
  });
};

const getBookWidth = (title: string) => {
  const charCount = title.length;
  const width = Math.min(2.5 + charCount * 2.5, 90);
  if (width < 20) return '20px';
  return `${width}px`;
};

const getContrastingTextColor = (color: string): string => {
  switch (color) {
    case '#9F6932': return '#2A1A14';
    case '#2A374D': return '#547786';
    case '#522623': return '#d6a688';
    case '#444A41': return '#b59a6f';
    default: return 'white';
  }
};
</script>

<style scoped>
</style>