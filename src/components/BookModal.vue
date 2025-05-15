<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div class="relative bg-white p-6 pt-10 rounded-lg w-[400px] border-t-4 border-blue-700 shadow-lg">
      <!-- Top icon -->
      <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md">
        <fa icon="book" class="text-blue-700 text-2xl" />
      </div>

      <!-- Book Details -->
      <h2 class="text-2xl mb-2 font-bold text-center">{{ book?.title }}</h2>
      <p><strong>Author:</strong> {{ book?.author }}</p>
      <p><strong>Genres:</strong> {{ book?.genres.join(', ') }}</p>
      <p><strong>Average Rating:</strong> {{ book?.averageRating }}</p>
      <p><strong>ISBN:</strong> {{ book?.isbn }}</p>
      <p>
        <strong>Published Date:</strong>
        {{ new Date(book?.publishedDate).toLocaleDateString('en-GB').replace(/\//g, '-') }}
      </p>

      <!-- Buttons -->
      <div class="flex justify-center gap-4 mt-6">
        <button
          @click="goToDetails"
          class="w-36 px-4 py-2 bg-blue-700 text-white font-semibold rounded hover:bg-blue-800 transition"
        >
          See Details
        </button>
        <button
          @click="close"
          class="w-20 px-4 py-2 bg-red-700 text-white font-semibold rounded hover:bg-red-500 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { IBook } from '@/types/interfaces/IBook';

const props = defineProps({
  book: Object as () => IBook,
  isVisible: Boolean,
});

const emit = defineEmits(['closeModal']);
const router = useRouter();

const close = () => {
  emit('closeModal');
};

const goToDetails = () => {
  if (props.book?.id) {
    router.push(`/bookdetails/${props.book.id}`);
    close();
  }
};
</script>
<style scoped></style>
