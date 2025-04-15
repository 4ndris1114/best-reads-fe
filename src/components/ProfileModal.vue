<template>
  <div class="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
      <ul class="py-1 text-sm text-gray-700">
          <li>
              <a :href="'/profile/'+ userStore.loggedInUser!.id" class="block px-4 py-2 hover:bg-gray-100">
                  <fa icon="user" class="mr-2" />
                  My Profile
              </a>
          </li>
          <li>
              <a href="/preferences" class="block px-4 py-2 hover:bg-gray-100">
                  <fa icon="sliders-h" class="mr-2" />
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
                  @click="logout"
                  class="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                  <fa icon="sign-out-alt" class="mr-2" />
                  Logout
              </button>
          </li>
      </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const open = ref(false);

function toggleDropdown() {
  open.value = !open.value;
}

function logout() {
  console.log("Logging out...");
  // Add actual logout logic here
}
</script>
