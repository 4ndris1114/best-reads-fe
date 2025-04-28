<template>
    <div v-if="user" class="p-6 rounded-2xl bg-[#181C20] shadow-md border border-gray-700 text-white">
        <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
                <div>
                    <CloudinaryImage v-if="user.profilePicture !== 'default_profile_picture.jpg'" :publicId="user.profilePicture" alt="User profile image" :width="50" :height="50" />
                    <img v-else src="@/assets/default_profile_picture.jpg" alt="User profile image" class="w-16 h-16 rounded-full text-black object-cover border" />
                </div>
            </div>
            <div>
                <p class="text-sm text-gray-400">{{ new Date(activity.createdAt).toLocaleDateString() }}</p>
                <p class="mt-1">
                    <span class="font-semibold text-white">{{ user.username }}</span>
                    <span class="text-gray-400"> added </span>
                    <span class="font-semibold text-blue-400">"{{ activity.payload.BookTitle }}"</span>
                    <span class="text-gray-400"> to their </span>
                    <span class="font-semibold text-purple-400">"{{ activity.payload.ShelfName }}"</span>
                    <span class="text-gray-400"> bookshelf.</span>
                </p>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import CloudinaryImage from '../CloudinaryImage.vue';
import type { IUser } from '@/types/interfaces/IUser';
import { onMounted, ref } from 'vue';

const props = defineProps<{ activity: any }>();

const userStore = useUserStore();
const user = ref<IUser | null>(null);

onMounted(async () => {
    user.value = await userStore.getUserById(props.activity.userId);
});
</script>