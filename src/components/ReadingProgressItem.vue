<template>
  <div v-if="book" class="flex items-center gap-6 bg-[#181c20] p-4 rounded shadow w-full overflow-hidden">
    <!-- Book cover -->
    <router-link :to="'/bookdetails/' + readingProgress.bookId">
      <CloudinaryImage :publicId="book?.coverImage || ''" alt="Book cover"
        class="w-20 h-auto rounded border-2 border-[#3D4D69]" />
    </router-link>

    <!-- Right content -->
    <div class="flex-1 space-y-3 min-w-0">
      <!-- Title and stars -->
      <div class="flex flex-col text-left items-start gap-1">
        <h2
          :class="`font-semibold text-white break-words ${book!.title?.length > 20 ? 'text-md' : 'text-xl'}`">
          {{ book?.title || 'Untitled' }}
        </h2>

        <div class="flex justify-start scale-50">
          <RatingStars @reviewRequested="(clickedStar) => emit('reviewRequested', clickedStar, readingProgress)" />
        </div>
      </div>

      <!-- Progress bar and count -->
      <div class="text-sm text-white space-y-1 w-full">
        <div class="w-full bg-[#3D4D69] rounded h-3 overflow-hidden">
          <div
            class="h-full bg-lime-500 transition-all rounded duration-300"
            :style="{ width: (readingProgress.currentPage / readingProgress.totalPages * 100) + '%' }">
          </div>
        </div>
        <div class="flex justify-between items-center text-xs whitespace-nowrap">
          <span>{{ readingProgress.currentPage }} / {{ readingProgress.totalPages }} pages</span>
          <b class="text-[#547786]">
            ({{ Math.floor(readingProgress.currentPage / readingProgress.totalPages * 100) }}%)
          </b>
        </div>
      </div>

      <!-- Update button -->
      <button
        @click="isEditProgressModalOpen = true"
        class="text-gray-300 font-semibold cursor-pointer text-sm bg-[#3D4D69] px-2 py-1 rounded hover:bg-[#3D4D69]/50 transition">
        Update progress
      </button>
    </div>
  </div>

  <!-- Modal -->
  <EditProgressModal
    v-if="isEditProgressModalOpen"
    :isEditProgressModalVisible="isEditProgressModalOpen"
    :readingProgress="readingProgress"
    @closeModal="isEditProgressModalOpen = false"
    @progressUpdated="handleProgressUpdate"
  />
</template>


<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import type { IReadingProgress } from '@/types/interfaces/IReadingProgress';
import EditProgressModal from './EditProgressModal.vue';
import CloudinaryImage from './CloudinaryImage.vue';
import { useBookStore } from '@/stores/bookStore';
import { useUserStore } from '@/stores/userStore';
import RatingStars from './RatingStars.vue';
import type { IBook } from '@/types/interfaces/IBook';

const props = defineProps<{
  readingProgress: IReadingProgress;
}>();

const isEditProgressModalOpen = ref(false);
const bookStore = useBookStore();
const userStore = useUserStore();
const readingProgress = ref(props.readingProgress);

const book = ref<IBook | undefined>(undefined)

onMounted(async () => {
  book.value = await bookStore.getBookById(props.readingProgress.bookId);
})
const emit = defineEmits<{
  (e: 'reviewRequested', clickedStar: number, progress: IReadingProgress): void;
}>();

const handleProgressUpdate = (updatedProgress: IReadingProgress) => {
  readingProgress.value = updatedProgress;
  if (updatedProgress.currentPage >= updatedProgress.totalPages) {
    emit('reviewRequested', 3, updatedProgress);
  }
};
</script>
<style scoped></style>
