<template>
    <!-- Header -->
    <header class="fixed top-0 w-full bg-darkBlueBackground text-white shadow-sm z-50">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <router-link to="/" class="flex items-center">
          <img src="@/assets/logo.png" alt="BestReads Logo" class="h-13 w-auto mr-2">
          <div class="flex flex-col text-[#e2d7bc] leading-tight">
          <span class="text-3xl font-bold ">BestReads</span>
          <span class="text-[9.5px] ">STORIES THAT TAKE YOU BEYOND</span>
          </div>
        </router-link>

          <!-- Navigation -->
      <nav class="flex items-center gap-6 mt-2 ml-8">
        <router-link
          to="/"
          :class="[
            'font-bold text-xl px-2 py-1 rounded transition duration-200',
            route.path === '/' ? 'text-[#3a281d] bg-[#C67B2F] bg-opacity-10' : 'text-white hover:bg-[#e2d7bc]/30'
          ]"
        >
          Home
        </router-link>

        <router-link
          to="/bookshelves"
          :class="[
            'font-bold text-xl px-2 py-1 rounded transition duration-200',
            route.path.startsWith('/bookshelves') ? 'text-[#3a281d] bg-[#C67B2F] bg-opacity-10' : 'text-white hover:bg-[#e2d7bc]/30'
          ]"
        >
          My Bookshelves
        </router-link>
      </nav>


            <Searchbar />
<!-- User actions -->
<div class="flex items-center gap-6 relative">
  <!-- Message Button -->
  <button @click="showMessagesDropdown = true" class="relative !rounded-button cursor-pointer">
    <fa icon="message" class="scale-140" />
    <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
  </button>

  <!-- Notification Button -->
  <button @click="toggleNotificationDropdown" class="relative !rounded-button cursor-pointer">
    <fa icon="bell" class="scale-140" />
    <span v-if="unreadNotifications > 0"
          class="absolute -top-1 -right-3 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white"
          :class="{ 'w-5.5': unreadNotifications > 9, 'w-6.5': unreadNotifications > 99 }">
      {{ unreadNotifications }}
    </span>
  </button>

  <!-- Profile image and username as clickable block -->
  <div
    @click="toggleProfileDropdown"
    class="flex items-center cursor-pointer"
  >
    <!-- Profile Image -->
    <div class="w-8 h-8 rounded-full overflow-hidden">
      <CloudinaryImage
        v-if="loggedInUser?.profilePicture"
        :publicId="loggedInUser.profilePicture"
        :isUserImage="true"
        :width="40"
        :height="40"
        alt="Profile image"
        class="w-full h-full object-cover rounded-full"
      />
    </div>

    <!-- Username -->
    <div class="text-[#e2d7bc] font-semibold ml-[4px]">{{ loggedInUser?.username }}</div>
  </div>

  <!-- Profile Dropdown -->
  <div v-if="showProfileDropdown" class="absolute right-0 top-7 z-50">
    <ProfileDropdown
      @close="showProfileDropdown = false"
      v-on-click-outside="() => showProfileDropdown = false"
    />
  </div>

  <!-- Messages dropdown -->
  <div v-if="showMessagesDropdown" class="absolute right-22 top-7 z-50">
    <MessagesDropdown
      @close="showMessagesDropdown = false"
      v-on-click-outside="() => showMessagesDropdown = false"
    />
  </div>

  <!-- Notification Dropdown -->
  <div v-if="showNotificationDropdown" class="absolute right-12 top-7 z-50">
    <NotificationDropdown @close="showNotificationDropdown = false" />
  </div>
</div>
    </div>
  </header>
</template>

<script setup lang="ts">
import Searchbar from './Searchbar.vue';
import ProfileDropdown from '@/components/ProfileModal.vue';
import { useRoute } from 'vue-router';
const route = useRoute();
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import NotificationDropdown from './NotificationDropdown.vue';
import { vOnClickOutside } from '@vueuse/components';
import { unreadCount } from '@/utils/notifications';
import CloudinaryImage from './CloudinaryImage.vue';
import type { IUser } from '@/types/interfaces/IUser';
import { useUserStore } from '@/stores/userStore';
import MessagesDropdown from '@/components/MessagesDropdown.vue';

const userStore = useUserStore();
const loggedInUser: IUser = userStore.loggedInUser!; //logged in user


const showProfileDropdown = ref(false);
const showNotificationDropdown = ref(false);
const showMessagesDropdown = ref(false);
const unreadNotifications = unreadCount;

const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value;
}

const toggleNotificationDropdown = () => {
  console.log("Notifications");
  
  showNotificationDropdown.value = !showNotificationDropdown.value;
}

const handleClickOutside = (event: MouseEvent) => {
  const dropdown = document.getElementById('profile-dropdown');
  if (dropdown && !dropdown.contains(event.target as Node)) {
    showProfileDropdown.value = false;
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
