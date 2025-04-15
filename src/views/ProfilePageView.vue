<template>
  <navbar></navbar>
  <div class="mt-20 max-w-4xl mx-auto">
    <div class="flex items-center space-x-6">
      <img
        :src="user.profilePicture"
        alt="Profile Picture"
        class="w-50 h-50 rounded-full object-cover border"
      />
      <div>
        <h1 class="text-3xl font-bold">{{ user.username }}</h1>
        <p class="text-gray-600 mt-1 mb-6 text-m">{{ user.bio }}</p>
        <div class=" text-sm text-gray-500">
          Joined on {{ new Date(user.createdAt).toLocaleDateString() }}
        </div>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold text-lg mb-2">Reading Stats</h2>
        <p><strong>Books Read:</strong> {{ user.readingStats.booksRead }}</p>
        <p><strong>Pages Read:</strong> {{ user.readingStats.pagesRead }}</p>
        <p><strong>Avg. Rating:</strong> {{ user.readingStats.averageRating }}</p>
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
import { ref } from "vue";

const user: IUser = useUserStore().loggedInUser!;
</script>

<style scoped>
</style>
