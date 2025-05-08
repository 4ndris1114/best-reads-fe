<template>
  <div class="flex flex-col gap-6 w-[300px] text-white">
    <!-- Main Challenge -->
    <div class="bg-darkBlueBackground rounded-2xl px-6 py-5">
      <div v-if="currentReadingChallenge">
        <p class="text-3xl font-semibold">Reading challenge</p>
        <div class="mt-3 flex flex-row space-x-4 items-center">
          <p class="text-4xl font-bold leading-none">{{ currentReadingChallenge.progress }}</p>
          <p class="text-lg text-[#A3A3A3]">books read</p>
        </div>
        <div class="mt-4 w-full bg-[#2F2F39] h-3 rounded-full">
          <div
            class="bg-white h-3 rounded-full"
            :style="{ width: currentReadingChallenge.progress / currentReadingChallenge.goal * 100 + '%' }"
          ></div>
        </div>
        <div class="flex flex-row justify-between">
          <p class="mt-2 text-sm text-gray-400">{{ currentReadingChallenge.progress }}/{{ currentReadingChallenge.goal }} 
            ({{ currentReadingChallenge.progress / currentReadingChallenge.goal * 100 }}%)
          </p>
          <span @click="emits('openEditModal', currentReadingChallenge)" class="flex flex-row cursor-pointer space-x-2 mt-3">
            <fa icon="pencil" class="mt-2 text-blue-400"></fa><span class="mt-1 text-blue-400">Edit challenge</span>
          </span>
        </div>
      </div>
      <div v-else>
        <p class="text-xl font-semibold">You don't have an active reading challenge</p>
      
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import type { IReadingChallenge } from '@/types/interfaces/IReadingChallenge';

const emits = defineEmits<{
    (e: 'openEditModal', readingChallenge: IReadingChallenge ): void;
}>();
const userStore = useUserStore();
const readingChallenges = computed<IReadingChallenge[]>(() => userStore.loggedInUser?.readingChallenges || []);
const currentReadingChallenge = computed<IReadingChallenge | null>(() => readingChallenges.value.filter(challenge => challenge.year === new Date().getFullYear())[0]);
</script>
