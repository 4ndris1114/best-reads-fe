<template>
  <MainLayout>
    <div class="h-screen overflow-y-auto">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col lg:flex-row gap-8">
          <div class="w-full lg:w-1/5">
            <BooksOnShelf shelfName="Currently Reading" />
          </div>

          <div class="w-full lg:w-2/5">
            <div class="mb-8">
          <h1 class="text-4xl font-bold text-[#1D1D23]">{{ timeGreeting }}, {{ loggedInUser }}!</h1>
        </div>

            <h2 class="text-xl font-semibold text-[#1D1D23] dark:text-gray-800 mb-4">
              What's new
            </h2>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import BooksOnShelf from '@/components/BooksOnShelf.vue';
import { useUserStore } from '@/stores/userStore';

const user = useUserStore();
const loggedInUser = computed(() => user.loggedInUser?.username);

const timeGreeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
});
</script>
