<template>
  <navbar></navbar>

  <!-- Show error message if user not found -->
  <div v-if="user === null" class="mt-20 text-center text-gray-500">
    <p>User not found.</p>
  </div>

  <!-- Show user profile when data is available -->
  <div v-else class="mt-20 max-w-4xl mx-auto">
    <div class="flex items-center space-x-6">
      <img
        :src="user.profilePicture"
        alt="Profile Picture"
        class="w-50 h-50 rounded-full object-cover border"
      />
      <div>
        <h1 class="text-3xl font-bold">{{ user.username }}</h1>
        <p class="text-gray-600 mt-1 mb-6 text-m">{{ user.bio }}</p>
        <div class="text-sm text-gray-500">
          Joined on {{ new Date(user.createdAt).toLocaleDateString() }}
        </div>
      </div>

      <button
        v-if="profileUser && user.id !== profileUser.id"
        @click="followUser"
        class="mt-2 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
      >
        Follow
      </button>
      <button
        v-if="profileUser && user.id === profileUser.id"
        @click="editProfile"
        class="mt-2 sm:mt-0 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
      >
        Edit Profile
      </button>
    </div>

    <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold text-lg mb-2">Reading Stats</h2>
        <p><strong>Distinct Books Read:</strong>
          <!-- {{ Array.from(new Set(user.bookshelves.flatMap(shelf => shelf.books))).length }} -->
        </p>
        <p><strong>Currently reading:</strong> DUMMY TEXT </p>
      </div>

      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold text-lg mb-2">Social</h2>
        <p><strong>Followers:</strong> {{ user.followers.length }}</p>
        <p><strong>Following:</strong> {{ user.following.length }}</p>
      </div>
    </div>

    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Bookshelves</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div
          v-for="shelf in user.bookshelves"
          :key="shelf.id"
          class="bg-gray-100 p-4 rounded shadow text-center"
        >
          <h3 class="font-medium">{{ shelf.name }}</h3>
          <p class="text-xs text-gray-500">{{ shelf.books.length }} books</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { IUser } from "@/types/interfaces/IUser";
import Navbar from "@/components/Navbar.vue";
import { useUserStore } from '@/stores/userStore';
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const route = useRoute();

const user = ref<IUser | null>(null);
const profileUser: IUser = userStore.loggedInUser!;

onMounted(async () => {
  const userId = route.params.id as string;

  try {
    user.value = await userStore.getUserById(userId);
  } catch (err) {
    console.error("User not found:", err);
    user.value = null;
  }
});

const followUser = () => {
  console.log("Following user");
};

const editProfile = () => {
  console.log("Navigating to edit profile page");
};
</script>
<style scoped></style>
