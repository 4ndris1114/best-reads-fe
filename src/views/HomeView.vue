<template>
  <MainLayout>
    <div class="h-screen overflow-y-auto bg-white text-black">
      <div class="container mx-auto p-4">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <ReadingProgressList />

          <div class="lg:col-span-2 space-y-6">
            <div>
              <h1 class="text-3xl font-bold text-[#1D1D23]">{{ timeGreeting }}, {{ loggedInUser }}!</h1>
              <p class="font-semibold text-[#1D1D23]">See what’s new:</p>
            </div>
          </div>

          <!-- Left Sidebar
          <div class="space-y-6 lg:col-span-1">
            <ReadingChallenge :completed="13" :goal="36" />
            <YearSummary :pages="1345" :books="13" :points="1345" :reviews="12" />
          </div>





          <div class="space-y-6 lg:col-span-1">
            <div class="bg-[#181C20] rounded-xl p-4">
              <BooksOnShelf shelfName="Currently Reading" />
            </div>
            <div>
              <h2 class="text-xl font-bold mb-2">Track your progress</h2>
              <div v-for="progress in readingProgressList" :key="progress.id" class="mb-4">
                <ReadingProgress :id="progress.id" :currentPage="progress.currentPage" :totalPages="progress.totalPages" />
                <button @click="openModal(progress)" class="text-sm text-blue-500 underline mt-1">
                  Update progress
                </button>
              </div>
            </div>
          </div>
        </div>

        <EditProgressModal v-if="selectedProgress" :visible="isModalOpen" :progressId="selectedProgress.id"
          :currentPage="selectedProgress.currentPage" :totalPages="selectedProgress.totalPages"
          @close="isModalOpen = false" @save="updateProgress" /> -->
      </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

import MainLayout from '@/layouts/MainLayout.vue';
import ReadingProgressList from '@/components/ReadingProgressList.vue';
import BooksOnShelf from '@/components/BooksOnShelf.vue';
import ReadingChallenge from '@/components/ReadingChallenge.vue';
import YearSummary from '@/components/YearSummary.vue';
import type { IReadingProgress } from '@/types/interfaces/IReadingProgress';
import EditProgressModal from '@/components/EditProgressModal.vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const loggedInUser = computed(() => userStore.loggedInUser?.username);
const userId = computed(() => userStore.loggedInUser?.id);

const timeGreeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
});

const readingProgressList = computed<IReadingProgress[]>(() => userStore.readingProgress);

const isModalOpen = ref(false);
const selectedProgress = ref<IReadingProgress | null>(null);

onMounted(async () => {
  if (!userId.value) return;
  try {
    await userStore.getAllReadingProgress(userId.value);
  } catch (error) {
    console.error('Failed to fetch reading progress:', error);
  }
});

function openModal(progress: IReadingProgress) {
  selectedProgress.value = progress;
  isModalOpen.value = true;
}
</script>
