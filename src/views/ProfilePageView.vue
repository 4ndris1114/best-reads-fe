<template>
  <navbar></navbar>
<div class="container mx-auto bg-[#D9D9D9] p-4">
  <!-- Show error message if user not found -->
  <div v-if="user === null" class="mt-20 text-center text-gray-500">
    <p>User not found.</p>
  </div>

  <!-- Show user profile when data is available -->
  <div v-else class="mt-20 max-w-4xl mx-auto overflow-y-auto max-h-screen ">
    <div class="flex items-center space-x-6">
      <img

        :src="'../src/assets/' + user.profilePicture"
        alt="Profile Picture"
        class="w-50 h-50 mr-10 rounded-full object-cover border"
      />
      <div>
        <!-- Username -->
        <h1 class="text-3xl rounded-lg border bg-white border-gray-200 p-2 font-bold" @dblclick="isEditingUsername = true">

          <template v-if="isEditingUsername">
            <input
              v-model="usernameInput"
              type="text"
              class="text-3xl font-bold text-gray-900 "
              @blur="saveUsername"
            />
          </template>
          <template v-else>
            {{ user.username }}
            <fa icon="pen" class="ml-2 font-bold" />

          </template>
        </h1>
        <div class="mb-6 mt-2 grid grid-cols-2 gap-px text-gray-700 text-left">
          <div class="flex space-x-5">
          <p><strong> {{ user.followers.length }}</strong> Followers</p>
        <p><strong> {{ user.following.length }}</strong> Following</p>
        </div>
        </div>
        <!-- Bio -->
        <p class="text-black mt-1 rounded-lg  bg-white border border-gray-200 p-2 mb-6 text-m" @dblclick="isEditingBio = true">
          <template v-if="isEditingBio">
            <textarea
              v-model="bioInput"
              class="text-black mt-1 mb-2 text-m "
              @blur="saveBio"
            ></textarea>
          </template>
          <template v-else>
            {{ user.bio }}
          </template>
        </p>

        <div class="text-sm text-gray-500">
          Joined on {{ new Date(user.createdAt).toLocaleDateString() }}
        </div>
      </div>

      <!-- Edit button (visible only if logged-in user is viewing their profile) -->
      <button
        v-if="profileUser && user.id === profileUser.id"
        @click="editProfile"
        class="drop-shadow-xl w-full font-bold p-2 bg-white text-gray-800 rounded hover:bg-gray-400 transition duration-200"
      >
        <fa icon="pen" class="mr-2 font-bold" />
        Save changes
      </button>
    </div>

    <div class="mt-4 ml-60">
      <h2 class="text-2xl font-bold mb-4">Bookshelves</h2>
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
      <div>
        <h2 class="text-2xl font-bold mt-10 mb-4">Preferences</h2>
        <h3 class="text-2xl font-bold mt-10 mb-4">Privacy and security</h3>
        <button class="bg-gray-400 px-4 py-2 rounded hover:bg-gray-600 transition duration-300 text-black">Change password</button>
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

const usernameInput = ref("");
const bioInput = ref("");

onMounted(async () => {
  const userId = route.params.id as string;
  try {
    user.value = await userStore.getUserById(userId);
    usernameInput.value = user.value.username;
    bioInput.value = user.value.bio;
  } catch (err) {
    console.error("User not found:", err);
    user.value = null;
  }
});

const user = ref<IUser | null>(null);
const profileUser: IUser = userStore.loggedInUser!;
const isEditingUsername = ref(false);
const isEditingBio = ref(false);

// Methods for saving the edited data
const saveUsername = async () => {
  if (usernameInput.value !== user.value?.username) {
    // Call API to save the updated username
    console.log("Saving updated username:", usernameInput.value);
    user.value!.username = usernameInput.value;
    isEditingUsername.value = false;
  }
};

const saveBio = async () => {
  if (bioInput.value !== user.value?.bio) {
    // Call API to save the updated bio
    console.log("Saving updated bio:", bioInput.value);
    user.value!.bio = bioInput.value;
    isEditingBio.value = false;
  }
};

// Follow user function (for now just logs)
const followUser = () => {
  console.log("Following user");
};

// Edit profile function (just a placeholder for now)
const editProfile = () => {
  try {
    if (!user.value) return;
    userStore.editUserById(user.value!.id, user.value!);
    console.log("Editing profile", user.value);
    }catch (error) {
      console.error('Error renaming bookshelf:', error);
    }
};

</script>

<style scoped>
</style>
