<template>
    <div class="p-4 bg-gray-50 rounded-xl shadow-md">
      <div v-if="user" class="flex flex-wrap items-center gap-4">
        <img 
          class="w-16 h-16 rounded-full object-cover" 
          :src="'../src/assets/' + user.profilePicture" 
          alt="User Avatar"
        />
        <div class="flex-1 min-w-[200px]">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-1">
            <h3 class="text-lg font-semibold text-gray-900">{{ user.username }}</h3>
            <div 
              v-if="review.ratingValue" 
              class="flex items-center space-x-0.5"
            >
              <fa 
                v-for="n in 5"
                :key="n"
                :icon="['fas', 'star']" 
                class="transition-colors duration-200"
                :class="[
                  'cursor-pointer',
                  'text-base sm:text-xl lg:text-2xl',
                  n <= Math.floor(review.ratingValue) ? 'text-yellow-500' : 'text-slate-300'
                ]"
              />
              <span class="text-sm text-gray-600">({{ review.ratingValue }})</span>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            {{ review.createdAt.toLocaleString().split('T')[0] }}
          </p>
        </div>
      </div>
  
      <p class="mt-4 text-gray-700 text-sm sm:text-base leading-relaxed">
        {{ review.reviewText }}
      </p>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { IReview } from '@/types/interfaces/IReview';
  import { onMounted, ref } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  import type { IUser } from '@/types/interfaces/IUser';
  
  const props = defineProps({
    review: {
      type: Object as () => IReview,
      required: true
    }
  });
  
  const userStore = useUserStore();
  const user = ref<IUser>();
  
  onMounted(async () => {
    user.value = await userStore.getUserById(props.review.userId);
  });
  </script>
  
  <style scoped>
  /* Add hover effect or transitions here if needed */
  </style>
  