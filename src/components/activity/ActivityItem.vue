<template>
    <component :is="activityComponent" :activity="activity" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AddedBookActivity from '@/components/activity/AddedBookActivity.vue';
import RatedBookActivity from '@/components/activity/RatedBookActivity.vue';
import { ActivityType } from '@/types/enums/ActiviyType';

const props = defineProps<{ activity: any }>();

const activityComponent = computed(() => {
    switch (props.activity.type) {
        case ActivityType.ADDED_BOOK_TO_BOOKSHELF:
            return AddedBookActivity;
        case ActivityType.ADDED_REVIEW:
            return RatedBookActivity;
        default:
            return null;
    }
});
</script>