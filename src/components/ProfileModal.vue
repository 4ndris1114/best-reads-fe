<template>
  <div v-on-click-outside="() => emits('close')" class="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
    <ul class="py-1 text-sm text-gray-700">
      <li>
        <a :href="'/profile/'+ userStore.loggedInUser!.id" class="block px-4 py-2 hover:bg-gray-100">
          <fa icon="user" class="mr-2" />
          My Profile
        </a>
      </li>
      <li>
        <a href="/preferences" class="block px-4 py-2 hover:bg-gray-100">
          <fa icon="pen-nib" class="mr-2" />
          Preferences
        </a>
      </li>
      <li>
        <a href="/settings" class="block px-4 py-2 hover:bg-gray-100">
          <fa icon="cog" class="mr-2" />
          Settings
        </a>
      </li>
      <li>
        <button
          @click="showLogoutModal = true; emits('close')"
          class="w-full text-red-600 text-left px-4 py-2 hover:bg-gray-100"
        >
          <fa icon="sign-out-alt" class="mr-2" />
          Logout
        </button>
      </li>
    </ul>

   <!-- Logout Confirmation Modal -->
<div
  v-if="showLogoutModal"
  class="fixed inset-0 bg-black/[var(--bg-opacity)] [--bg-opacity:50%] flex items-center justify-center bg-black bg-opacity-50 z-50"@click.self="showLogoutModal = false"

>
  <div class="relative bg-white rounded-lg shadow-lg p-6 pt-10 max-w-sm w-full border-t-4 border-red-600">
    <!-- Centered Logout Icon -->
    <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-md">
      <fa icon="sign-out-alt" class="text-red-600 text-2xl" />
    </div>

    <h2 class="text-lg text-black font-semibold mb-6 text-center">Are you sure you want to log out?</h2>

    <!-- Centered Buttons -->
    <div class="flex justify-center space-x-4">
      <button
        @click="showLogoutModal = false"
        class="px-4 py-2 text-gray-700 drop-shadow-xl border border-gray-400 rounded font-semibold hover:bg-gray-300 hover:text-black"
      >
        Cancel
      </button>
      <button
        @click="confirmLogout"
        class="px-4 py-2 bg-red-600 font-semibold drop-shadow-xl text-white border border-red-800 rounded hover:bg-red-700 flex items-center"
      >
        <fa icon="sign-out-alt" class="mr-2" />
        Log out
      </button>
    </div>
  </div>
</div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import { vOnClickOutside } from '@vueuse/components';

const userStore = useUserStore();
const showLogoutModal = ref(false);
const router = useRouter();
const emits = defineEmits(['close'])

const confirmLogout = () => {
  userStore.logout();
};
</script>
