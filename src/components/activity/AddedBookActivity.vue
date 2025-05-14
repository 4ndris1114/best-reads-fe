<template>
    <div v-if="user" class="flex items-start space-x-4">
        <!-- Profile Image -->
        <div class="flex-shrink-0">
            <div class="cursor-pointer" @click="$router.push({ name: 'profilepage', params: { id: user.id } })">
                <CloudinaryImage v-if="user.profilePicture !== 'default_profile_picture.jpg'"
                    :publicId="user?.profilePicture" :isUserImage="true" alt="User profile image" :width="50" :height="50" />
                <img v-else src="@/assets/default_profile_picture.jpg" alt="User profile image"
                    class="w-20 h-20 rounded-full text-inherit object-cover" />
            </div>
        </div>

        <!-- Activity Text -->
        <div class="flex-1">
            <p class="text-sm text-gray-500">
                {{ new Date(activity.createdAt).toLocaleDateString() }} at
                {{ new Date(activity.createdAt).toLocaleTimeString() }}
            </p>
            <p class="mt-1">
                <span @click="$router.push({ name: 'profilepage', params: { id: user.id } })"
                    class="font-bold text-black cursor-pointer">
                    {{ user.username }}
                </span>
                <span class="text-gray-700">
                    {{ activity.payload.isUpdate ? ' moved ' : ' added ' }}
                </span>
                <span class="font-semibold text-accent">"{{ activity.payload.bookTitle }}"</span>
                <span class="text-gray-700">
                    {{ activity.payload.isUpdate ? ' from ' : ' to ' }} their
                </span>
                <span v-if="activity.payload.isUpdate" class="font-semibold text-accent">"{{ activity.payload.sourceShelfName }}"</span>
                <span v-if="activity.payload.isUpdate" class="text-gray-700">
                    {{ activity.payload.isUpdate ? ' to ' : '' }} their
                </span>
                <span class="font-semibold text-accent">"{{ activity.payload.targetShelfName }}"</span>
                <span class="text-gray-700"> bookshelf.</span>
            </p>
        </div>

        <!-- Book Cover Image Justified Right -->
        <div class="flex-shrink-0 self-start">
            <CloudinaryImage class="sm:block hidden" v-if="activity.payload.coverImage"
                :publicId="activity.payload.coverImage" alt="Book cover" :width="120" :height="180" />
            <CloudinaryImage class="sm:hidden block" v-if="activity.payload.coverImage"
                :publicId="activity.payload.coverImage" alt="Book cover" :width="80" :height="130" />
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