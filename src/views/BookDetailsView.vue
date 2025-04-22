<template>
    <MainLayout>
        <div v-if="!book">
            <p class="text-red-500">Uh-oh, we couldn't find that book.</p>
            <router-link to="/" class="text-blue-500 underline">Back to home</router-link>
        </div>
        <div v-else class="flex flex-row h-full overflow-y-auto">
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
                        <div v-if="!userStore.isAuthenticated" 
                            @click="$router.push('/login')"
                            class="bg-white border border-black rounded-lg shadow-lg lg:text-lg md:text-md sm:text-sm xs:text-xs">
                            <a href="/login" class="py-2 text-left cursor-pointer underline text-blue-600">Log in</a>
                            to add to a bookshelf
                        </div>
                        <ul v-else class="bg-white border border-black rounded-lg shadow-lg lg:text-lg md:text-md sm:text-sm xs:text-xs max-h-[22vh] overflow-y-auto">
                            <li v-for="shelf in userShelves" :key="shelf.id" @click="addBookToShelf(shelf)" class="px-4 py-2 text-left hover:bg-gray-200 cursor-pointer">
                                {{ shelf.name }}
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- Rate the book (stars) -->
                <div v-if="alreadyRated" class="flex flex-col items-center relative">
                    <span class="md:text-lg sm:text-md mb-2">                    <!-- Tooltip -->
                        <fa icon="info-circle" class="text-sm text-gray-600 mr-2 cursor-pointer"
                                @click="showReviewTooltip = !showReviewTooltip" @mouseenter="showReviewTooltip = true"
                                @mouseleave="showReviewTooltip = false" />
                                You rated this book:
                    </span>
                    <div v-if="showReviewTooltip"
                        class="absolute top-1/2 left-0 w-64 p-3 text-sm text-white bg-gray-800 rounded-lg shadow-lg z-10">
                        Click on the stars to change your rating for this book.
                    </div>
                    <div class="flex lg:space-x-5 md:space-x-2 sm:space-x-1 xs:space-x-0">
                        <fa 
                        v-for="n in 5"
                        :key="n"
                        :icon="['fas', 'star']" 
                        class="lg:scale-200 md:scale-150 sm:scale-125 cursor-pointer transition-colors duration-200"
                        :class="(hoveredStar || book.reviews.find(review => review.userId === userStore.loggedInUser!.id)!.ratingValue) >= n ? 'text-yellow-500' : 'text-slate-300'"
                        @mouseover="setHovered(n)"
                        @mouseleave="resetHovered"
                        @click="clickedStar = n; showReviewModal = true" />
                    </div>
                </div>
                <div v-else class="flex flex-col items-center relative">
                    <span class="md:text-lg sm:text-md mb-2">                    <!-- Tooltip -->
                        <fa icon="info-circle" class="text-sm text-gray-600 mr-2 cursor-pointer"
                                @click="showReviewTooltip = !showReviewTooltip" @mouseenter="showReviewTooltip = true"
                                @mouseleave="showReviewTooltip = false" />
                                Rate this book:
                    </span>
                    <div v-if="showReviewTooltip"
                        class="absolute top-1/2 left-0 w-64 p-3 text-sm text-white bg-gray-800 rounded-lg shadow-lg z-10">
                        Click on the stars to rate this book.
                    </div>
                    <div class="flex lg:space-x-5 md:space-x-2 sm:space-x-1 xs:space-x-0">
                        <fa 
                        v-for="n in 5"
                        :key="n"
                        :icon="['fas', 'star']" 
                        class="lg:scale-200 md:scale-150 sm:scale-125 cursor-pointer transition-colors duration-200"
                        :class="n <= hoveredStar ? 'text-yellow-500' : 'text-slate-300'"
                        @mouseover="setHovered(n)"
                        @mouseleave="resetHovered"
                        @click="clickedStar = n; showReviewModal = true" />
                    </div>
                </div>
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

                <p v-if="!isShowingMore" class="pt-[3vh] text-justify">{{ book.description.length > 500 ? book.description.substring(0, 500).trim() + "..." : book.description }} 
                    <a v-if="book.description.length > 500" href="#" class="pl-2 text-highlight underline"
                    @click="isShowingMore = true">Show more</a>
                </p>
                <p v-else class="pt-[3vh] text-justify">{{ book.description }}
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
                <h2 class="mt-[5vh] text-3xl text-black pb-2">Reviews</h2>
                <div v-for="review in book.reviews.filter(review => review.isPublic || review.userId === userStore.loggedInUser?.id)" :key="review.userId" :review="review">
                    <ReviewBox :review="review" />
                </div>
            </div>
            <div class="border-l-4 border-black h-screen w-[25vw] p-4 sticky top-0">
                <h1 class="text-3xl">Readers also liked</h1>
            </div>
        </div>
        <ToastNotification :show="showToast" :toastType="toastType" :message="toastMessage" />
        <MoveBookModal v-if="book" @click.self="isMoveBookModalOpen = false"
        :isOpen="isMoveBookModalOpen"
        :currentShelf="currentBasicShelf"
        :targetShelves="userShelves.filter(s => !s.isMutable && s.id !== currentBasicShelf?.id)"
        :bookId="book!.id"
        @move="moveBookToNewShelf"
        @close="isMoveBookModalOpen = false"
        />
        <LeaveReviewModal
            :isOpen="showReviewModal"
            :ratingValue="clickedStar"
            :reviewText="reviewText"
            @submit="handleReviewSubmit"
            @close="showReviewModal = false"
        />
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
import { useShelfStore } from '@/stores/shelfStore';
import ToastNotification from '@/components/ToastNotification.vue';
import { isBookInBasicShelf } from '@/utils/shelfActions';
import MoveBookModal from '@/components/MoveBookModal.vue';
import LeaveReviewModal from '@/components/LeaveReviewModal.vue';
import type { IReview } from '@/types/interfaces/IReview';

const bookStore = useBookStore();
const userStore = useUserStore();
const shelfStore = useShelfStore();
const route = useRoute();

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
const alreadyRated = computed(() => book.value?.reviews.some((review: IReview) => review.userId === userStore.loggedInUser?.id));
const reviewText = computed(() => alreadyRated.value ? book.value!.reviews.find((review: IReview) => review.userId === userStore.loggedInUser?.id)!.reviewText : '');

const isShowingMore = ref(false);
const isShelfDropdownOpen = ref(false);
const isMoveBookModalOpen = ref(false);
const currentBasicShelf = ref<IBookshelf | null>(null);

const showReviewModal = ref(false);
const clickedStar = ref(0);
const showReviewTooltip = ref(false);

const toastType = ref("");
const toastMessage = ref("");
const showToast = ref(false);

const addBookToShelf = async (shelf: IBookshelf) => {
    //if the book is already on one of the user's basic bookshelves, offer user to move
    const shelfContainsBook = isBookInBasicShelf(book.value!, userShelves.value.filter((shelf) => !shelf.isMutable));
    
    if (!shelf.isMutable && shelfContainsBook) {
        //render a modal that asks user to move book to another bookshelf
        currentBasicShelf.value = shelfContainsBook;
        isMoveBookModalOpen.value = true;
        isShelfDropdownOpen.value = false;
        return;
    }
    try {
        await shelfStore.addBookToBookshelf(userStore.loggedInUser!.id, shelf.id, book.value!.id);
        showToastMessage("Book added to shelf successfully!", "success");
        isShelfDropdownOpen.value = false;
    } catch (error) {
        console.error('Error adding book to shelf:', error);
        showToastMessage("This book is already added to this bookshelf", "error");
        isShelfDropdownOpen.value = false;
    }
};

const moveBookToNewShelf = async (shelfId: string) => {
    try {
        await shelfStore.moveBookToBookshelf(userStore.loggedInUser!.id, currentBasicShelf.value!.id, book.value!.id, shelfId);
        showToastMessage("Book moved to new shelf successfully!", "success");
        isMoveBookModalOpen.value = false;
    } catch (error) {
        console.error('Error moving book to new shelf:', error);
        showToastMessage("Error moving book to new shelf", "error");
        isMoveBookModalOpen.value = false;
    }
}

const handleReviewSubmit = async (payload: { rating: number; reviewText: string; isPublic: boolean }) => {
    try {
        if (!alreadyRated.value) {
            const newReview = {
                userId: userStore.loggedInUser!.id,
                ratingValue: payload.rating,
                reviewText: payload.reviewText,
                isPublic: payload.isPublic
            } as IReview;
            await bookStore.postReview(book.value!.id, newReview);
            showToastMessage("Review submitted successfully!", "success");         
        } else {
            const reviewId = book.value!.reviews.find((review: IReview) => review.userId === userStore.loggedInUser!.id)!.id;
            const updatedReview = {
                id: reviewId,
                userId: userStore.loggedInUser!.id,
                ratingValue: payload.rating,
                reviewText: payload.reviewText,
                isPublic: payload.isPublic
            } as IReview;
            await bookStore.updateReview(book.value!.id, updatedReview);
            showToastMessage("Review updated successfully!", "success");
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        showToastMessage("Error submitting review", "error");
    }
    showReviewModal.value = false;
};

const showToastMessage = (message: string, type: 'success' | 'error') => {
    toastMessage.value = message;
    toastType.value = type;
    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, 3000);
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