<template>
  <MainLayout>
    <div class="min-h-screen overflow-y-auto bg-white text-black">
      <div class="w-full px-12 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Reading challenge and stats -->
          <div class="space-y-6 lg:col-span-3">
            <ReadingChallenge />
          </div>

          <!-- Main Content (Feed) -->
          <div class="lg:col-span-6 space-y-4">
            <div>
              <h1 class="text-4xl font-bold text-[#1D1D23]">{{ timeGreeting }}, {{ loggedInUser }}!</h1>
              <p class="font-semibold text-xl text-[#1D1D23]">See what’s new:</p>
            </div>
            <ActivityFeed />
          </div>

          <!-- Currently reading and progress tracking -->
          <div class="space-y-6 lg:col-span-3">
            <div>
              <h2 class="text-2xl font-bold mb-2">You're currently reading:</h2>
              <div class="bg-darkBlueBackground rounded-xl p-4">
                <Bookshelf v-if="currentlyReadingShelf" :shelf="currentlyReadingShelf" />
              </div>
            </div>

            <div>
              <h2 class="text-xl font-bold mb-2">Track your progress</h2>
              <ReadingProgressList />
            </div>
          </div>
        </div>

        <!-- Modals -->
        <EditProgressModal
          :isEditProgressModalVisible="isEditProgressModalVisible"
          :readingProgress="selectedProgress ?? { id: '', bookId: '', currentPage: 0, totalPages: 0, updatedAt: new Date() }"
          :bookId="selectedProgress?.bookId || ''"
          @closeModal="isEditProgressModalVisible = false"
          v-on-click-outside="isEditProgressModalVisible = false"
          @updateProgress="handleProgressUpdate"
        />

        <LeaveReviewModal
          v-if="isLeaveReviewModalOpen"
          :bookId="readingProgress.bookId"
          @close="isLeaveReviewModalOpen = false"
        />
      </div>
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
import type { IBookshelf } from '@/types/interfaces/IBookshelf';
import LeaveReviewModal from '@/components/LeaveReviewModal.vue';

const shelfStore = useShelfStore();
const userStore = useUserStore();

const currentlyReadingShelf = ref<IBookshelf | null>(null);
const loggedInUser = computed(() => userStore.loggedInUser?.username);
const userId = computed(() => userStore.loggedInUser?.id);

const isEditProgressModalVisible = ref(false);
const isEditChallengeModalVisible = ref(false);
const isLeaveReviewModalOpen = ref(false);
const selectedProgress = ref<IReadingProgress | null>(null);

const timeGreeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
});

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
</script>
