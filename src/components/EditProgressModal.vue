<template>
  <div class="fixed drop-shadow-lg inset-0 bg-black/[var(--bg-opacity)] [--bg-opacity:50%] flex justify-center items-center z-50" @click.self="emits('closeModal')">
{{readingProgress.currentPage }}
  </div>
</template>


<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import type { IReadingProgress } from '@/types/interfaces/IReadingProgress';

const userStore = useUserStore();
const props = defineProps<{
readingProgress: IReadingProgress;
}>();

const emits = defineEmits(['closeModal']);

</script>
