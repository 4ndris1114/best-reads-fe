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
        <div v-on-click-outside="toggleRecommendations" v-if="searchResults.length > 0 && isRecommendationsOpen"
            class="absolute w-full mt-1 bg-white shadow-lg rounded-lg overflow-y-auto max-h-[69vh] z-50">
            <ul>
                <li v-for="book in searchResults" :key="book.id"
                    class="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 cursor-pointer">
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
import { computed, onMounted, ref } from 'vue';
import { vOnClickOutside } from '@vueuse/components'

onMounted(async () => {
    bookStore.getAllBooks();
})

//stores
const bookStore = useBookStore();

const books = computed<IBook[]>(() => bookStore.books);
const searchQuery = ref<string>("");
const isRecommendationsOpen = ref<boolean>(false);

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
</script>

<style scoped></style>
