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
    },

    async addBookToBookshelf(userId: string, bookshelfId: string, bookId: string) {
      try {
        const response = await this.service.addBookToBookshelf(userId, bookshelfId, bookId);
        console.log('Book', bookId, 'successfully added to bookshelf:', response);
      } catch (error) {
        console.error('Error adding book to bookshelf:', error);
      }
    },

    async deleteBookshelf(userId: string, bookshelfId: string) {
      try {
        await this.service.deleteBookshelf(userId, bookshelfId);
        this.bookshelves = this.bookshelves.filter(bookshelf => bookshelf.id !== bookshelfId);
      } catch (error) {
        console.error('Error deleting bookshelf:', error);
      }
    },

    async renameBookshelf(userId: string, bookshelfId: string, newName: string) {
      try {
        const updatedBookshelf = await this.service.renameBookshelf(userId, bookshelfId, newName);
        this.bookshelves = this.bookshelves.map(bookshelf => {
          if (bookshelf.id === bookshelfId) {
            return updatedBookshelf;
          }
          return bookshelf;
        });
      } catch (error) {
        console.error('Error renaming bookshelf:', error);
      }
    }
  }
})

