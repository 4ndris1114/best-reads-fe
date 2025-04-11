<template>
  <div class="flex flex-col w-full">
    <div
      v-for="(shelfBooks, index) in chunkedBooks"
      :key="index"
      class="shelf flex justify-center items-end p-1 border-b-7 text-white border-[#ccc]"
    >
      <div
        v-for="{ book, color, height } in shelfBooks"
        :key="book.id"
        class="book flex items-center justify-center text-s font-bold transform rotate-180 p-1 m-1 rounded-sm cursor-pointer"
        :style="{
          width: getBookWidth(book.title),
          height: `${height}px`,
          backgroundColor: color,
          color: color === '#9F6932' ? '#2A1A14' : 'white',
        }"
        @click="emits('openModal', book)"
      >
        <span class="book-title">{{ book.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { IBookshelf } from '@/types/interfaces/IBookshelf';
import type { IBook } from '@/types/interfaces/IBook';
import { useBookStore } from '../stores/bookStore';

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

onMounted(async () => {
  const bookPromises = props.shelf.books.map(async (bookId: string) => {
    let book = bookStore.books.find((b: IBook) => b.id === bookId);
    if (!book) {
      try {
        book = await bookStore.getBookById(bookId);
        if (book) bookStore.books.push(book);
      } catch (error) {
        console.error(`Error fetching book ${bookId}`, error);
      }
    }
    return book;
  });

  books.value = (await Promise.all(bookPromises)).filter((b) => b !== null) as IBook[];
  totalBooks.value = books.value.length;
  assignColorsAndHeights();
});

const assignColorsAndHeights = () => {
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
  const width = Math.min(12.5 + charCount * 2.5, 125);
  return `${width}px`;
};
</script>

<style scoped>
.shelf {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.book {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: bold;
  writing-mode: vertical-rl;
  padding: 5px;
  margin: 2px;
  border-radius: 0 0 3px 3px;
  cursor: pointer;
  text-transform: uppercase;
}
</style>
