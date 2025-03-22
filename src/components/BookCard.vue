<template>
  <div class="p-4 bg-white shadow-md rounded-lg overflow-hidden border-2 border-red-900 p-4 w-3xs">
    <img v-if="book.coverImage" style="background-image: url('https://picsum.photos/200/200');" class="w-30 h-48 object-cover rounded-md">
    <!-- <img v-if="book.coverImage" :src="book.coverImage" :alt="book.title" class="w-full h-48 object-cover rounded-md"> -->
    <div class="mt-4">
      <h2 class="text-2xl font-semibold text-red-900">{{ book.title }}</h2>
      <p class="text-gray-600">Author: {{ book.author }}</p>
      <p class="text-sm text-gray-500">ISBN: {{ book.isbn }}</p>
      <p class="text-sm text-gray-500">Published: {{ book.publishedDate }}</p>
      <p class="text-sm text-gray-500">Genres: {{ book.genres.join(', ') }}</p>
      <p v-if="$route.name !== 'home'" class="text-sm text-gray-500">Ratings: {{ book.ratings.map(r => r.rating).join(', ') }}</p>
      <p  class="mt-2 text-md font-bold text-red-900">Average Rating: {{ book.averageRating.toFixed(1) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
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

defineProps<{ book: Book }>();
</script>
