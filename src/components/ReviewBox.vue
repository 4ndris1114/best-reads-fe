<template>
    <div>
        <div v-if="user" class="flex items-center">
            <img class="w-16 h-16 rounded-full mr-4" :src="'../src/assets/' + user.profilePicture" alt="User Avatar">
            <div>
                <h3 class="text-lg font-semibold">{{ user.username }}</h3>
                <p class="text-sm text-gray-500">{{ review.createdAt.toLocaleString().split('T')[0] }}</p>
            </div>
        </div>
        <p class="mt-2 text-gray-700">{{ review.review }}</p>
    </div>
</template>

<script setup lang="ts">
import type { IRating } from '@/types/interfaces/IRating';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import type { IUser } from '@/types/interfaces/IUser';

const props = defineProps({
    review: {
        type: Object as () => IRating,
        required: true
    }
})

onMounted(async () => {
    user.value = await userStore.getUserById(props.review.userId);
})

const userStore = useUserStore();
const user = ref<IUser>();
</script>

<style scoped>

</style>