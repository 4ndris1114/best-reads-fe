import { defineStore } from 'pinia';
import { ActivityService } from '@/services/ActivityService';
import type { IActivity } from '@/types/interfaces/IActivity';

export const useActivityStore = defineStore('activity', {
  state: () => ({
    activities: [] as IActivity[],
    hasMore: true,
    loading: false,

    service: new ActivityService() as ActivityService
  }),
  actions: {
    async fetchUserFeed() {
      if (this.loading) return;

      this.loading = true;
      try {
        const result = await this.service.fetchUserFeed();

        this.activities = result;
        if (result.length < 20) {
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
    }
  }
});
