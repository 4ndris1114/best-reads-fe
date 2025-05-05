import { defineStore } from 'pinia';
import { ActivityService } from '@/services/ActivityService';
import type { IActivity } from '@/types/interfaces/IActivity';

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
    reset() {
      this.activities = [];
      this.hasMore = true;
      this.skip = 0;
    }
  }
});