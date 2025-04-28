<template>
    <div class="flex flex-col items-center justify-center mx-auto max-w-2xl space-y-6 bg-[#181C20] rounded-lg mt-[5vh] p-8">
        <ActivityItem v-if="activities" v-for="activity in activities" :key="activity.id" :activity="activity" />
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