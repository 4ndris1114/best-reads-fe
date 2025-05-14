<template>
  <MainLayout>
    <div class="min-h-screen overflow-y-auto bg-white text-black">
      <div class="w-full ">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Reading challenge and stats -->
          <div class="space-y-6 py-8 px-8 bg-gray-100 lg:col-span-3 flex justify-center">
            <ReadingChallenge />
          </div>

          <!-- Main Content (Feed) -->
          <div class="lg:col-span-6 py-1 space-y-2">
            <div>
              <h1 class="text-4xl mt-6 mb-2 font-bold text-[#1D1D23]">{{ timeGreeting }}, {{ loggedInUser }}!</h1>
              <p class="mb-5 text-2xl text-gray-400">See what’s new:</p>
            </div>
            <ActivityFeed />
          </div>

          <!-- Currently reading and progress tracking -->
          <div class="space-y-6 py-8 px-8 bg-gray-100 lg:col-span-3 overflow-y-auto max-h-screen">
            <div>
              <h2 class="text-2xl font-bold mb-2">You're currently reading:</h2>
              <div class="bg-darkBlueBackground border-t-7 border-primary rounded-xl p-4">
                <Bookshelf v-if="currentlyReadingShelf" :shelf="currentlyReadingShelf" />
              </div>
            </div>

            <div>
              <template v-if="currentlyReadingShelf && currentlyReadingShelf.books.length > 0">
                <h2 class="text-xl font-bold rounded-xl mb-2">Track your progress</h2>
                <div class="mb-4">
                <ReadingProgressList  @reviewRequested="(clickedStar, progress) => openReviewModal(clickedStar, progress)"  />
                </div>
              </template>
            </div>
          </div>
          </div>
</div>
<EditProgressModal
  :isEditProgressModalVisible="isEditProgressModalVisible"
  :readingProgress="selectedProgress ??  { id: '', bookId: '', currentPage: 0, totalPages: 0, updatedAt: new Date() }"
  :bookId="selectedProgress?.bookId || ''"
  @closeModal="isEditProgressModalVisible = false"
  v-on-click-outside="isEditProgressModalVisible = false"
 @updateProgress="handleProgressUpdate"
/>
<LeaveReviewModal
  :isOpen="isLeaveReviewModalOpen"
  :ratingValue="starClicked"
  :reviewText="reviewText"
  :isPublic="isPublic"
  :bookId="selectedProgress?.bookId"
  @close="isLeaveReviewModalOpen = false"
  @submit="handleReviewSubmit"
/>
      </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import ActivityFeed from '@/components/activity/ActivityFeed.vue';
import ReadingProgressList from '@/components/ReadingProgressList.vue';
import Bookshelf from '@/components/Bookshelf.vue';
import ReadingChallenge from '@/components/ReadingChallenge.vue';
import type { IReadingProgress } from '@/types/interfaces/IReadingProgress';
import EditProgressModal from '@/components/EditProgressModal.vue';
import { useUserStore } from '@/stores/userStore';
import { useShelfStore } from '@/stores/shelfStore';
import type { IBook } from '@/types/interfaces/IBook';
import { useBookStore } from '@/stores/bookStore';
import { useToastStore } from '@/stores/toastStore';
import type { IBookshelf } from '@/types/interfaces/IBookshelf';
import LeaveReviewModal from '@/components/LeaveReviewModal.vue';
import type { IReview } from '@/types/interfaces/IReview';

const shelfStore = useShelfStore();
const bookStore = useBookStore();
const toastStore = useToastStore();
const userStore = useUserStore();
const currentlyReadingShelf = computed<IBookshelf | null>(() => shelfStore.bookshelves.find((shelf) => shelf.name === 'Currently Reading') || null);
const loggedInUser = computed(() => userStore.loggedInUser?.username);
const userId = computed(() => userStore.loggedInUser?.id);
const selectedProgress = ref<IReadingProgress | null>(null);
const isEditProgressModalVisible = ref(false);
const isLeaveReviewModalOpen = ref(false);
const starClicked = ref(0);
const bookToBeRated = ref<IBook | null>(null);
const usersReview = computed(() => bookToBeRated.value?.reviews.find((review: IReview) => review.userId === userStore.loggedInUser?.id));
const alreadyRated = computed(() => !!usersReview.value);
const reviewText = computed(() => alreadyRated.value ? bookToBeRated.value!.reviews.find((review: IReview) => review.userId === userStore.loggedInUser?.id)!.reviewText : '');
const isPublic = computed(() => alreadyRated.value ? bookToBeRated.value!.reviews.find((review: IReview) => review.userId === userStore.loggedInUser?.id)!.isPublic : true);

const openReviewModal = async (clickedStar: number, progress: IReadingProgress) => {
  starClicked.value = clickedStar;
  selectedProgress.value = progress;
  bookToBeRated.value = bookStore.books.find((book) => book.id === progress.bookId) || null;
  bookStore.selectedBook = bookToBeRated.value;
  isLeaveReviewModalOpen.value = true;
  await userStore.getAllReadingProgress(userStore.loggedInUser!.id);
  await shelfStore.getBookshelvesForUser(userStore.loggedInUser!.id);
};

const timeGreeting = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
})

onMounted(async () => {
  if (!userId.value) return;
  try {
    await shelfStore.getBookshelvesForUser(userId.value);
    currentlyReadingShelf.value =
      shelfStore.bookshelves.find(shelf => shelf.name === 'Currently Reading') || null;

    await userStore.getAllReadingProgress(userId.value);
  } catch (error) {
    console.error('Error loading data:', error);
  }
});

const readingProgressList = computed<IReadingProgress[]>(() => userStore.readingProgress);

const handleProgressUpdate = async (updatedProgress: IReadingProgress) => {
  try {
    await userStore.editReadingProgressById(
      userStore.loggedInUser!.id,
      updatedProgress.id,
      updatedProgress
    );
    selectedProgress.value = updatedProgress;
    isEditProgressModalVisible.value = false;

    if (updatedProgress.currentPage >= updatedProgress.totalPages) {
      isLeaveReviewModalOpen.value = true;
    }
  } catch (error) {
    console.error('Failed to update progress:', error);
  }
};

const handleReviewSubmit = async (payload: { rating: number; reviewText: string; isPublic: boolean }) => {
    try {
        if (!alreadyRated.value) {
            const newReview = {
                userId: userStore.loggedInUser!.id,
                ratingValue: payload.rating,
                reviewText: payload.reviewText,
                isPublic: payload.isPublic
            } as IReview;
            await bookStore.postReview(bookToBeRated.value!.id, newReview);
            toastStore.triggerToast("Review submitted successfully!", "success");
        } else {
            const reviewId = bookToBeRated.value!.reviews.find((review: IReview) => review.userId === userStore.loggedInUser!.id)!.id;
            const updatedReview = {
                id: reviewId,
                userId: userStore.loggedInUser!.id,
                ratingValue: payload.rating,
                reviewText: payload.reviewText,
                isPublic: payload.isPublic
            } as IReview;
            await bookStore.updateReview(bookToBeRated.value!.id, updatedReview);
            toastStore.triggerToast("Review updated successfully!", "success");
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        toastStore.triggerToast("Error submitting review", "error");
    }
    starClicked.value = 0;
    selectedProgress.value = null;
    bookToBeRated.value = null;
    bookStore.selectedBook = null;
    isLeaveReviewModalOpen.value = false;
};

onMounted(async () => {
  if (!userId.value) return;
  try {
    await userStore.getAllReadingProgress(userId.value);
  } catch (error) {
    console.error('Failed to fetch reading progress:', error);
  }
});
</script>
<style scoped>
::-webkit-scrollbar {
  display: none;
}</style>

