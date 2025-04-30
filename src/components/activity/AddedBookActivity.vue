<template>
    <div v-if="user" class="p-6 rounded-2xl bg-gray-200 shadow-md text-white">
        <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
                <div class="cursor-pointer" @click="$router.push({ name: 'profilepage', params: { id: user.id } })">
                    <CloudinaryImage v-if="user.profilePicture !== 'default_profile_picture.jpg'" :publicId="user.profilePicture" alt="User profile image" :width="50" :height="50" />
                    <img v-else src="@/assets/default_profile_picture.jpg" alt="User profile image" class="w-20 h-20 rounded-full text-inherit object-cover border" />
                </div>
            </div>
            <div>
                <p class="text-sm text-gray-500">{{ new Date(activity.createdAt).toLocaleDateString() }} at {{ new Date(activity.createdAt).toLocaleTimeString() }}</p>
                <p class="mt-1">
                    <span @click="$router.push({ name: 'profilepage', params: { id: user.id } })" class="font-bold text-black cursor-pointer">{{ user.username }}</span>
                    <span class="text-gray-700"> added </span>
                    <span class="font-semibold text-accent">"{{ activity.payload.BookTitle }}"</span>
                    <span class="text-gray-700"> to their </span>
                    <span class="font-semibold text-accent">"{{ activity.payload.ShelfName }}"</span>
                    <span class="text-gray-700"> bookshelf.</span>
                </p>
            </div>
            <CloudinaryImage v-if="activity.payload.CoverImage" :publicId="activity.payload.CoverImage" alt="Book cover" :width="120" :height="180" />
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