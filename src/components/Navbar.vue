<template>
    <!-- Header -->
    <header class="fixed top-0 w-full bg-accent text-white shadow-sm z-50">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <router-link to="/" class="flex items-center">
          <img src="@/assets/logo.png" alt="BestReads Logo" class="h-13 w-auto mr-2">
          <div class="flex flex-col hover:text-black leading-tight">
          <span class="text-3xl font-bold text-white-600">BestReads</span>
          <span class="text-[9.5px] text-white-600 ">STORIES THAT TAKE YOU BEYOND</span>
          </div>
        </router-link>

          <!-- Navigation -->
      <nav class="flex items-center gap-6 mt-2 ml-8">
        <router-link
          to="/"
          :class="[
            'font-bold text-xl px-2 py-1 rounded transition duration-200',
            route.path === '/' ? ' bg-[#C67B2F] bg-opacity-10 text-black' : 'text-white-700 hover:text-black hover:bg-[#C67B2F]/50'
          ]"
        >
          Home
        </router-link>

        <router-link
          to="/bookshelves"
          :class="[
            'font-bold text-xl px-2 py-1 rounded transition duration-200',
            route.path.startsWith('/bookshelves') ? 'bg-[#C67B2F] bg-opacity-10 text-black' : 'text-white-700 hover:text-black hover:bg-[#C67B2F]/50'
          ]"
        >
          My Bookshelves
        </router-link>
      </nav>


            <Searchbar />
<!-- User actions -->
<div class="flex items-center gap-6 relative">
        <button class="relative !rounded-button cursor-pointer">
          <fa icon="message" class="scale-140" />
          <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button class="relative !rounded-button cursor-pointer">
          <fa icon="bell" class="scale-140" />
          <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <!-- Profile Dropdown Trigger -->
        <div @click="toggleDropdown" class="cursor-pointer flex items-center justify-center w-8 h-8 bg-slate-800 text-white rounded-full">
          <fa icon="user" />
        </div>

        <!-- Dropdown -->
        <div v-if="showDropdown" class="absolute right-0 top-12 z-50">
          <ProfileDropdown />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import Searchbar from './Searchbar.vue';
import ProfileDropdown from '@/components/ProfileModal.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

const showDropdown = ref(false);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function handleClickOutside(event: MouseEvent) {
  const dropdown = document.getElementById('profile-dropdown');
  if (dropdown && !dropdown.contains(event.target as Node)) {
    showDropdown.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

</script>

<style scoped></style>
