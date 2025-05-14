<template>
    <!-- Search container -->
    <div class="flex-1 max-w-2xl mx-8 relative">
        <!-- Search bar -->
        <fa icon="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-black text-sm" />
        <input @click="toggleRecommendations" type="text" v-model="searchQuery"
            placeholder="Search books, authors, genres, and users..."
            class="w-full px-4 py-2 pl-10 border-none bg-gray-100 text-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

        <fa v-if="isRecommendationsOpen" icon="arrow-down" class="absolute right-3 top-3 text-gray-400 text-sm" />

        <!-- Search recommendations -->
        <div v-on-click-outside="toggleRecommendations" v-if="isRecommendationsOpen"
            class="absolute w-full mt-1 bg-white shadow-lg rounded-lg overflow-y-auto max-h-[69vh] z-50">
            <div class="flex items-center justify-evenly px-4 py-2 border-b">
                <div
                    class="flex-1 text-center px-4 py-2 cursor-pointer rounded-t-lg transition-all duration-200"
                    @click="searchType = 'books'"
                    :class="searchType === 'books' ? 'bg-gray-200 font-bold text-gray-900 shadow-inner' : 'bg-white text-gray-700'"
                >
                    Search Books
                </div>

                <div
                    class="flex-1 text-center px-4 py-2 cursor-pointer rounded-t-lg transition-all duration-200"
                    @click="searchType = 'users'"
                    :class="searchType === 'users' ? 'bg-gray-200 font-bold text-gray-900 shadow-inner' : 'bg-white text-gray-700'"
                >
                    Search Users
                </div>
            </div>
            <ul>
                <!-- Book results -->
                <template v-if="searchType === 'books' && bookSearchResults.length > 0">
                    <li v-for="book in bookSearchResults" :key="book.id"
                        @click="$router.push({ name: 'bookdetails', params: { id: book.id } })"
                        class="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 cursor-pointer">
                        <CloudinaryImage :publicId="imageCache.get(book.coverImage) ?? book.coverImage" :alt="book.title" :width="45" :height="70" />
                        <div class="flex-1">
                            <h3 class="font-semibold text-sm text-gray-900">{{ book.title }}</h3>
                            <p class="text-xs text-gray-600">by {{ book.author }}</p>
                            <div class="flex items-center gap-1 mt-1">
                            <fa icon="star" v-for="n in Math.floor(book.averageRating)" :key="n"
                                class="text-yellow-400 text-xs" />
                            <span class="text-xs text-gray-500">({{ book.averageRating }})</span>
                            </div>
                        </div>
                    </li>
                </template>

                <!-- User results -->
                <template v-else-if="searchType === 'users' && userSearchResults.length > 0">
                    <li
                        v-for="user in userSearchResults"
                        @click="$router.push({ name: 'profilepage', params: { id: user.id } })"
                        :key="user.id"
                        class="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    >
                        <img
                            :src="'../src/assets/' + user?.profilePicture"
                            alt="Profile Picture"
                            class="w-10 h-10 rounded-full object-cover border"
                        />
                        <div class="flex-1">
                            <h3 class="font-semibold text-sm text-gray-900">{{ user.username }}</h3>
                            <p v-if="user.bio" class="text-xs text-gray-600">
                                {{ user.bio.length > 50 ? user.bio.substring(0, 50) + '...' : user.bio }}
                            </p>
                        </div>
                    </li>
                </template>

                <!-- Start typing -->
                <li v-if="searchQuery.length === 0" class="text-center text-gray-500 text-sm py-4">
                    Start typing to search for {{ searchType === 'books' ? 'books' : 'users' }}.
                </li>
                <!-- No results -->
                <li
                v-else-if="(searchType === 'books' && bookSearchResults.length === 0) || (searchType === 'users' && userSearchResults.length === 0)"
                class="text-center text-gray-500 text-sm py-4 flex flex-col items-center gap-2"
                >
                <span v-if="!isExternalLoading && openLibrarySearchResults.length === 0 && !couldntFind">
                No results found in our database. Search externally?
                </span>

                <div class="flex flex-wrap gap-2 justify-center mt-2" v-if="!isExternalLoading && openLibrarySearchResults.length === 0 && !couldntFind">
                <button @click="handleOpenLibrarySearch('title')" class="bg-accent text-white px-4 py-1 rounded hover:opacity-90 text-sm cursor-pointer">
                    Search by Title
                </button>
                <button @click="handleOpenLibrarySearch('author')" class="bg-accent text-white px-4 py-1 rounded hover:opacity-90 text-sm cursor-pointer">
                    Search by Author
                </button>
                </div>
                <div v-else-if="couldntFind" class="flex flex-wrap gap-2 justify-center mt-2 text-red-500">
                    We can't find this book.
                </div>

                <div v-if="isExternalLoading" class="py-4 text-sm text-gray-500 flex justify-center items-center gap-2">
                <span>Searching for {{ debouncedQuery }}...</span>
                <svg class="animate-spin h-4 w-4 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                </div>

                <!-- External Results -->
                <template v-if="openLibrarySearchResults.length > 0">
                <li v-for="book in openLibrarySearchResults" :key="book.id"
                    @click="$router.push({ name: 'bookdetails', params: { id: book.id } })"
                    class="flex w-full items-center text-left gap-4 px-4 py-3 hover:bg-gray-100 cursor-pointer">
                    <CloudinaryImage :publicId="imageCache.get(book.coverImage) ?? book.coverImage" :alt="book.title" :width="45" :height="70" />
                    <div class="flex-1">
                    <h3 class="font-semibold text-sm text-gray-900">{{ book.title }}</h3>
                    <p class="text-xs text-gray-600">by {{ book.author }}</p>
                    <div class="flex items-center gap-1 mt-1">
                        <fa icon="star" v-for="n in Math.floor(book.averageRating || 0)" :key="n" class="text-yellow-400 text-xs" />
                        <span class="text-xs text-gray-500">({{ book.averageRating ?? 'N/A' }})</span>
                    </div>
                    </div>
                </li>
                </template>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useBookStore } from '@/stores/bookStore';
import { useUserStore } from '@/stores/userStore';
import type { IBook } from '@/types/interfaces/IBook';
import { ref, shallowRef, watch, watchEffect } from 'vue';
import { vOnClickOutside } from '@vueuse/components';
import CloudinaryImage from './CloudinaryImage.vue';
import type { IUser } from '@/types/interfaces/IUser';
import debounce from 'lodash/debounce';
import type { IBookSearchResult } from '@/types/interfaces/IBookSearchResult';

// Stores
const bookStore = useBookStore();
const userStore = useUserStore();

// State
const searchQuery = ref<string>('');
const debouncedQuery = ref<string>('');
const searchType = ref<string>('books');
const isRecommendationsOpen = ref<boolean>(false);
const imageCache = shallowRef(new Map<string, string>());
const isExternalLoading = ref(false);
const couldntFind = ref(false);

const bookSearchResults = ref<IBookSearchResult[]>([]);
const openLibrarySearchResults = ref<IBook[]>([]);
const userSearchResults = ref<Partial<IUser>[]>([]);

// Debounced input handling
const handleSearchInput = debounce((value: string) => {
openLibrarySearchResults.value = [];
  debouncedQuery.value = value.trim();
}, 600);

watch(searchQuery, (newVal) => {
  handleSearchInput(newVal);
});

watch(couldntFind, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      couldntFind.value = false;
    }, 3000);
  }
});

// Watch debounced query and search in DB
watchEffect(async () => {
  if (!debouncedQuery.value) {
    bookSearchResults.value = [];
    userSearchResults.value = [];
    return;
  }

  if (searchType.value === 'books') {
    try {
      const books = await bookStore.searchBooks(debouncedQuery.value);
      bookSearchResults.value = books;
    } catch (error) {
      console.error('Failed to search books:', error);
    }
  }

  if (searchType.value === 'users') {
    const results = await userStore.searchByUsername(debouncedQuery.value);
    userSearchResults.value = Array.isArray(results) ? results as Partial<IUser>[] : [];
  }
});

// Image preloading
const resizeImage = (url: string, width = 100, height = 150, quality = 0.7) => {
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
  });
};

const preloadImage = async (url: string) => {
  if (!imageCache.value.has(url)) {
    const compressedImage = await resizeImage(url, 100, 150, 0.6);
    imageCache.value.set(url, compressedImage);
    imageCache.value = new Map(imageCache.value); // Trigger reactivity
  }
};

// Preload images when book results change
watch(bookSearchResults, (books) => {
  books.forEach(book => preloadImage(book.coverImage));
});

const handleOpenLibrarySearch = async (type: string) => {
  isExternalLoading.value = true;
  openLibrarySearchResults.value = [];

  try {
    switch (type) {
      case 'title':
        try {
            const foundByTitle = await bookStore.searchAndAddFromOpenLibrary(debouncedQuery.value, 'title');
            if (foundByTitle) {
            openLibrarySearchResults.value = foundByTitle;
            }
        } catch (error) {
            couldntFind.value = true;
        }
        break;
      case 'author':
        try {
            const foundByAuthor = await bookStore.searchAndAddFromOpenLibrary(debouncedQuery.value, 'author');
            if (foundByAuthor) {
            openLibrarySearchResults.value = foundByAuthor;
            }
        } catch (error) {
            couldntFind.value = true;
        }
        break;
    }
  } catch (error) {
    console.error('External search failed:', error);
  } finally {
    isExternalLoading.value = false;
  }
};

// Helpers
const toggleRecommendations = () => {
  isRecommendationsOpen.value = !isRecommendationsOpen.value;
};
</script>


<style scoped></style>
