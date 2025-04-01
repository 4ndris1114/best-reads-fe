<template>
    <MainLayout>
        <div v-if="!book">
            <p class="text-red-500">Uh-oh, we couldn't find that book.</p>
            <router-link to="/" class="text-blue-500 underline">Back to home</router-link>
        </div>
        <div v-else class="flex flex-row">
            <!-- Book cover, button, rating -->
            <div class="flex flex-col space-y-6 items-center w-[25vw]">
                <img :src="book.coverImage" alt="Book cover" class="w-64 h-86" />
                <!-- Want to read button -->
                <button class="bg-highlight text-white px-12 py-2 rounded-full focous-none shadow-lg cursor-pointer w-5/6" @click="">
                    <!-- Conditional? What if its at already want to read? -->
                    Want to Read 
                </button>
                <!-- Rate the book (stars) -->
                <div class="flex space-x-5">
                    <fa 
                    v-for="n in 5"
                    :key="n"
                    :icon="['fas', 'star']" 
                    class="scale-200 cursor-pointer transition-colors duration-200"
                    :class="n <= hoveredStar ? 'text-yellow-500' : 'text-slate-300'"
                    @mouseover="setHovered(n)"
                    @mouseleave="resetHovered" />
                </div>
                <span class="text-lg -mt-2">Rate this book</span>
            </div>
            <!-- Book details -->
            <div class="flex flex-col space-y-4 w-[65vw]">
                <h1 class="text-4xl text-highlight font-bold">{{ book.title }}</h1>
                <p class="text-sm text-gray-500">{{ book.author }}</p>
                <!-- Replace later -->
                <p>{{ bookDescription.length > 500 ? bookDescription.substring(0, 500).trim() + "..." : bookDescription }}</p>
                <p class="text-sm text-gray-500"></p>
                <ul class="text-sm text-gray-500 list-disc list-inside">
                    <li v-for="genre in book.genres" :key="genre">{{ genre }}</li>
                </ul>
            </div>
            <div class="border-l-3 border-black min-h-screen w-[25vw]">
                <h1 class="text-3xl">Readers also liked</h1>
            </div>
        </div>
    </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useBookStore } from '@/stores/bookStore';
import { useRoute } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';

const bookStore = useBookStore();
const route = useRoute();

// REPLCE LATER
const bookDescription = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It"
// -------

onMounted(() => {
    bookIdFromRoute.value = route.params.id as string | null;
    if (bookIdFromRoute.value) {
        bookStore.selectBook(bookIdFromRoute.value);
    }
});

const bookIdFromRoute = ref<string | null>(null);
const book = computed(() => bookStore.selectedBook);
const hoveredStar = ref(0);

const error = ref<string>("");

// Functions to update hovered state for rating
const setHovered = (index: number) => {
  hoveredStar.value = index;
};
const resetHovered = () => {
  hoveredStar.value = 0;
};
</script>

<style scoped>

</style>