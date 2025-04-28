<template>
    <div v-if="user" class="p-6 rounded-2xl bg-white shadow-md border border-gray-200">
        <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
                <div
                    class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {{ user.username.charAt(0).toUpperCase() }}
                </div>
            </div>
            <div>
                <p class="text-gray-800">
                    <span class="font-semibold">{{ user.username }}</span>
                    added
                    <span class="font-semibold text-blue-600">"{{ activity.payload.BookTitle }}"</span>
                    to their
                    <span class="font-semibold text-purple-600">"{{ activity.payload.ShelfName }}"</span>
                    bookshelf.
                </p>
                <p class="text-sm text-gray-500 mt-1">
                    {{ new Date(activity.createdAt).toLocaleString() }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import type { IBook } from '@/types/interfaces/IBook';
import type { IUser } from '@/types/interfaces/IUser';
import { onMounted, ref } from 'vue';

const props = defineProps<{ activity: any }>();

const userStore = useUserStore();
const user = ref<IUser | null>(null);

onMounted(async () => {
    user.value = await userStore.getUserById(props.activity.userId);
});
</script>