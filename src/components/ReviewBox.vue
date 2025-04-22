<template>
  <div class="p-4 bg-gray-50 rounded-xl shadow-md relative">
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
            <span class="text-sm text-gray-600 mr-4">({{ review.ratingValue }})</span>
            <div v-if="userStore.loggedInUser?.id === review.userId">
              <fa icon="ellipsis-vertical" class="cursor-pointer" @click="dropdownOpen = !dropdownOpen"></fa>
            </div>
            <div v-on-click-outside="closeDropdown" v-if="dropdownOpen" class="absolute right-2 top-12 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <ul class="text-black text-sm">
                <li @click="emits('edit')" class="px-4 py-2 hover:bg-gray-200 cursor-pointer">Edit</li>
                <li @click="emits('delete', review.id)" class="px-4 py-2 text-red-600 font-semibold hover:bg-gray-200 cursor-pointer">Delete</li>
              </ul>
            </div>
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
        <!-- Private Badge -->
    <div 
      v-if="!review.isPublic" 
      class="absolute bottom-2 right-2 bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full shadow-sm"
    >
      Private
    </div>
  </div>
</template>

  
  <script setup lang="ts">
  import type { IReview } from '@/types/interfaces/IReview';
  import { onMounted, ref } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  import type { IUser } from '@/types/interfaces/IUser';
  import { vOnClickOutside } from '@vueuse/components'
  
  const props = defineProps({
    review: {
      type: Object as () => IReview,
      required: true
    }
  });

  const emits = defineEmits<{
    (e: 'edit'): void,
    (e: 'delete', reviewId: string): void
  }>();
  
  const userStore = useUserStore();
  const user = ref<IUser>();

  const dropdownOpen = ref(false);

  const closeDropdown = () => {
    dropdownOpen.value = false;
  };
  
  onMounted(async () => {
    user.value = await userStore.getUserById(props.review.userId);
  });
  </script>
  
  <style scoped>
  /* Add hover effect or transitions here if needed */
  </style>
  