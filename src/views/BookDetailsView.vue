<template>
    <div v-if="!book">
        <p class="text-red-500">Uh-oh, we couldn't find that book.</p>
        <router-link to="/" class="text-blue-500 underline">Back to home</router-link>
    </div>
    <div v-else class="flex flex-row">
        <!-- Book cover, button, rating -->
        <div class="flex flex-col space-y-6 items-center">
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
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useBookStore } from '@/stores/bookStore';
import { useRoute } from 'vue-router';

const bookStore = useBookStore();
const route = useRoute();

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