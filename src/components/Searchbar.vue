<template>
    <!-- Search container -->
    <div class="flex-1 max-w-2xl mx-8 relative">
        <!-- Search bar -->
        <fa icon="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input @click="toggleRecommendations()" type="text" v-model="searchQuery" placeholder="Search books, authors, or genres..."
            class="w-full px-4 py-2 pl-10 border-none bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        
        <!-- Search recommendations -->
        <div @click.self="toggleRecommendations()" v-if="searchResults.length > 0 && isRecommendationsOpen" >
        <ul
            class="absolute w-full mt-2 bg-white shadow-lg rounded-lg overflow-hidden z-50">
            <li v-for="result in searchResults" :key="result.id" 
                class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer">
                {{ result.title }}
            </li>
        </ul>
    </div>
    </div>
</template>

<script setup lang="ts">
import { useBookStore } from '@/stores/bookStore';
import type { IBook } from '@/types/interfaces/IBook';
import { computed, onMounted, ref } from 'vue';

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
        book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        book.genres.some(genre => genre.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
});

const toggleRecommendations = () => {
    console.log(isRecommendationsOpen.value);
    
    isRecommendationsOpen.value = !isRecommendationsOpen.value;
};
</script>

<style scoped>

</style>