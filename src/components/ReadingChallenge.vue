<template>
  <div class="flex flex-col gap-6 w-[300px] text-white">
    <!-- Main Challenge -->
    <div class="bg-darkBlueBackground rounded-2xl px-6 py-5">
      <div v-if="currentReadingChallenge">
        <p class="text-3xl font-semibold">Reading challenge</p>
        <div class="mt-3 flex flex-row space-x-4 items-center">
          <p class="text-4xl font-bold leading-none">{{ currentReadingChallenge.progress }}</p>
          <p class="text-lg text-[#A3A3A3]">books read in {{ currentReadingChallenge.year }}</p>
        </div>
        <div class="mt-4 w-full bg-[#2F2F39] h-3 rounded-full">
          <div
            class="bg-white h-3 rounded-full"
            :style="{ width: currentReadingChallenge.progress / currentReadingChallenge.goal * 100 + '%' }"
          ></div>
        </div>
        <p class="mt-2 text-sm text-gray-400">{{ currentReadingChallenge.progress }}/{{ currentReadingChallenge.goal }} 
          ({{ Math.floor(currentReadingChallenge.progress / currentReadingChallenge.goal * 100) }}%)
        </p>
        <div class="flex flex-row justify-end mt-3 space-x-5">
          <span @click="emits('openEditModal', currentReadingChallenge)" class="flex flex-row cursor-pointer space-x-1.5">
            <fa icon="pencil" class="mt-2 text-blue-400"></fa><span class="mt-1 text-blue-400">Edit</span>
          </span>
          <span @click="emits('openDeleteModal', currentReadingChallenge)" class="flex flex-row curcor pointer space-x-1.5">
            <fa icon="trash" class="mt-2 text-red-400"></fa><span class="mt-1 text-red-400">Delete</span>
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
    (e: 'openDeleteModal', readingChallenge: IReadingChallenge ): void;
}>();


const props = defineProps<{
  currentReadingChallenge: IReadingChallenge | null;
}>();
</script>
