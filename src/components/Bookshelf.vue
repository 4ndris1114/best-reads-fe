<template>
<div class="bookshelf-container flex flex-col p-4 bookshelf">
          <div class="shelf justify-center flex items-center p-2 border-b-4 border-[#ccc]">
            <div v-for="book in shelf" :key="book.isbn" class="book flex items-center justify-center text-white text-xs font-bold transform rotate-180 p-1 m-1 rounded-sm cursor-pointer"
                :style="{ width: getBookWidth(book.title), backgroundColor: getRandomColor() }"
                @click="openModal(book)">
              <span class="book-title">{{ book.title }}</span>
            </div>
          </div>
        </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import type { IBookshelf } from '@/types/interfaces/IBookshelf';
import type { IBook } from '@/types/interfaces/IBook';

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

const getBookWidth = (title: string) => {
  const charCount = title.length;
  const width = Math.min(10 + charCount * 2, 100); // Max width of 100px
  return `${width}px`;
};
const getRandomColor = () => {
  return bookColors[Math.floor(Math.random() * bookColors.length)];
};

</script>

<style>
</style>
