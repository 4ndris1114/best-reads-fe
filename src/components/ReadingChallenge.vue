<template>
  <div class="flex flex-col gap-6 w-[300px] text-white ">
    <!-- Main Challenge -->

    <div class="bg-primary border-t-7 border-darkBlueBackground rounded-2xl px-6 pb-5">
      <div v-if="readingChallenge">
        <p class="text-3xl mt-2 font-semibold">Reading challenge</p>
        <div class="mt-3 flex flex-row space-x-4 items-center">
          <p class="text-4xl font-bold leading-none">{{ readingChallenge.progress }}</p>
          <p class="text-lg text-[#8192B0] ">books read in {{ readingChallenge.year }}</p>
        </div>
        <div class="mt-4 w-full bg-darkBlueBackground h-3 rounded-full">
          <div
            class="bg-white h-3 rounded-full"
            :style="{ width: readingChallenge.progress / readingChallenge.goal * 100 + '%' }"
          ></div>
        </div>
        <p class="mt-2 text-sm text-[#8192B0] ">{{ readingChallenge.progress }}/{{ readingChallenge.goal }}
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
      <div v-else class="flex flex-col items-center justify-center text-center py-8 space-y-4">
  <div class="text-6xl">📚</div>
  <p class="text-xl font-semibold">No active reading challenge</p>
  <p class="text-sm text-gray-400 max-w-[220px]">
    Set a goal and track your reading progress through the year!
  </p>
  <button
    @click="isEditChallengeModalVisible = true"
    class="mt-2 px-4 py-2 bg-accent hover:opacity-90 text-white text-sm font-medium rounded-xl transition cursor-pointer"
  >
    Create Challenge
  </button>
</div>

    </div>
  </div>
  <EditReadingChallengeModal
    v-if="isEditChallengeModalVisible"
    :readingChallenge="readingChallenge"
    @closeModal="isEditChallengeModalVisible = false"
    @update="handleChallengeUpdate"
    @create="handleChallengeCreate"
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
import { useShelfStore } from '@/stores/shelfStore';
import type { IBookshelf } from '@/types/interfaces/IBookshelf';
import type { IBookshelfBook } from '@/types/interfaces/IBookshelfBook';

const userStore = useUserStore();
const toastStore = useToastStore();
const shelfStore = useShelfStore();

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

const handleChallengeCreate = async (newChallenge: IReadingChallenge) => {
  try {
    const booksReadThisYear = shelfStore.bookshelves
    .find((shelf: IBookshelf) => shelf.name === 'Read')
    ?.books.filter((book: IBookshelfBook) => new Date(book.updatedAt).getFullYear() === new Date().getFullYear()).length || 0;

    const challengeToCreate = {
      ...newChallenge,
      year: new Date().getFullYear(),
      progress: booksReadThisYear
    } as IReadingChallenge;

    const result = await userStore.createReadingChallenge(challengeToCreate);
    if (result) {
      toastStore.triggerToast('Challenge created successfully', 'success');
    } else {
      toastStore.triggerToast('Failed to create challenge', 'error');
    }
    readingChallenge.value = result;
    isEditChallengeModalVisible.value = false;
  } catch (error) {
    console.error('Failed to create challenge:', error);
  }
};
</script>
