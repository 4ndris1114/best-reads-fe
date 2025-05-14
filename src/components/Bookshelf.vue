<template>
<div class="flex flex-col w-full flex-grow max-w-5xl mx-auto px-4">
  <!-- Empty state -->
  <div
    v-if="books.length === 0"
    class="flex flex-col items-center justify-center text-center flex-grow h-full py-12 space-y-4 text-white"
  >
    <div class="text-6xl">📚</div>
    <p class="text-xl font-semibold">No books on your bookshelf</p>
    <p class="text-sm text-gray-400 max-w-xs">
      Add your first book to get started!
    </p>
    <div class="w-full max-w-3xl h-48 border-b-8 border-accent rounded-md"></div>
  </div>

    <!-- Books on shelf -->
    <div v-else v-for="(shelfBooks, index) in chunkedBooks" :key="index"
      class="shelf flex w-full justify-center items-end mb-2 border-b-9 border-[#5b3826]">
      <div v-for="{ book, color, height } in shelfBooks" :key="book.id"
        class="book flex items-center justify-center text-s font-bold transform rotate-180 p-1 m-1 rounded-sm cursor-pointer"
        :style="{
          width: getBookWidth(book.title),
          height: `${height}px`,
          backgroundColor: color,
          color:
            color === '#9F6932' ? '#2A1A14' :
              color === '#2A374D' ? '#547786' :
                color === '#522623' ? '#d6a688' :
                  color === '#444A41' ? '#b59a6f' :
                    'white',
        }"
        @click="emits('openModal', book)">
        <span class="book-title">{{ book.title }}</span>
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
  for (let i = 0; i < styledBooks.value.length; i += 10) {
    chunks.push(styledBooks.value.slice(i, i + 10));
  }
  return chunks;
});

const bookStore = useBookStore();
const books = ref<IBook[]>([]);

const props = defineProps({
  shelf: {
    type: Object as () => IBookshelf,
    required: true,
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
        console.log(`Fetched book ${bb.id}`);
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
  return `${width}px`;
};
</script>

<style scoped>
.shelf {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  border-radius: 3px 3px;
}

.book {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: bold;
  writing-mode: vertical-rl;
  padding: 3px;
  margin: 2px;
  border-radius: 0 0 3px 3px;
  cursor: pointer;
  text-transform: uppercase;
}

.book-title {
  writing-mode: vertical-rl;
  text-align: center;
  overflow: hidden;
  display: -webkit-box;
  line-height: 1;
  font-size: 0.75rem; /* start with base size */
  max-height: 100%;
  word-break: break-word;
}
</style>
