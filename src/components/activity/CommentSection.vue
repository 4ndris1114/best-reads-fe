<!-- CommentSection.vue -->
<template>
    <div class="space-y-2">
      <div class="flex space-x-2">
        <input
          v-model="newComment"
          type="text"
          placeholder="Write a comment..."
          class="border rounded p-1 flex-1 outline-slate-500"
        />
        <button
          @click="submitComment"
          class="bg-accent text-white px-3 py-1 rounded cursor-pointer"
        >
          Post
        </button>
      </div>
  
      <div v-if="areCommentsVisible" class="text-sm text-gray-600 max-h-64 overflow-y-auto">
        <strong class="text-lg">Comments:</strong>
  
        <div
          v-for="comment in stubbedComments"
          :key="comment.id"
          class="text-sm text-gray-800 border-b pb-1"
        >
          <strong>{{ getUserName(comment.userId) }}:</strong> {{ comment.content }}
        </div>
  
        <div
          v-if="stubbedComments.length < comments.length"
          class="text-sm text-gray-600 cursor-pointer"
          @click="loadMoreComments"
        >
          Load more comments
        </div>
        <div
          v-else
          class="text-sm text-gray-600 cursor-pointer"
          @click="toggleComments"
        >
          Hide comments
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  import { useActivityStore } from '@/stores/activityStore';
  import { useToastStore } from '@/stores/toastStore';
  import type { IComment } from '@/types/IComment';
  
  const props = defineProps<{
    comments: IComment[];
    activityId: string;
    visible: boolean;
  }>();
  
  const emit = defineEmits(['update:visible', 'comment-added']);
  
  const userStore = useUserStore();
  const activityStore = useActivityStore();
  const toastStore = useToastStore();
  
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
        console.log("newComments", newComments);
      stubbedComments.value = newComments.slice(0, stubbedComments.value.length);
    }
  );
  
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
      console.log("addedComment", addedComment);
      
      comments.value.unshift(addedComment);
      toastStore.triggerToast('Comment posted successfully', 'success');
      newComment.value = '';
      areCommentsVisible.value = true;
      emit('update:visible', true);
    }
  };
  
  const getUserName = async (userId: string) => {
    const user = await userStore.getUserById(userId);
    return user.username;
  };
  </script>
  