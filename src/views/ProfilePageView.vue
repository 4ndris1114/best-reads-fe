<template>
  <MainLayout>
    <div class="h-screen overflow-y-auto bg-white p-4">
      <div v-if="user === null" class="mt-20 text-center text-gray-500">
        <p>User not found.</p>
      </div>

      <div v-else class="mt-10 max-w-4xl mx-auto">
        <div class="flex items-start space-x-6">
          <!-- Profile picture -->
          <img :src="'../src/assets/' + user.profilePicture" alt="Profile Picture"
            class="w-30 h-30 rounded-full object-cover border" />

          <div class="flex-1">
            <!-- Username and edit button -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex flex-col space-y-2">
                <div class="flex items-center space-x-4">
                  <template v-if="isEditingUsername">
                    <input v-model="usernameInput" type="text"
                      class="text-3xl font-bold text-gray-900 border border-gray-300 rounded px-2" />
                  </template>
                  <template v-else>
                    <h1 class="text-3xl font-bold text-gray-900">{{ user.username }}</h1>
                  </template>
                </div>
              </div>

              <!-- Buttons -->
              <div class="flex space-x-2">
                <button v-if="profileUser && user.id === profileUser.id" @click="toggleEdit"
                  class="drop-shadow-xl px-4 py-2 bg-blue-700 text-white font-semibold rounded hover:bg-blue-800 transition duration-100">
                  <fa icon="pen" class="mr-1" />
                  {{ isEditingUsername || isEditingBio ? (hasChanges ? 'Save changes' : 'Cancel') : 'Edit profile' }}
                </button>

                <button v-else-if="!profileUser.following.includes(user.id)" @click="followUser"
                  class="drop-shadow-xl px-4 py-2 bg-blue-700 text-white font-semibold rounded hover:bg-blue-800 transition duration-100">
                  <fa icon="user-plus" class="mr-1" />
                  Follow
                </button>

                <button v-else @click="unfollowUser"
                  class="drop-shadow-xl px-4 py-2 bg-red-700 text-white font-semibold rounded hover:bg-red-800 transition duration-100">
                  <fa icon="user-times" class="mr-1" />
                  Unfollow
                </button>
              </div>
            </div>

            <!-- Stat Badges -->
            <div class="flex space-x-3 text-m justify-end mb-4">
              <div class="flex items-center bg-[#522623] px-2 py-1 rounded-full text-white">
                <fa icon="book" class="mr-1" /> {{ user.readingStats.booksReadThisYear }} books
              </div>
              <div class="flex items-center border-2 border-[#522623] px-2 py-1 rounded-full text-[#522623]">
                <fa icon="book-open" class="mr-1" /> {{ user.readingStats.pagesRead }} pages
              </div>
              <div class="flex items-center bg-[#522623] px-2 py-1 rounded-full text-white">
                <fa icon="fire" class="mr-1" /> {{ user.readingStats.avgRatingGiven }} points
              </div>
            </div>

            <!-- Followers / Following -->
            <div class="mb-8 flex space-x-5 text-gray-700">
              <p><strong>{{ user.followers.length }}</strong> Followers</p>
              <p><strong>{{ user.following.length }}</strong> Following</p>
            </div>

            <!-- Bio -->
            <div class="mb-6 text-black">
              <div class="font-bold">
                <p>Bio</p>
              </div>
              <div class="rounded-lg bg-white text-m" @dblclick="isEditingBio = true">
                <template v-if="isEditingBio">
                  <textarea v-model="bioInput"
                    class="w-full text-black mt-1 mb-2 text-m border border-gray-300 rounded px-2 py-1"
                    @blur="saveBio"></textarea>
                </template>
                <template v-else>
                  <p>{{ user.bio }}</p>
                </template>
              </div>
            </div>

            <div class="text-sm text-gray-500 mb-10">
              Joined on {{ new Date(user.createdAt).toLocaleDateString() }}
            </div>

            <!-- Bookshelves -->
            <div>
              <h2 class="text-2xl font-bold mb-4">Bookshelves</h2>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div v-for="shelf in user.bookshelves" :key="shelf.id"
                  class="bg-yellow-100 p-4 rounded shadow text-center">
                  <h3 class="text-sm word-break">
                    {{ shelf.name.length > 17 ? shelf.name.substring(0, 17) + '...' : shelf.name }}
                  </h3>
                  <p class="text-xs text-gray-500">{{ shelf.books.length }} books</p>
                </div>
              </div>

              <!-- Preferences and security -->
              <div v-if="profileUser && user.id === profileUser.id">
                <h4 class="text-2xl font-bold mt-10 mb-4">Preferences</h4>
                <div>
                  <!-- TODO darkmode toggle -->
                </div>
                <h5 class="text-2xl font-bold mt-10 mb-4">Privacy and security</h5>
                <button
                  class="bg-red-700 px-4 mb-20 py-2 font-semibold rounded hover:bg-red-850 drop-shadow-xl transition duration-300 text-white">
                  <fa icon="key" class="mr-1" />
                  Change password
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script lang="ts" setup>
import type { IUser } from "@/types/interfaces/IUser";
import { useUserStore } from '@/stores/userStore';
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";

const userStore = useUserStore();
const route = useRoute();

const usernameInput = ref("");
const bioInput = ref("");
const emailInput = ref("");
const profilePictureInput = ref("");
const isEditingEmail = ref(false);
const isEditingPicture = ref(false);

const saveEmail = () => {
  if (emailInput.value !== user.value?.email) {
    console.log("Saving updated email:", emailInput.value);
    user.value!.email = emailInput.value;
  }
  isEditingEmail.value = false;
};

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
const isEditing = ref(false);
const hasChanges = computed(() =>
  usernameInput.value !== user.value?.username ||
  bioInput.value !== user.value?.bio
);
const toggleEdit = async () => {
  if (!user.value) return;

  if (isEditing.value && hasChanges.value) {
    user.value.username = usernameInput.value;
    user.value.bio = bioInput.value;
    await userStore.editUserById(user.value.id, {
      ...user.value,
      username: usernameInput.value,
      bio: bioInput.value,
    });
  }
  isEditing.value = !isEditing.value;
};

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

// Edit profile function (just a placeholder for now)
const editProfile = () => {
  try {
    if (!user.value) return;
    userStore.editUserById(user.value!.id, user.value!);
    console.log("Editing profile", user.value);
  } catch (error) {
    console.error('Error renaming bookshelf:', error);
  }
};

const followUser = async () => {
  try {
    if (!user.value || !profileUser.value) return
    await userStore.followUser(user.value.id)
    profileUser.value.following.push(user.value.id) // Optimistically update
  } catch (error) {
    console.error('Failed to follow user:', error)
  }
}

const unfollowUser = async () => {
  try {
    if (!user.value || !profileUser.value) return
    await userStore.unfollowUser(user.value.id)
    profileUser.value.following = profileUser.value.following.filter(id => id !== user.value.id)
  } catch (error) {
    console.error('Failed to unfollow user:', error)
  }
}

</script>
<style scoped></style>
