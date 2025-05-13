<template>
    <div class="bg-white p-4 rounded-lg shadow-md space-y-2">
      <!-- Dynamic Activity Component -->
      <component :is="activityComponent" :activity="activity" />
  
      <!-- Like + Comment Section -->
      <div class="flex flex-row items-center space-x-3 relative">
        <button @click="toggleLike" class="relative hover:text-red-500 cursor-pointer">
          <!-- Ping animation circle -->
          <span
            v-if="showPing"
            class="absolute -inset-1 rounded-full bg-red-400 opacity-75 animate-ping"
          ></span>

          <span v-if="isLiked">
            <fa :icon="'heart'" class="text-red-500 relative z-10" /> {{ activity.likes?.length || 0 }}
          </span>
          <span v-else>
            <fa :icon="'heart'" class="relative z-10" /> {{ activity.likes?.length || 0 }}
          </span>
        </button>

        <span @click="toggleComments" class="flex items-center cursor-pointer">
          <fa :icon="['fas', 'comment']" class="mx-1.5" /> {{ activity.comments?.length || 0 }}
        </span>
      </div>
  
        <CommentSection
          :comments="activity.comments"
          :activityId="activity.id"
          :visible="areCommentsVisible"
          @update:visible="areCommentsVisible = $event"
        />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import AddedBookActivity from '@/components/activity/AddedBookActivity.vue';
  import RatedBookActivity from '@/components/activity/RatedBookActivity.vue';
  import { ActivityType, fromNumber } from '@/types/enums/ActiviyType';
  import { useActivityStore } from '@/stores/activityStore';
  import { useUserStore } from '@/stores/userStore';
  import type { IComment } from '@/types/IComment';
  import CommentSection from './CommentSection.vue';
import type { IActivity } from '@/types/interfaces/IActivity';
  
  const props = defineProps<{ activity: any }>();
  
  const activityStore = useActivityStore();
  const userStore = useUserStore();

  const activity = ref(props.activity);

  const showPing = ref(false);
  const isLiked = ref(props.activity.likes?.includes(userStore.loggedInUser?.id) || false);

  const areCommentsVisible = ref(false);
  const newComment = ref('');
  const stubbedComments = ref<IComment[]>(props.activity.comments.slice(0, 5) || []);
  
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
    // Trigger animation
    showPing.value = true;

    // Reset it after the animation duration
    setTimeout(() => {
      showPing.value = false;
    }, 1000);
    try {
      await activityStore.toggleLike(props.activity.id, isLiked.value, userStore.loggedInUser!.id);
      isLiked.value = !isLiked.value;
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  }

  const toggleComments = () => {
    areCommentsVisible.value = !areCommentsVisible.value;
  }

  </script>
  