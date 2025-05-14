<template>
<div class="h-screen">
    <div v-for="progress in readingProgressList" :key="progress.id" class="mb-4">
      <ReadingProgressItem :readingProgress="progress" @reviewRequested="(clickedStar, progress) => $emit('reviewRequested', clickedStar, progress)"/>
  </div>
</div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore';
import { computed, onMounted } from 'vue';
import ReadingProgressItem from './ReadingProgressItem.vue';

const userStore = useUserStore();
const userId = computed(() => userStore.loggedInUser!.id);
const readingProgressList = computed(() => userStore.readingProgress);

const fetchAllProgress = async () => {
  if (!userId.value) return;
 try {
  await userStore.getAllReadingProgress(userId.value);
 } catch (error) {
  console.error('Failed to fetch reading progress:', error);
 }
}

defineEmits<{
  (e: 'reviewRequested', clickedStar: number, progress: IReadingProgress): void;
}>();

onMounted(async () => {
  if (userId.value) await userStore.getAllReadingProgress(userId.value);
});

onMounted(() => {
  fetchAllProgress();
})
</script>
<style scoped></style>
