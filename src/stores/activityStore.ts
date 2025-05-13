import { defineStore } from 'pinia';
import { ActivityService } from '@/services/ActivityService';
import type { IActivity } from '@/types/interfaces/IActivity';
import type { IComment } from '@/types/IComment';

export const useActivityStore = defineStore('activityStore', {
  state: () => ({
    activities: [] as IActivity[],
    hasMore: true,
    loading: false,
    skip: 0,

    service: new ActivityService()
  }),
  actions: {
    async fetchUserFeed(limit = 20) {
      if (this.loading || !this.hasMore) return;

      this.loading = true;
      try {
        const result = await this.service.fetchUserFeed(this.skip, limit);

        this.activities.push(...result);
        this.skip += result.length;

        if (result.length < limit) {
          this.hasMore = false;
        }
      } catch (error) {
        console.error('Failed to load activities:', error);
      } finally {
        this.loading = false;
      }
    },

    async toggleLike(activityId: string, isLiked: boolean, userId: string) {
      try {
        if (isLiked) {
          const wasUnliked = await this.service.unlikeActivity(activityId, userId);
          if (wasUnliked) {
            this.activities = this.activities.map((activity: IActivity) => {
              if (activity.id === activityId) {
                activity.likes = activity.likes.filter(like => like !== userId);
              }
              return activity;
            });
          }
        } else {
          const wasLiked = await this.service.likeActivity(activityId, userId);
          if (wasLiked) {
            this.activities = this.activities.map((activity: IActivity) => {
              if (activity.id === activityId) {
                activity.likes.push(userId);
              }
              return activity;
            });
          }
        }
      } catch (error) {
        console.error('Failed to toggle like:', error);
        throw error;
      }
    },

    async addComment(activityId: string, commentContent: string) {
      try {
        const newComment = await this.service.addComment(activityId, commentContent);
        this.activities = this.activities.map((activity: IActivity) => {
          if (activity.id === activityId) {
            activity.comments.push(newComment);
          }
          return activity;
        });
      } catch (error) {
        console.error('Failed to add comment:', error);
        throw error;
      }
    },

    reset() {
      this.activities = [];
      this.hasMore = true;
      this.skip = 0;
    }
  }
});