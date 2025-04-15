<template>
    <MainLayout>
        <div v-if="!book">
            <p class="text-red-500">Uh-oh, we couldn't find that book.</p>
            <router-link to="/" class="text-blue-500 underline">Back to home</router-link>
        </div>
        <div v-else class="flex flex-row">
            <!-- Book cover, button, rating -->
            <div class="flex flex-col md:space-y-6 sm:space-y-4 space-y-3 items-center w-[25vw] pt-[6vh] ml-[5vw]">
                <CloudinaryImage :publicId="book.coverImage" alt="Book cover" :width="300" :height="450" />
                <!-- Bookshelves button and dropdown -->
                <div class="relative">
                    <button class="bg-highlight text-white px-4 sm:py-2 py-1 rounded-lg focous-none shadow-lg cursor-pointer min-w-4/5 flex items-center lg:text-lg md:text-sm sm:text-xs justify-center" 
                        @click="toggleShelvesDropdown">
                        <!-- Conditional? What if its at already want to read? -->
                        <span class="sm:block hidden">Add to bookshelf <fa icon="circle-plus" class="ml-2" /></span>
                        <span class="sm:hidden block text-xs">Add <fa icon="circle-plus" class="ml-2" /></span>
                    </button>
                    <div v-if="isShelfDropdownOpen" class="absolute lg:top-11 md:top-9 sm:top-8 right-0 z-50 w-full text-center">
                        <ul class="bg-white border border-black rounded-lg shadow-lg lg:text-lg md:text-md sm:text-sm xs:text-xs">
                            <li v-for="shelf in userShelves" :key="shelf.id" @click="addBookToShelf(shelf)" class="px-4 py-2 text-left hover:bg-gray-200 cursor-pointer">
                                {{ shelf.name }}
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- Rate the book (stars) -->
                <div class="flex lg:space-x-5 md:space-x-2 sm:space-x-1 xs:space-x-0">
                    <fa 
                    v-for="n in 5"
                    :key="n"
                    :icon="['fas', 'star']" 
                    class="lg:scale-200 md:scale-150 sm:scale-125 cursor-pointer transition-colors duration-200"
                    :class="n <= hoveredStar ? 'text-yellow-500' : 'text-slate-300'"
                    @mouseover="setHovered(n)"
                    @mouseleave="resetHovered" />
                </div>
                <span class="md:text-lg sm:text-md -mt-2">Rate book</span>
            </div>
            <!-- Book details -->
            <div class="flex flex-col space-y-2 w-[65vw] pt-[5.5vh] md:pl-[1vw] pl-[4vw] p-[6vw]">
                <div class="flex flex-row items-center space-x-[3vw] relative">
                    <h1 class="lg:text-4xl md:text-3xl sm:text-2xl text-xl text-highlight font-bold max-w-[25vw]">{{ book.title }}</h1>
                    <div v-if="book.averageRating" class="sm:block hidden absolute top-2 right-0 lg:space-x-4 md:space-x-2">
                        <fa 
                        v-for="n in 5"
                        :key="n"
                        :icon="['fas', 'star']" 
                        class="lg:scale-200 md:scale-150 cursor-pointer transition-colors duration-200"
                        :class="n <= Math.floor(book.averageRating) ? 'text-yellow-500' : 'text-slate-300'"
                        />
                        <span class="text-lg -mt-3">({{ book.averageRating }})</span>
                    </div>
                </div>
                <p class="text-2xl text-gray-500">{{ book.author }}</p>
                <span class="block sm:hidden text-lg"> <fa :icon="['fas', 'star']" class="text-yellow-500"></fa>({{ book.averageRating }})</span>

                <!-- Replace later -->
                <p v-if="!isShowingMore" class="pt-[3vh] text-justify">{{ bookDescription.length > 500 ? bookDescription.substring(0, 500).trim() + "..." : bookDescription }} 
                    <a v-if="bookDescription.length > 500" href="#" class="pl-2 text-highlight underline"
                    @click="isShowingMore = true">Show more</a>
                </p>
                <p v-else class="pt-[3vh] text-justify">{{ bookDescription }}
                    <a href="#" class="pl-2 text-highlight underline"
                    @click="isShowingMore = false">Show less</a>
                    <br />
                    <div v-if="book.publishedDate" class="pt-[3vh] text-sm text-gray-500">Published: {{ book.publishedDate.toString().split('T')[0] }}</div>
                </p>
                <!-- Genres -->
                <div class="text-sm text-gray-500 list-disc list-inside flex flex-row space-x-2 mt-6">
                    <div 
                    v-for="genre in book.genres" 
                    :key="genre"
                    class="bg-primary w-fit p-2 rounded-full text-white">{{ genre }}</div>
                </div>
                <!-- Reviews -->
                <h2 class="mt-[5vh] text-3xl text-black">Reviews</h2>
                <div v-for="review in book.ratings" :key="review.userId" :review="review">
                    <ReviewBox :review="review" />
                </div>
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
import ReviewBox from '@/components/ReviewBox.vue';
import CloudinaryImage from '@/components/CloudinaryImage.vue';
import type { IBook } from '@/types/interfaces/IBook';
import type { IBookshelf } from '@/types/interfaces/IBookshelf';
import { useUserStore } from '@/stores/userStore';

const bookStore = useBookStore();
const userStore = useUserStore();
const route = useRoute();

// REPLCE LATER
const bookDescription = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It but also the leap into electronic typesetting, but also the leap into electronic typesetting, but also the leap into electronic typesetting, but also the leap into electronic typesetting, but also the leap into electronic typesetting,"
// -------

onMounted(() => {
    bookIdFromRoute.value = route.params.id as string | null;
    if (bookIdFromRoute.value) {
        bookStore.selectBook(bookIdFromRoute.value);
    }
});

const bookIdFromRoute = ref<string | null>(null);
const book = computed<IBook | null>(() => bookStore.selectedBook);
const userShelves = computed<IBookshelf[]>(() => userStore.loggedInUser ? userStore.loggedInUser.bookshelves : []);
const hoveredStar = ref(0);

const isShowingMore = ref(false);
const isShelfDropdownOpen = ref(false);

const error = ref<string>("");

const addBookToShelf = (shelf: IBookshelf) => {
    // shelfStore.addBookToShelf(shelfId, book.value!.id);
    // shelvesDropdownOpen.value = false;
};

// Functions to update hovered state for rating
const setHovered = (index: number) => {
  hoveredStar.value = index;
};
const resetHovered = () => {
  hoveredStar.value = 0;
};

const toggleShelvesDropdown = () => {
    isShelfDropdownOpen.value = !isShelfDropdownOpen.value;
};
</script>

<style scoped>

</style>