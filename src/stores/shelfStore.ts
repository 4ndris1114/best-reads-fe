import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ShelfService } from '@/services/ShelfService.ts';
import type { IBookshelf } from '@/types/interfaces/IBookshelf';
import { useUserStore } from './userStore';

export const useShelfStore = defineStore('shelfStore', {
  state: () => ({
    bookshelves: useUserStore().loggedInUser ? useUserStore().loggedInUser!.bookshelves : [] as IBookshelf[],
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

    async createBookshelf(userId: string, bookshelfName: string) {
      try {
        const newBookshelf = { id:"", name: bookshelfName, books: [] } as IBookshelf;
        const createdBookshelf = await this.service.createBookshelf(userId, newBookshelf);
        this.bookshelves.push(createdBookshelf);
      } catch (error) {
        console.error('Error creating bookshelf:', error);
      }
    }
  }
})

