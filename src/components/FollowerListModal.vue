<template>
  <div v-if="show && users.length === 0"
    class="fixed inset-0 bg-black/[var(--bg-opacity)] [--bg-opacity:50%] flex justify-center items-center z-50">
    <div class="bg-white rounded-lg w-full max-w-md p-6 overflow-y-auto max-h-[80vh]">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">{{ title }}</h2>
        <button @click="close" class="text-gray-500 hover:text-gray-800">&times;</button>
      </div>

      <p class="text-gray-700">No one to find here.</p>
    </div>
  </div>
  <div v-else-if="show"
    class="fixed inset-0 bg-black/[var(--bg-opacity)] [--bg-opacity:50%] flex justify-center items-center z-50">
    <div class="bg-white rounded-lg w-full max-w-md p-6 overflow-y-auto max-h-[80vh]">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">{{ title }}</h2>
        <button @click="close" class="text-gray-500 hover:text-gray-800">&times;</button>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-10">
        <p>Loading...</p>
      </div>

      <ul v-else>
        <li v-for="user in users" :key="user.id" class="flex items-center space-x-4 py-2">
          <CloudinaryImage @click="$router.push({ name: 'profilepage', params: { id: user.id } })"
            :publicId="user.profilePicture" alt="Profile" class="w-10 h-10 rounded-full object-cover border" /> <span
            @click="$router.push({ name: 'profilepage', params: { id: user.id } })" class="font-semibold">{{
              user.username }}</span>
        </li>
      </ul>

      <div v-if="hasMore" class="flex justify-center mt-4">
        <button @click="loadMore"
          class="px-4 py-2 bg-blue-700 text-white font-semibold rounded hover:bg-blue-800 transition"
          :disabled="loadingMore">
          {{ loadingMore ? 'Loading...' : 'Load More' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { useUserStore } from '@/stores/userStore'; // we'll create this next
import CloudinaryImage from './CloudinaryImage.vue';

interface UserSummary {
  id: string;
  username: string;
  profilePicture: string;
}

const props = defineProps<{
  show: boolean;
  title: string;
  userIds: string[];
}>();

const emit = defineEmits(['close']);

const userStore = useUserStore();

const users = ref<UserSummary[]>([]);
const loading = ref(false);
const loadingMore = ref(false);
const pageSize = 20;
const currentPage = ref(0);

const hasMore = computed(() => {
  return users.value.length < props.userIds.length;
});

watch(() => props.show, async (newVal) => {
  if (newVal) {
    await loadInitial();
  }
});

const loadInitial = async () => {
  users.value = [];
  currentPage.value = 0;
  await loadMore();
};

const loadMore = async () => {
  if (loading.value || loadingMore.value) return;

  if (currentPage.value === 0) {
    loading.value = true;
  } else {
    loadingMore.value = true;
  }

  const start = currentPage.value * pageSize;
  const end = start + pageSize;
  const idsToFetch = props.userIds.slice(start, end);

  try {
    const fetchedUsers = await userStore.getUsersByIds(idsToFetch);
    users.value.push(...fetchedUsers);
    currentPage.value++;
  } catch (err) {
    console.error('Failed to load users:', err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const close = () => {
  emit('close');
};
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
