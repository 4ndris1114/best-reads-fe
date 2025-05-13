<template>
  <div class="p-4 bg-gray-50 rounded-xl shadow-md relative">
    <div v-if="user" class="flex flex-wrap items-center gap-4">
      <CloudinaryImage @click="$router.push({ name: 'profilepage', params: { id: user.id } })"
        class="w-16 h-16 rounded-full object-cover cursor-pointer"
        :publicId="user.profilePicture"
        :width="50"
        :height="50"
        :isUserImage="true"
        alt="User Avatar"
      />
      <div class="flex-1 min-w-[200px]">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-1">
          <h3 @click="$router.push({ name: 'profilepage', params: { id: user.id } })" class="text-lg font-semibold text-gray-900 cursor-pointer">{{ user.username }}</h3>
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
                <li @click="isConfirmationModalOpen = true" class="px-4 py-2 text-red-600 font-semibold hover:bg-gray-200 cursor-pointer">Delete</li>
              </ul>
            </div>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          {{ new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
     .format(new Date(review.createdAt))
     .replace(/\//g, '-') }}
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

    <transition name="fade">
        <div v-if="isConfirmationModalOpen" @click.self="emits('delete', review.id)"
            class="fixed inset-0 bg-black/[var(--bg-opacity)] [--bg-opacity:50%] flex items-center justify-center z-50">
            <div class="bg-white rounded-2xl p-6 w-[90vw] max-w-md shadow-xl">
                <h2 class="text-xl font-semibold mb-4">Delete Review</h2>
                <p class="text-gray-600">Are you sure you want to delete this review?</p>
                <div class="flex justify-end mt-4">
                    <button @click="isConfirmationModalOpen = false" class="bg-gray-400 px-3 py-1 rounded cursor-pointer mr-2">Cancel</button>
                    <button @click="emits('delete', review.id)" class="bg-red-600 text-white px-3 py-1 rounded cursor-pointer">Delete</button>
                </div>
            </div>
        </div>
    </transition>
  </div>
</template>


  <script setup lang="ts">
  import type { IReview } from '@/types/interfaces/IReview';
  import { onMounted, ref } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  import type { IUser } from '@/types/interfaces/IUser';
  import { vOnClickOutside } from '@vueuse/components'
  import CloudinaryImage from './CloudinaryImage.vue';

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
  const isConfirmationModalOpen = ref(false);

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
