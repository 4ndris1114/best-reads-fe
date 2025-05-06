<template>
<div>
  {{ readingProgress.currentPage }}
  <button @click="isEditProgressModalOpen = true">Update</button>
  <EditProgressModal v-if="isEditProgressModalOpen" :readingProgress="readingProgress" />
</div>
</template>

<script lang="ts" setup>
import type { IReadingProgress } from '@/types/interfaces/IReadingProgress';
import { ref } from 'vue';
import EditProgressModal from './EditProgressModal.vue';

const isEditProgressModalOpen = ref(false);
const props = defineProps<{
  readingProgress: IReadingProgress;
}>();

</script>
<style scoped></style>
