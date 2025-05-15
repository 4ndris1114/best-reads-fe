<!-- CommentSection.vue -->
<template>
    <div class="space-y-2">
        <div class="flex space-x-2">
            <input v-model="newComment" type="text" placeholder="Write a comment..."
                class="border rounded p-1 flex-1 outline-slate-500" />
            <button @click="submitComment" class="bg-newYellow hover:bg-newYellow/80 text-white px-3 py-1 rounded-md  cursor-pointer">
                Post
            </button>
        </div>

        <div v-if="areCommentsVisible" class="text-sm text-gray-600 max-h-64 overflow-y-auto">
            <strong class="text-lg">Comments:</strong>

            <div v-for="comment in stubbedComments" :key="comment.id"
                class="flex items-start space-x-3 py-2 border-b border-gray-200">
                <!-- Profile Picture -->
                <CloudinaryImage :publicId="getUserProfilePicture(comment.userId)" :isUserImage="true" :width="40"
                    :height="40" class="w-10 h-10 rounded-full object-cover" />

                <!-- Comment Content -->
                <div class="flex flex-col text-gray-800">
                        <span class="font-extrabold text-md">{{ getUserName(comment.userId) }}</span>
                        <span class="text-[12px] text-gray-600">{{ new Date(comment.createdAt).toLocaleString() }}</span>
                    <span class="text-md font-semibold mt-1">{{ comment.content }}</span>
                </div>
            </div>

            <div v-if="stubbedComments.length < comments.length" class="text-sm text-gray-600 cursor-pointer mt-1"
                @click="loadMoreComments">
                Load more comments...
            </div>
            <div v-else class="text-sm text-gray-600 cursor-pointer mt-1" @click="toggleComments">
                Hide comments...
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useActivityStore } from '@/stores/activityStore';
import { useToastStore } from '@/stores/toastStore';
import type { IComment } from '@/types/IComment';
import type { IUser } from '@/types/interfaces/IUser';
import CloudinaryImage from '../CloudinaryImage.vue';

const props = defineProps<{
    comments: IComment[];
    activityId: string;
    visible: boolean;
}>();

const emit = defineEmits(['update:visible', 'comment-added']);

const userStore = useUserStore();
const activityStore = useActivityStore();
const toastStore = useToastStore();

const commentUsers = ref<IUser[]>([]);
const comments = ref<IComment[]>([...props.comments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
const areCommentsVisible = ref(props.visible);
const newComment = ref('');
const stubbedComments = ref<IComment[]>(comments.value.slice(0, 5));

watch(
    () => props.visible,
    (newVal) => (areCommentsVisible.value = newVal)
);

watch(
    (comments.value),
    (newComments) => {
        stubbedComments.value = newComments.slice(0, stubbedComments.value.length + 1);
    }
);

onMounted(async () => {
    if (comments.value.length === 0) return;
    commentUsers.value = await userStore.getUsersByIds(comments.value.map(comment => { return comment.userId; }))
})

const toggleComments = () => {
    areCommentsVisible.value = !areCommentsVisible.value;
    emit('update:visible', areCommentsVisible.value);
};

const loadMoreComments = () => {
    const current = stubbedComments.value.length;
    stubbedComments.value = [
        ...stubbedComments.value,
        ...comments.value.slice(current, current + 5),
    ];
};

const submitComment = async () => {
    if (newComment.value.trim() !== '') {
        const addedComment = await activityStore.addComment(props.activityId, newComment.value.trim());
        comments.value.unshift(addedComment);
        commentUsers.value.push(await userStore.getUserById(addedComment.userId));
        toastStore.triggerToast('Comment posted successfully', 'success');
        newComment.value = '';
        areCommentsVisible.value = true;
        emit('update:visible', true);
    }
};

const getUserName = (userId: string) => {
    const user = commentUsers.value.find((user: IUser) => user.id === userId);
    return user ? user.username : 'Unknown User';
};

const getUserProfilePicture = (userId: string) => {
    const user = commentUsers.value.find((user: IUser) => user.id === userId);
    return user ? user.profilePicture : '';
};
</script>
