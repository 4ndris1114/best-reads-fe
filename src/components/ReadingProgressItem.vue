<template>
  <div class="flex items-center gap-6 bg-primary p-4 rounded shadow">
    <router-link :to="'/bookdetails/' + readingProgress.bookId">
      <CloudinaryImage
        :publicId="book?.coverImage || ''"
        alt="Book cover"
        class="w-20 h-auto rounded"
      />
    </router-link>

    <div class="flex-1">
      <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-white">{{ book?.title || 'Untitled' }}</h2>
      <div class="flex justify-end scale-50">
        <RatingStars></RatingStars>
      </div>
      </div>
      <p class="text-sm text-white">
        <div class="w-full h-3 bg-gray-700 rounded mt-2 overflow-hidden">
        <div
          class="h-full bg-green-400 transition-all duration-300"
          :style="{ width: progressPercent + '%' }"
        ></div>
      </div>
        {{ readingProgress.currentPage }} / {{ readingProgress.totalPages }} pages
      </p>
      <button
        @click="isEditProgressModalOpen = true"
        class="text-blue-500 underline text-sm mt-1"
      >
        Update progress
      </button>
    </div>

    <EditProgressModal
      v-if="isEditProgressModalOpen"
      :isEditProgressModalVisible="isEditProgressModalOpen"
      :readingProgress="readingProgress"
      @closeModal="isEditProgressModalOpen = false"
      @updateProgress="handleProgressUpdate"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import type { IReadingProgress } from '@/types/interfaces/IReadingProgress';
import EditProgressModal from './EditProgressModal.vue';
import CloudinaryImage from './CloudinaryImage.vue';
import { useBookStore } from '@/stores/bookStore';
import { useUserStore } from '@/stores/userStore';
import RatingStars from './RatingStars.vue';

const props = defineProps<{
  readingProgress: IReadingProgress;
}>();

const isEditProgressModalOpen = ref(false);
const bookStore = useBookStore();
const userStore = useUserStore();

const book = computed(() => bookStore.books.find(b => b.id === props.readingProgress.bookId));

const handleProgressUpdate = () => {
  userStore.editReadingProgressById(userStore.loggedInUser!.id, props.readingProgress.id, props.readingProgress);
  isEditProgressModalOpen.value = false;
};

const progressPercent = computed(() => {
  const { currentPage, totalPages } = props.readingProgress;
  if (!totalPages || totalPages === 0) return 0;
  return Math.min(100, Math.round((currentPage / totalPages) * 100));
});

</script>

<style scoped></style>
