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
        const newBookshelf = { id:"", name: bookshelfName, books: [], isMutable: true } as IBookshelf;
        const createdBookshelf = await this.service.createBookshelf(userId, newBookshelf);
        this.bookshelves.push(createdBookshelf);
      } catch (error) {
        console.error('Error creating bookshelf:', error);
      }
    },

    async addBookToBookshelf(userId: string, bookshelfId: string, bookId: string) {
      try {
        const response = await this.service.addBookToBookshelf(userId, bookshelfId, bookId);
        this.bookshelves.find(bookshelf => bookshelf.id === bookshelfId)!.books.push(bookId);
      } catch (error) {
        console.error('Error adding book to bookshelf:', error);
        throw error;
      }
    },

    async moveBookToBookshelf(userId: string, sourceShelfId: string, bookId: string, targetShelfId: string) {
      try {
        const response = await this.service.moveBookToBookshelf(userId, sourceShelfId, bookId, targetShelfId);
    
        if (response === bookId) {
          // Remove book from source shelf
          const sourceShelf = this.bookshelves.find(bookshelf => bookshelf.id === sourceShelfId);
          if (sourceShelf) {
            sourceShelf.books = sourceShelf.books.filter(id => id !== bookId);
          }
      
          // Add book to target shelf
          const targetShelf = this.bookshelves.find(bookshelf => bookshelf.id === targetShelfId);
          if (targetShelf && !targetShelf.books.includes(bookId)) {
            targetShelf.books.push(bookId);
          }
        }
      } catch (error) {
        console.error('Error moving book to bookshelf:', error);
        throw error;
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
        const updatedName = await this.service.renameBookshelf(userId, bookshelfId, newName);
        this.bookshelves.find(bookshelf => bookshelf.id === bookshelfId)!.name = updatedName;
        return updatedName;
      } catch (error) {
        console.error('Error renaming bookshelf:', error);
      }
    }
  }
})