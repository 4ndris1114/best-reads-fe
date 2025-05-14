<template>
  <div class="flex items-center gap-6 bg-[#181c20] p-4 rounded shadow">
    <router-link :to="'/bookdetails/' + readingProgress.bookId">
      <CloudinaryImage
        :publicId="book?.coverImage || ''"
        alt="Book cover"
        class="w-20 h-auto rounded border-2 border-[#3D4D69]"
      />
    </router-link>

      <div class=" items-center justify-between">
      <h2 :class="`font-semibold text-white ${book!.title?.length > 20 ? 'text-sm' : 'text-md'}`">
        {{ book?.title || 'Untitled' }}
      </h2>
      <div class="flex justify-end scale-50">
        <RatingStars @reviewRequested="(clickedStar) => emit('reviewRequested', clickedStar, readingProgress)"></RatingStars>
      </div>
      <p class="text-sm text-white">
        <div class="w-full h-3 bg-[#3D4D69] rounded mt-2 overflow-hidden">
        <div
          class="h-full bg-lime-500 transition-all rounded duration-300"
          :style="{ width: readingProgress.currentPage / readingProgress.totalPages * 100 + '%' }"
        ></div>
      </div>
        {{ readingProgress.currentPage }} / {{ readingProgress.totalPages }} pages <b class="ml-1 text-[#547786] ">({{ Math.floor(readingProgress.currentPage / readingProgress.totalPages * 100) }}%)</b>
      </p>
      <button
        @click="isEditProgressModalOpen = true"
        class="mt-5 text-gray-300 font-semibold cursor-pointer text-sm mt-1 bg-[#3D4D69] px-2 py-1 rounded hover:bg-[#3D4D69]/50 transition"
      >
        Update progress
      </button>
    </div>

    <EditProgressModal
      v-if="isEditProgressModalOpen"
      :isEditProgressModalVisible="isEditProgressModalOpen"
      :readingProgress="readingProgress"
      @closeModal="isEditProgressModalOpen = false"
      @progressUpdated="handleProgressUpdate"
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
import type { IBook } from '@/types/interfaces/IBook';

const props = defineProps<{
  readingProgress: IReadingProgress;
}>();

const isEditProgressModalOpen = ref(false);
const bookStore = useBookStore();
const userStore = useUserStore();
const readingProgress = ref(props.readingProgress);

const book = computed(() => bookStore.books.find(b => b.id === props.readingProgress.bookId));

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
