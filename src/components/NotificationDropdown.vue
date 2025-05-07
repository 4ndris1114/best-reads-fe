<template>
    <div v-on-click-outside="() => emit('close')" class="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50">
        <ul class="py-1 text-sm text-gray-700">
            <li v-if="activities.length > 0" v-for="(activity, index) in activities" :key="index"
                class="flex flex-row items-center p-1">
                <CloudinaryImage v-if="getUserImage(activity.userId) !== 'default_profile_picture.jpg'" :publicId="getUserImage(activity.userId)" alt="user profile image" :width="15" :height="30" 
                class="ml-2"/>
                <img v-else src="@/assets/default_profile_picture.jpg" alt="user profile image" class="ml-2 w-10 h-10 rounded-full text-inherit object-cover" />
                <a @click="removeNotification(activity.id)" href="/" class="block px-4 py-2 hover:bg-gray-100">
                    <!-- I hate typescript -->
                    {{ getUserName(activity.userId) }} {{ getActivityType(activity.type as unknown as number) }}
                </a>
                <div v-if="index !== activities.length - 1" class="border-t border-gray-200"></div>
            </li>
            <li v-else>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100">
                    You don't have any notifications!
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import type { IUser } from '@/types/interfaces/IUser';
import type { IActivity } from '@/types/interfaces/IActivity';
import { ActivityType, fromNumber } from '@/types/enums/ActiviyType';
import { vOnClickOutside } from '@vueuse/components';
import CloudinaryImage from './CloudinaryImage.vue';

const emit = defineEmits(['close']);

const activities = ref<IActivity[]>([]);

const storedActivities = computed(() => JSON.parse(sessionStorage.getItem('activities') || '[]'));

const userStore = useUserStore();
const users = ref<IUser[]>([]);

onMounted(async () => {
    if (Array.isArray(storedActivities.value) && storedActivities.value.length > 0) {
        activities.value = storedActivities.value;
    }
    // Get the unique userIds from activities
    const userIds = Array.from(new Set(activities.value.map(notification => notification.userId)));

    // Fetch users based on the collected userIds
    if (userIds.length > 0) users.value = await userStore.getUsersByIds(userIds);
});

const getUserName = (userId: string) => {
    const user = users.value.find((user: IUser) => user.id === userId);
    return user ? user.username : 'Unknown User'; // Return the username or fallback to 'Unknown User'
};

const getUserImage = (userId: string) => {
    const user = users.value.find((user: IUser) => user.id === userId);
    return user ? user.profilePicture : '';
}

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

const removeNotification = (notificationId: string) => {
    activities.value = activities.value.filter(notification => notification.id !== notificationId);
    sessionStorage.setItem('activities', JSON.stringify(activities.value));
    sessionStorage.setItem('unreadCount', JSON.stringify(activities.value.length));
};
</script>
