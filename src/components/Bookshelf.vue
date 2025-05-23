<template>
  <div
    class="flex flex-col mx-auto px-4"
    :class="{ 'h-[30vh] w-full': isAtHome, 'h-[60vh] w-[60vw]': !isAtHome }"
  >
    <!-- Empty state -->
    <div
      v-if="books.length === 0"
      class="flex flex-col items-center justify-center text-center flex-grow py-2 space-y-4 text-white"
    >
      <div class="text-6xl">📚</div>
      <p class="text-3xl font-semibold">No books on this bookshelf</p>
      <p class="text-lg text-gray-400 max-w-xs">
        Add your first book to get started!
      </p>
    </div>

    <!-- Bookshelf rows -->
    <div
      v-else
      v-for="(shelfBooks, index) in chunkedBooks"
      :key="index"
      class="flex justify-center items-end mb-2 border-b-8 border-[#5b3826] w-full mb-5"
      :class="{ 'w-fit': isAtHome, 'h-1/3': !isAtHome}"
    >
      <div
        v-for="{ book, color, height } in shelfBooks"
        :key="book.id"
        class="flex items-center justify-center mb-0.5 rotate-180 p-1 rounded-b m-0.5 rounded- cursor-pointer font-bold text-xs text-center leading-none uppercase writing-vertical"
        :style="{
          height: `${height}px`,
          width: getBookWidth(book.title),
          backgroundColor: color,
          color: getContrastingTextColor(color),
        }"
        @click="emits('openModal', book)"
      >
        <span
          class="overflow-hidden max-h-full break-words px-1"
          style="writing-mode: vertical-rl"
          >{{ book.title }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch } from "vue";
import type { IBookshelf } from "@/types/interfaces/IBookshelf";
import type { IBook } from "@/types/interfaces/IBook";
import { useBookStore } from "../stores/bookStore";
import type { IBookshelfBook } from "@/types/interfaces/IBookshelfBook";

const props = defineProps({
  shelf: {
    type: Object as () => IBookshelf,
    required: true,
  },
  isAtHome: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits<{
  (e: "openModal", book: IBook): void;
}>();

const bookStore = useBookStore();
const books = ref<IBook[]>([]);

const bookColors = ["#2A374D", "#444A41", "#9F6932", "#522623"];

const colorUsage = ref<Record<string, number>>({
  "#2A374D": 0,
  "#444A41": 0,
  "#9F6932": 0,
  "#522623": 0,
});

const totalBooks = ref(0);

const styledBooks = ref<{ book: IBook; color: string; height: number }[]>([]);

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

  books.value = (await Promise.all(bookPromises)).filter(
    (b): b is IBook => b !== null
  );

  totalBooks.value = books.value.length;
  assignColorsAndHeights();
  await nextTick();
  adjustBookTitleSizes();
};

const assignColorsAndHeights = () => {
  styledBooks.value = [];
  let lastColor = "";
  let repeatCount = 0;

  // Reset color usage counts
  Object.keys(colorUsage.value).forEach((key) => (colorUsage.value[key] = 0));

  books.value.forEach((book) => {
    let color = "";
    do {
      const potentialColors = bookColors.filter(
        (c) =>
          colorUsage.value[c] / totalBooks.value < 0.3 &&
          (c !== lastColor || repeatCount < 2)
      );

      color = potentialColors.length
        ? potentialColors[Math.floor(Math.random() * potentialColors.length)]
        : bookColors[Math.floor(Math.random() * bookColors.length)];
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

const adjustBookTitleSizes = () => {
  const booksEls = document.querySelectorAll(".book");

  booksEls.forEach((book) => {
    const title = book.querySelector(".book-title") as HTMLElement;
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

const chunkedBooks = computed(() => {
  const chunks = [];
  const chunkSize = 10;
  for (let i = 0; i < styledBooks.value.length; i += chunkSize) {
    chunks.push(styledBooks.value.slice(i, i + chunkSize));
  }
  return chunks;
});

const getBookWidth = (title: string) => {
  const charCount = title.length;
  const width = Math.min(2.5 + charCount * 2.5, 90);
  if (width < 20) return "20px";
  return `${width}px`;
};

const getContrastingTextColor = (color: string): string => {
  switch (color) {
    case "#9F6932":
      return "#2A1A14";
    case "#2A374D":
      return "#547786";
    case "#522623":
      return "#d6a688";
    case "#444A41":
      return "#b59a6f";
    default:
      return "white";
  }
};

watch(
  () => props.shelf,
  (newVal) => {
    if (newVal) {
      getBooksAndStyles();
    }
  }
);

onMounted(() => {
  if (props.shelf) {
    getBooksAndStyles();
  }
});
</script>

<style scoped>
.writing-vertical {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
</style>
