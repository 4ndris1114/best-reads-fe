<template>
    <div class="bg-white p-4 rounded-lg shadow-md space-y-2">
      <!-- Dynamic Activity Component -->
      <component :is="activityComponent" :activity="activity" />
  
      <!-- Like + Comment Section -->
      <div class="flex items-center justify-between text-lg text-gray-600">
        <div class="flex items-center space-x-3">
          <button @click="toggleLike" class="hover:text-red-500 cursor-pointer">
            <span v-if="isLiked"><fa  :icon="'heart'" class="text-red-500" /> {{ activity.likes?.length || 0 }}</span>
            <span v-else><fa :icon="'heart'" /> {{ activity.likes?.length || 0 }}</span>
          </button>
          <span><fa :icon="['fas', 'comment']" class="ml-2"/> {{ activity.comments?.length || 0 }} </span>
        </div>
      </div>
  
      <div class="space-y-2">
        <div
          v-for="comment in activity.comments"
          :key="comment.id"
          class="text-sm text-gray-800 border-b pb-1"
        >
          <strong>{{ comment.user }}:</strong> {{ comment.text }}
        </div>
  
        <div class="flex space-x-2 pt-2">
          <input
            v-model="newComment"
            type="text"
            placeholder="Write a comment..."
            class="border rounded p-1 flex-1 outline-slate-500"
          />
          <button @click="submitComment" class="bg-accent text-white px-3 py-1 rounded">
            Post
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import AddedBookActivity from '@/components/activity/AddedBookActivity.vue';
  import RatedBookActivity from '@/components/activity/RatedBookActivity.vue';
  import { ActivityType, fromNumber } from '@/types/enums/ActiviyType';
  import { useActivityStore } from '@/stores/activityStore';
  import { useUserStore } from '@/stores/userStore';
  
  const props = defineProps<{ activity: any }>();
  
  const activityStore = useActivityStore();
  const userStore = useUserStore();

  const isLiked = ref(props.activity.likes?.includes(userStore.loggedInUser?.id) || false);
  const newComment = ref('');
  
  const activityComponent = computed(() => {
    const activityType = fromNumber(props.activity.type);
  
    switch (activityType) {
      case ActivityType.ADDED_BOOK_TO_BOOKSHELF:
        return AddedBookActivity;
      case ActivityType.ADDED_REVIEW:
        return RatedBookActivity;
      default:
        return null;
    }
  });
  
  const toggleLike = async () => {
    try {
      await activityStore.toggleLike(props.activity.id, isLiked.value, userStore.loggedInUser!.id);
      isLiked.value = !isLiked.value;
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  }
  
  function submitComment() {
    if (newComment.value.trim() !== '') {
      activityStore.addComment(props.activity.id, {
        id: Date.now().toString(),
        user: 'You', // Replace with current user
        text: newComment.value.trim(),
      });
      newComment.value = '';
    }
  }
  </script>
  