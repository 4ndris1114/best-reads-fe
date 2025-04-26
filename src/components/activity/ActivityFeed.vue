<template>
    <div class="space-y-4">
        <ActivityItem v-for="activity in activities" :key="activity.id" :activity="activity" />
        <!-- <button v-if="hasMore" @click="loadMore">Load more</button> -->
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ActivityItem from './ActivityItem.vue';
import { useActivityStore } from '@/stores/activityStore';

const activityStore = useActivityStore();

const activities = computed(() => activityStore.activities);
const hasMore = computed(() => activityStore.hasMore);

onMounted(() => {
    activityStore.fetchUserFeed();
});
</script>