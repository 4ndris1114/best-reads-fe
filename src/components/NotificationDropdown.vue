<template>
    <div class="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
        <ul class="py-1 text-sm text-gray-700">
            <li v-for="(activity, index) in activities" :key="index">
                <a href="#" class="block px-4 py-2 hover:bg-gray-100">
                    <!-- I hate typescript -->
                    {{ getUserName(activity.userId) }} {{ getActivityType(activity.type as unknown as number) }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import type { IUser } from '@/types/interfaces/IUser';
import type { IActivity } from '@/types/interfaces/IActivity';
import { ActivityType, fromNumber } from '@/types/enums/ActiviyType';

const activities = ref<IActivity[]>([]);

const userStore = useUserStore();
const users = ref<IUser[]>([]);

onMounted(async () => {
    const storedActivities = JSON.parse(localStorage.getItem('activities') || '[]');
    if (Array.isArray(storedActivities) && storedActivities.length > 0) {
        activities.value = storedActivities;
    }
    // Get the unique userIds from activities
    const userIds = Array.from(new Set(activities.value.map(notification => notification.userId)));

    // Fetch users based on the collected userIds
    users.value = await userStore.getUsersByIds(userIds);
});

const getUserName = (userId: string) => {
    const user = users.value.find((user: IUser) => user.id === userId);
    return user ? user.username : 'Unknown User'; // Return the username or fallback to 'Unknown User'
};

const getActivityType = (type: number) => {
    switch (fromNumber(type)) {
        case ActivityType.ADDED_BOOK_TO_BOOKSHELF:
            return 'added a book to their bookshelf.';
        case ActivityType.ADDED_REVIEW:
            return 'added a new review.';
        default:
            return '';
    }
};
</script>
