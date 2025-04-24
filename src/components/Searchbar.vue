<template>
    <!-- Search container -->
    <div class="flex-1 max-w-2xl mx-8 relative">
        <!-- Search bar -->
        <fa icon="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-black text-sm" />
        <input @click="toggleRecommendations" type="text" v-model="searchQuery"
            placeholder="Search books, authors, or genres..."
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
                <li v-if="searchResults.length > 0" v-for="book in searchResults" :key="book.id"
                    class="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 cursor-pointer">
                    <img :src="imageCache.get(book.coverImage) ?? book.coverImage" :alt="book.title"
                        class="w-12 h-16 object-cover rounded-md"
                        loading="lazy">
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
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useBookStore } from '@/stores/bookStore';
import type { IBook } from '@/types/interfaces/IBook';
import { computed, onMounted, ref, shallowRef, watchEffect } from 'vue';
import { vOnClickOutside } from '@vueuse/components'

onMounted(async () => {
    bookStore.getAllBooks();
})

//caching
const imageCache = shallowRef(new Map<string, string>());

//stores
const bookStore = useBookStore();

//state
const books = computed<IBook[]>(() => bookStore.books);
const searchQuery = ref<string>("");
const isRecommendationsOpen = ref<boolean>(false);
const searchType = ref<string>("books");

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

const searchResults = computed<IBook[]>(() => {
    if (!searchQuery.value) {
        return books.value;
    }
    return books.value.filter(book =>
        book.title.toLowerCase().includes(searchQuery.value.toLowerCase().trim()) ||
        book.author.toLowerCase().includes(searchQuery.value.toLowerCase().trim()) ||
        book.isbn.trim().includes(searchQuery.value.toLowerCase().trim().split("-").join("")) ||
        book.genres.some(genre => genre.toLowerCase().includes(searchQuery.value.toLowerCase().trim()))
    )
});

const toggleRecommendations = () => {
    isRecommendationsOpen.value = !isRecommendationsOpen.value;
};

const toggleSearchType = () => {
    searchType.value = searchType.value === "books" ? "users" : "books";
};

// Start preloading whenever search results change
watchEffect(() => {
    searchResults.value.forEach(book => preloadImage(book.coverImage));
});
</script>

<style scoped></style>
