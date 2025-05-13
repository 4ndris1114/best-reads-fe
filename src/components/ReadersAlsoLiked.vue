<template>
  <div class="flex flex-col h-full overflow-y-auto items-center">
    <div v-if="relatedBooks.length === 0">
      <p class="text-center text-gray-500">No related books found.</p>
    </div>
    <div v-else class="w-full">
      <h1 class="text-3xl text-center my-4 text-highlight font-extrabold">Readers also liked</h1>
      <div class="flex flex-wrap justify-center gap-6">
        <div
          v-for="book in relatedBooks"
          :key="book.id"
          class="flex flex-col items-center p-2 w-64 bg-white rounded-lg shadow-lg"
        >
          <router-link :to="'/bookdetails/' + book.id">
            <CloudinaryImage :publicId="book.coverImage" alt="Book cover" />
          </router-link>
          <h2 class="text-md font-bold mt-4 text-center">{{ book.title }}</h2>
          <h3 class="text-sm font-semibold text-center">{{ book.author }}</h3>
          <p class="text-sm text-gray-700 font-semibold mt-2">
            <fa :icon="['fas', 'star']" class="text-yellow-500"></fa>
            {{ book.averageRating.toFixed(1) }}
          </p>
          <button @click="shelfStore.addBookToBookshelf(book.id, 'wantToRead',)" class="mt-4 bg-highlight text-white py-2 px-4 rounded-md"><fa icon="circle-plus" class="mr-2" />Want to read</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useBookStore } from '@/stores/bookStore';
import { useShelfStore } from '@/stores/shelfStore';
import CloudinaryImage from '@/components/CloudinaryImage.vue';
import type { IBook } from '@/types/interfaces/IBook';

const bookStore = useBookStore();
const shelfStore = useShelfStore();

const props = defineProps<{
  genres: string[];
  bookId: string; // or `number` if it's a number
}>();

// const addBookToShelf = async (shelf: IBookshelf) => {
//     //if the book is already on one of the user's basic bookshelves, offer user to move
//     const shelfContainsBook = isBookInBasicShelf(book.value!, userShelves.value.filter((shelf) => !shelf.isMutable));

//     if (!shelf.isMutable && shelfContainsBook) {
//         //render a modal that asks user to move book to another bookshelf
//         currentBasicShelf.value = shelfContainsBook;
//         isMoveBookModalOpen.value = true;
//         isShelfDropdownOpen.value = false;
//         return;
//     }
//     try {
//         await shelfStore.addBookToBookshelf(userStore.loggedInUser!.id, shelf.id, book.value!.id);
//         toastStore.triggerToast("Book added to shelf successfully!", "success");
//         isShelfDropdownOpen.value = false;
//     } catch (error) {
//         console.error('Error adding book to shelf:', error);
//         toastStore.triggerToast("This book is already added to this bookshelf", "error");
//         isShelfDropdownOpen.value = false;
//     }
// };

onMounted(() => {
  bookStore.fetchBooks();
});

const relatedBooks = computed<IBook[]>(() => {
  if (!props.genres || !bookStore.books.length) return [];

  return bookStore.books.filter(book =>
    book.id !== props.bookId &&
    book.genres?.some(genre =>
      props.genres.some(input =>
        genre.toLowerCase().includes(input.toLowerCase())
      )
    )
  );
});
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}</style>
