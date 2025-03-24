import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ShelfService } from '@/services/ShelfService.ts';
import type { IBookshelf } from '@/types/interfaces/IBookShelf';

export const useShelfStore = defineStore('shelfStore', {
  state: () => ({
    bookshelves: [] as IBookshelf[],
    selectedBookshelf: null,
    loading: false,
    service: new ShelfService() as ShelfService
  }),
  actions: {
    async getBookshelvesForUser(userId: string) {
      try {
        this.loading = true;
        this.bookshelves = await this.service.getBookshelvesForUser(userId);
      } catch (error) {
        console.error('Error fetching bookshelves:', error);
      } finally {
        this.loading = false;
      }
    },
  }
})

