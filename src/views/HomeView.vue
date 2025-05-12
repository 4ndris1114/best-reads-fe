<template>
  <MainLayout>
    <div class="h-screen bg-white text-black">
      <div class="container mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ReadingChallenge></ReadingChallenge>
          <YearSummary></YearSummary>
          <div class="lg:col-span-2  p-4 space-y-6">
            <div>
              <h1 class="text-4xl font-bold text-[#1D1D23]">{{ timeGreeting }}, {{ loggedInUser }}!</h1>
              <p class="font-semibold text-xl text-[#1D1D23]">See what’s new:</p>
            </div>
          </div>
  <div class="bg-primary h-screen overflow-y-auto p-4 mb-4">
          <div class="space-y-6 lg:col-span-1 ">
            <h2 class="text-2xl font-bold mb-2">You're currently reading:</h2>
            <div class="bg-[#181C20] rounded-xl p-4">
              <Bookshelf v-if="currentlyReadingShelf" :shelf="currentlyReadingShelf" />
            </div>
            <div>
              <template v-if="currentlyReadingShelf && currentlyReadingShelf.books.length > 0">
                <h2 class="text-xl font-bold rounded-xl mb-2">Track your progress</h2>
                <div class="mb-4">
                <ReadingProgressList  @reviewRequested="openReviewModal" />
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
  v-if="isLeaveReviewModalOpen"
  :bookId="selectedProgress?.bookId"
  @close="isLeaveReviewModalOpen = false"
/>
      </div>
    </div>
    <ActivityFeed />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import ActivityFeed from '@/components/activity/ActivityFeed.vue';
import ReadingProgressList from '@/components/ReadingProgressList.vue';
import Bookshelf from '@/components/Bookshelf.vue';
import ReadingChallenge from '@/components/ReadingChallenge.vue';
import YearSummary from '@/components/YearSummary.vue';
import type { IReadingProgress } from '@/types/interfaces/IReadingProgress';
import EditProgressModal from '@/components/EditProgressModal.vue';
import { useUserStore } from '@/stores/userStore';
import { useShelfStore } from '@/stores/shelfStore';
import type { IBookshelf } from '@/types/interfaces/IBookshelf';
import LeaveReviewModal from '@/components/LeaveReviewModal.vue';

const shelfStore = useShelfStore();
const currentlyReadingShelf = ref<IBookshelf | null>(null);
const userStore = useUserStore();
const loggedInUser = computed(() => userStore.loggedInUser?.username);
const userId = computed(() => userStore.loggedInUser?.id);
const readingProgressList = computed<IReadingProgress[]>(() => userStore.readingProgress);
const selectedProgress = ref<IReadingProgress | null>(null);
const isEditProgressModalVisible = ref(false);
const isLeaveReviewModalOpen = ref(false);

const openReviewModal = (progress: IReadingProgress) => {
  selectedProgress.value = progress;
  isLeaveReviewModalOpen.value = true;
};


onMounted(async () => {
  if (!userId.value) return;
  try {
    await shelfStore.getBookshelvesForUser(userId.value);
    currentlyReadingShelf.value = shelfStore.bookshelves.find(
      (shelf) => shelf.name === 'Currently Reading'
    ) || null;

    await userStore.getAllReadingProgress(userId.value);
  } catch (error) {
    console.error('Error loading data:', error);
  }
});

const timeGreeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
});


const handleProgressUpdate = async (updatedProgress: IReadingProgress) => {
  try {
    await userStore.editReadingProgressById(
      userStore.loggedInUser!.id,
      updatedProgress.id,
      updatedProgress
    );

    // Update selected progress
    selectedProgress.value = updatedProgress;
    isEditProgressModalVisible.value = false;

    // Open review modal if book is finished
    if (updatedProgress.currentPage >= updatedProgress.totalPages) {
      isLeaveReviewModalOpen.value = true;
    }
  } catch (error) {
    console.error('Failed to update progress:', error);
  }
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
<style scoped></style>
