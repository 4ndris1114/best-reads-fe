<template>
  <div v-if="isEditProgressModalVisible"
    class="fixed drop-shadow-lg inset-0 bg-black/[var(--bg-opacity)] [--bg-opacity:50%] flex justify-center items-center z-50"
    @click.self="emits('closeModal')"
  >
    <div class="relative bg-white p-6 pt-10 rounded-lg w-[300px] border-t-4 border-blue-700 shadow-lg">
      <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-md">
        <fa icon="pencil" class="text-blue-700 text-2xl" />
      </div>

      <h2 class="text-xl font-semibold text-center mb-2">Update Your Progress</h2>

      <div class="text-center mb-6">
        <label for="currentPage" class="block mb-2 font-semibold">Current Page</label>
        <input
          id="currentPage"
          type="number"
          v-model.number="localProgress.currentPage"
          class="w-full px-3 py-2 border border-gray-300 rounded"
          :max="localProgress.totalPages"
          min="0"
        />
        <p class="mt-2 text-sm text-gray-600">out of {{ localProgress.totalPages }}</p>
      </div>

      <div class="flex justify-center gap-6">
        <button
          @click="emits('closeModal')"
          class="w-24 px-3 py-2 bg-gray-400 text-white font-semibold rounded hover:bg-gray-500 transition"
        >
          Cancel
        </button>
        <button
          @click="updateProgress"
          class="w-24 px-3 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition"
        >
          Update
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/userStore';
import type { IReadingProgress } from '@/types/interfaces/IReadingProgress';

const userStore = useUserStore();

const props = defineProps<{
  isEditProgressModalVisible: boolean;
  readingProgress: IReadingProgress;
}>();

const emits = defineEmits(['closeModal', 'progressUpdated']);

const localProgress = ref({ ...props.readingProgress });

watch(
  () => props.readingProgress,
  (newVal) => {
    localProgress.value = { ...newVal };
  },
  { immediate: true }
);

const updateProgress = async () => {
  try {
    const updatedProgress = await userStore.editReadingProgressById(userStore.loggedInUser!.id, props.readingProgress.id,  localProgress.value);
    emits('progressUpdated', updatedProgress);
    emits('closeModal');
  } catch (error) {
    console.error('Error updating reading progress:', error);
  }
};
</script>
