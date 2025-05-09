<template>
  <div class="flex flex-col gap-6 w-[300px] text-white">
    <!-- Main Challenge -->
    <div class="bg-darkBlueBackground rounded-2xl px-6 py-5">
      <div v-if="readingChallenge">
        <p class="text-3xl font-semibold">Reading challenge</p>
        <div class="mt-3 flex flex-row space-x-4 items-center">
          <p class="text-4xl font-bold leading-none">{{ readingChallenge.progress }}</p>
          <p class="text-lg text-[#A3A3A3]">books read in {{ readingChallenge.year }}</p>
        </div>
        <div class="mt-4 w-full bg-[#2F2F39] h-3 rounded-full">
          <div
            class="bg-white h-3 rounded-full"
            :style="{ width: readingChallenge.progress / readingChallenge.goal * 100 + '%' }"
          ></div>
        </div>
        <p class="mt-2 text-sm text-gray-400">{{ readingChallenge.progress }}/{{ readingChallenge.goal }} 
          ({{ Math.floor(readingChallenge.progress / readingChallenge.goal * 100) }}%)
        </p>
        <div class="flex flex-row justify-end mt-3 space-x-5">
          <span @click="isEditChallengeModalVisible = true" class="flex flex-row cursor-pointer space-x-1.5">
            <fa icon="pencil" class="mt-2 text-blue-400"></fa><span class="mt-1 text-blue-400">Edit</span>
          </span>
          <span @click="isDeleteChallengeModalVisible = true" class="flex flex-row curcor pointer space-x-1.5">
            <fa icon="trash" class="mt-2 text-red-400"></fa><span class="mt-1 text-red-400">Delete</span>
          </span>
        </div>
      </div>
      <div v-else>
        <p class="text-xl font-semibold">You don't have an active reading challenge</p>
      
      </div>
    </div>
  </div>
  <EditReadingChallengeModal
    v-if="isEditChallengeModalVisible"
    :readingChallenge="readingChallenge"
    @closeModal="isEditChallengeModalVisible = false"
    @update="handleChallengeUpdate"
  />
  <DeleteChallengeModal
    v-if="isDeleteChallengeModalVisible"
    :readingChallenge="readingChallenge"
    @closeModal="isDeleteChallengeModalVisible = false"
    @deleteChallenge="handleChallengeDelete"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useToastStore } from '@/stores/toastStore';

import type { IReadingChallenge } from '@/types/interfaces/IReadingChallenge';
import EditReadingChallengeModal from './EditReadingChallengeModal.vue';
import DeleteChallengeModal from './DeleteChallengeModal.vue';

const userStore = useUserStore();
const toastStore = useToastStore();

const isEditChallengeModalVisible = ref(false);
const isDeleteChallengeModalVisible = ref(false);

const readingChallenge = ref<IReadingChallenge | null>(userStore.loggedInUser!.readingChallenges.filter((challenge: IReadingChallenge) => challenge.year === new Date().getFullYear())[0] || null);

const handleChallengeUpdate = async (updatedChallenge: IReadingChallenge) => {
  try {
    const result = await userStore.updateReadingChallenge(updatedChallenge);
    if (result) {
      toastStore.triggerToast('Challenge updated successfully', 'success');
    } else {
      toastStore.triggerToast('Failed to update challenge', 'error');
    }
    readingChallenge.value = updatedChallenge;
    isEditChallengeModalVisible.value = false;
  } catch (error) {
    console.error('Failed to update challenge:', error);
  }
};

const handleChallengeDelete = async () => {
  try {
    const wasDeleted = await userStore.deleteReadingChallenge(readingChallenge.value!.id);
    if (wasDeleted) {
      toastStore.triggerToast('Challenge deleted successfully', 'success');
    } else {
      toastStore.triggerToast('Failed to delete challenge', 'error');
    }
    readingChallenge.value = null;
    isDeleteChallengeModalVisible.value = false;
  } catch (error) {
    console.error('Failed to delete challenge:', error);
  }
};
</script>
