<template>
  <div class=" bg-white shadow-md rounded-lg overflow-hidden border-2 border-red-900 p-4 w-3xs">
<CloudinaryImage v-if="book.coverImage" :publicId="book.coverImage" alt="Book cover" :width="300" :height="450"></CloudinaryImage>
    <div class="mt-4">
      <h2 class="text-2xl font-semibold text-red-900">{{ book.title }}</h2>
      <p class="text-gray-600">Author: {{ book.author }}</p>
      <p class="text-sm text-gray-500">ISBN: {{ book.isbn }}</p>
      <p class="text-sm text-gray-500">Published: {{ book.publishedDate }}</p>
      <p class="text-sm text-gray-500">Genres: {{ book.genres.join(', ') }}</p>
      <p v-if="$route.name !== 'home'" class="text-sm text-gray-500">Ratings: {{ book.ratings.map(r => r.ratingValue).join(', ') }}</p>
      <p  class="mt-2 text-md font-bold text-red-900">Average Rating: {{ book.averageRating.toFixed(1) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import CloudinaryImage from '@/components/CloudinaryImage.vue';
import type { IBook } from '@/types/interfaces/IBook';

const props = defineProps({
  book: {
    type: Object as () => IBook,
    required: true
  }
});
</script>
