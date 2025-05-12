<template>
  <MainLayout>
    <div v-if="user === null" class="h-screen flex items-center justify-center bg-white text-gray-500">
      <p>User not found.</p>
    </div>
    <div v-else class="flex h-screen bg-white">
      <!-- Static Left Sidebar -->
      <aside class="ml-65 mr-10 mt-13 bg-white text-black">
        <!-- Profile picture -->
        <div class="relative">
          <img :src="'../src/assets/' + user?.profilePicture" alt="Profile Picture"
            class="w-32 h-32 rounded-full object-cover border mb-4" />
            <fa @click="showImageUploadModal = true" icon="pencil" class="absolute top-0 right-11 bg-black text-white rounded-full p-1 scale-125" />
        </div>

        <section v-if="loggedInUser && user.id === loggedInUser.id">
          <!-- Navigation Links -->
          <nav class="mt-6 space-y-4 text-black font-semibold">
            <a href="#bio" class="block hover:font-bold hover:text-red-700"><fa icon="circle-info" class="text-black mr-1" />Public information</a>
            <a href="#bookshelves" class="block hover:font-bold hover:text-red-700"><fa icon="bookmark" class="text-black mr-1" />Public Bookshelves</a>
            <a href="#preferences" class="block hover:font-bold hover:text-red-700"><fa icon="pen-nib" class="text-black mr-1" />Preferences</a>
            <a href="#security" class="block hover:font-bold hover:text-red-700"><fa icon="shield" class="text-black mr-1" />
              Privacy & Security</a>
          </nav>
        </section>
      </aside>

      <!-- Scrollable Right Content -->
      <div class="flex-1 overflow-y-auto mt-5 mr-40 p-6">
        <div v-if="user === null" class="mt-20 text-center text-gray-500">
          <p>User not found.</p>
        </div>

        <div v-else class="max-w-5xl mx-auto">
          <!-- Header section -->
          <div class="flex items-start space-x-6">
            <div class="flex-1">
              <!-- Username + Badges + Buttons -->
              <div class="flex items-center justify-between mb-4 flex-wrap gap-y-2">
                <!-- Left side: Username + Badges -->
                <div class="flex items-center flex-wrap gap-x-4">
                  <!-- Username -->
                  <template v-if="isEditing">
                    <input v-model="usernameInput" type="text"
                      class="text-3xl font-bold text-gray-900 border border-gray-300 rounded px-2" />
                  </template>
                  <template v-else>
                    <h1 class="text-4xl font-bold text-gray-900">{{ user.username }}</h1>
                  </template>
                  <UserBadges :readingStats="user.readingStats" />
                </div>
                <!-- Right side: Buttons -->
                <div class="flex space-x-2">
                  <button v-if="loggedInUser && user.id === loggedInUser.id" @click="toggleEdit"
                    class="drop-shadow-xl px-4 py-2 bg-blue-700 text-white font-semibold text-sm rounded hover:bg-blue-800 transition duration-100 cursor-pointer">
                    <fa icon="pen" class="mr-1" />
                    {{isEditing ? 'Save changes' : 'Edit profile' }}
                  </button>

                  <button v-else-if="isFollowing" @click="followUser" :disabled="followDisabled"
                    class="drop-shadow-xl px-4 py-2 bg-primary text-white font-semibold rounded-full hover:bg-blue-800 transition duration-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    <fa icon="user-plus" class="mr-1" />
                    Follow
                  </button>

                  <button v-else @click="unfollowUser" :disabled="followDisabled"
                    class="drop-shadow-xl px-4 py-2 bg-primary text-white font-semibold rounded-full hover:bg-red-800 transition duration-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    <fa icon="user-times" class="mr-1" />
                    Unfollow
                  </button>
                </div>
              </div>

              <div class="mb-8 flex space-x-5 text-gray-700">
                <p @click="openFollowers" class="cursor-pointer hover:underline">
                  <strong>{{ user.followers.length }}</strong> Followers
                </p>
                <p @click="openFollowing" class="cursor-pointer hover:underline">
                  <strong>{{ user.following.length }}</strong> Following
                </p>
              </div>

              <FollowerListModal 
                :show="showFollowerModal" 
                title="Followers" 
                :userIds="user.followers" 
                @close="showFollowerModal = false"
              />

              <FollowerListModal 
                :show="showFollowingModal" 
                title="Following" 
                :userIds="user.following" 
                @close="showFollowingModal = false"
              />

              <!-- Bio Section -->
              <section id="bio" class="mb-3 text-black">
                <h2 class="font-bold mb-1">Bio</h2>
                <div class="rounded-lg bg-white text-m" @dblclick="isEditing = true">
                  <template v-if="isEditing">
                    <textarea v-model="bioInput"
                      class="w-full h-full text-black mt-1 text-m border border-gray-300 rounded px-2 py-1"
                      ></textarea>
                  </template>
                  <template v-else>
                    <p>{{ user.bio }}</p>
                  </template>
                </div>
              </section>

              <div class="text-sm text-gray-500 mb-7">
                Joined on {{ new Date(user.createdAt).toLocaleDateString() }}
              </div>

              <BookshelvesOverview :bookshelves="user.bookshelves" />

              <!-- Preferences and Security -->
              <section v-if="loggedInUser && user.id === loggedInUser.id">
                <section id="preferences">
                  <h4 class="text-2xl font-bold mt-10 mb-4"><fa icon="pen-nib" class="text-black mr-1" />
                    Preferences</h4>
                  <!-- TODO darkmode toggle -->
                </section>

                <section id="security">
                  <h5 class="text-2xl font-bold mt-10 mb-4"><fa icon="shield" class="text-black mr-1" />
                    Privacy and security</h5>
                  <div class="flex flex-col items-start">
                  <button
                    class="bg-red-700 px-4 mb-4 py-2 font-semibold rounded hover:bg-red-850 drop-shadow-xl text-sm transition duration-300 text-white">
                    <fa icon="envelope" class="mr-1" />
                    Change e-mail
                  </button>
                  <button
                    class="bg-red-700 px-4 mb-20 py-2 font-semibold rounded hover:bg-red-850 drop-shadow-xl text-sm transition duration-300 text-white">
                    <fa icon="key" class="mr-1" />
                    Change password
                  </button>
                  </div>
                </section>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
    <UploadImageWidget @upload="handleImageUpload" @close="showImageUploadModal = false" v-if="showImageUploadModal" />

  </MainLayout>
</template>

<script lang="ts" setup>
import type { IUser } from "@/types/interfaces/IUser";
import { useUserStore } from '@/stores/userStore';
import { watch, ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import UserBadges from '@/components/ProfileBadges.vue';
import BookshelvesOverview from "@/components/BookshelvesOverview.vue";
import FollowerListModal from "@/components/FollowerListModal.vue";
import { useToastStore } from '@/stores/toastStore';
import UploadImageWidget from "@/components/UploadImageWidget.vue";

const toastStore = useToastStore();

const userStore = useUserStore();
const route = useRoute();

const usernameInput = ref("");
const bioInput = ref("");

const showImageUploadModal = ref(false);
const showFollowerModal = ref(false);
const showFollowingModal = ref(false);

const openFollowers = () => {
  showFollowerModal.value = true;
};
const openFollowing = () => {
  showFollowingModal.value = true;
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

const user = ref<IUser | null>(null); // current profile you're viewing
const loggedInUser: IUser = userStore.loggedInUser!; //logged in user
const isFollowing = computed(() => {
  return !user.value?.followers.some(followerId => followerId === loggedInUser.id) || false;
});
const followDisabled = ref(false);
const isEditing = ref(false);

watch(
  () => isEditing.value,
  async (editing) => {
    if (!editing) {
      const toBeUpdated = {...user.value!}
      toBeUpdated.bio = bioInput.value
      toBeUpdated.username = usernameInput.value
      try {
        const updatedUser = await userStore.editUserById(user.value!.id, toBeUpdated)
        user.value = updatedUser
        toastStore.triggerToast("Your profile has been edited successfully.", 'success')
      } catch(e) {
      }
    }
  }
)

const followUser = async () => {
  if (followDisabled.value) return;

  followDisabled.value = true;
  setTimeout(() => {
    followDisabled.value = false;
  }, 2000); // 2 seconds cooldown

  try {
    const updatedUser = await userStore.followUser(loggedInUser.id, user.value!.id);
    if (updatedUser) {
      user.value = updatedUser;
    }
    toastStore.triggerToast("You are now following " + user.value?.username, 'success')
  } catch (err) {
    console.error("Failed to follow user:", err);
  }
}

const unfollowUser = async () => {
  if (followDisabled.value) return;

  followDisabled.value = true;
  setTimeout(() => {
    followDisabled.value = false;
  }, 2000); // 2 seconds cooldown
  try {
    const updatedUser = await userStore.unfollowUser(loggedInUser.id, user.value!.id);
    if (updatedUser) {
      user.value = updatedUser;
    }
    toastStore.triggerToast("You are no longer following " + user.value?.username, 'success')
  } catch (err) {
    console.error("Failed to unfollow user:", err);
  }
}

const handleImageUpload = async (file: File) => {
  try {
    // get cloduinary signature from BE
    const signature: { timestamp: string; signature: string } = await userStore.getCloudinarySignature(loggedInUser.id);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
    formData.append("timestamp", signature.timestamp);
    formData.append("signature", signature.signature);
    formData.append("folder", "users");
    formData.append("overwrite", "true");
    formData.append("public_id", loggedInUser.id);
    
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Uploaded image URL:", data.secure_url);
  } catch (error) {
    console.error("Image upload failed:", error);
  }
};

const toggleEdit = () => {
isEditing.value = !isEditing.value
}

</script>
<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
