<template>
  <div class="flex items-center space-x-2 ml-2">
    <div @click="toastStore.triggerToast('Not implemented yet!', 'error')" class="flex items-center bg-[#522623] px-2 py-1 rounded-full text-white text-sm cursor-pointer">
      <fa icon="book" class="mr-1" /> {{ readingStats.booksReadThisYear }} books
    </div>
    <div @click="toastStore.triggerToast('Not implemented yet!', 'error')" class="flex items-center border-2 border-[#522623] px-2 py-1 rounded-full text-[#522623] text-sm cursor-pointer">
      <fa icon="book-open" class="mr-1" /> {{ readingStats.pagesRead }} pages
    </div>
    <div @click="toastStore.triggerToast('Not implemented yet!', 'error')" class="flex items-center bg-[#522623] px-2 py-1 rounded-full text-white text-sm cursor-pointer">
      <fa icon="fire" class="mr-1" /> {{ readingStats.avgRatingGiven }} points
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IReadingStats } from '@/types/interfaces/IReadingstats';
import { useToastStore } from '@/stores/toastStore';

const toastStore = useToastStore();

defineProps<{
  readingStats: IReadingStats;
}>();
</script>
