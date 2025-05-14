<template>
    <div class="flex flex-col mx-auto  h-[85vh] mt-[2vh] rounded-lg overflow-hidden">
      <div class="h-3 bg-newYellow mb-0.5" />

      <!-- Scrollable content area -->
      <div class="flex-1 overflow-y-auto bg-primary space-y-7 px-8 py-6">
        <ActivityItem
          v-if="activities.length > 0"
          v-for="activity in activities"
          :key="activity.id"
          :activity="activity"
        />
        <div v-else class="text-center">
          <p class="text-gray-500">No activities to show. Are you following anyone?</p>
          <button 
            @click="() => activityStore.fetchUserFeed()"
            class="bg-accent text-white px-4 py-2 mt-4 rounded-lg">
            {{ activityStore.loading ? 'Loading...' : 'Refresh' }}
          </button>
        </div>
        <div v-if="hasMore" class="text-center">
          <button
            @click="() => activityStore.fetchUserFeed()"
            class="bg-accent text-white px-4 py-2 rounded-lg"
          >
            Load more
          </button>
        </div>
      </div>
      <!-- Bottom accent line -->
      <div class="h-3 bg-highlight -mt-0.5" />
    </div>
  </template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ActivityItem from './ActivityItem.vue';
import { useActivityStore } from '@/stores/activityStore';

const activityStore = useActivityStore();

const activities = computed(() => activityStore.activities);
const hasMore = computed(() => activityStore.hasMore);

onMounted(async () => {
    await activityStore.fetchUserFeed();
});
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
