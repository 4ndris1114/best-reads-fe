import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ShelfService } from '@/services/ShelfService.ts';
import type { IBookshelf } from '@/types/interfaces/IBookshelf';
import { useUserStore } from './userStore';
import type { IBookshelfBook } from '@/types/interfaces/IBookshelfBook';

export const useShelfStore = defineStore('shelfStore', {
  state: () => ({
    bookshelves: useUserStore().loggedInUser ? useUserStore().loggedInUser!.bookshelves : [] as IBookshelf[],
    selectedBookshelf: null,
    loading: false,

    userStore: useUserStore(),
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
      } catch (error) {
        console.error('Error creating bookshelf:', error);
      }
    },

    async addBookToBookshelf(userId: string, bookshelfId: string, bookId: string) {
      try {
        const response = await this.service.addBookToBookshelf(userId, bookshelfId, bookId);
    
        const bookshelf = this.bookshelves.find(bookshelf => bookshelf.id === bookshelfId);
        if (bookshelf && !bookshelf.books.some(book => book.id === bookId)) {
          bookshelf.books.push({ id: bookId, updatedAt: new Date().toISOString() } as unknown as IBookshelfBook);
        }
        this.userStore.loggedInUser = await this.userStore.getUserById(userId);
      } catch (error) {
        console.error('Error adding book to bookshelf:', error);
        throw error;
      }
    },

    async removeBookFromBookshelf(userId: string, bookshelfId: string, bookId: string) {
      try {
        await this.service.removeBookFromBookshelf(userId, bookshelfId, bookId);
    
        const bookshelf = this.bookshelves.find(bookshelf => bookshelf.id === bookshelfId);
        if (bookshelf) {
          bookshelf.books = bookshelf.books.filter(book => book.id !== bookId);
        }
        this.userStore.loggedInUser = await this.userStore.getUserById(userId);
      } catch (error) {
        console.error('Error removing book from bookshelf:', error);
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
            sourceShelf.books = sourceShelf.books.filter(book => book.id !== bookId);
          }
    
          // Add book to target shelf
          const targetShelf = this.bookshelves.find(bookshelf => bookshelf.id === targetShelfId);
          if (targetShelf && !targetShelf.books.some(book => book.id === bookId)) {
            targetShelf.books.push({ id: bookId, updatedAt: new Date().toISOString() } as unknown as IBookshelfBook);
          }
        }
        this.userStore.loggedInUser = await this.userStore.getUserById(userId);
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
