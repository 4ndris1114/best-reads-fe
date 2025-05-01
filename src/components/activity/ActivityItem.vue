<template>
    <div class="bg-white p-4 rounded-lg shadow-md space-y-4">
      <!-- Dynamic Activity Component -->
      <component :is="activityComponent" :activity="activity" />
  
      <!-- Like + Comment Section -->
      <div class="flex items-center justify-between text-sm text-gray-600">
        <div class="flex items-center space-x-3">
          <button @click="toggleLike" class="hover:text-red-500 cursor-pointer">
            {{ activity.likes?.length || 0 }} likes
          </button>
          <span>{{ activity.comments?.length || 0 }} comments</span>
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
  
  const props = defineProps<{ activity: any }>();
  
  const activityStore = useActivityStore();
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
  
  function toggleLike() {
    activityStore.toggleLike(props.activity.id);
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
  