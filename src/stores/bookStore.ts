import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { BookService } from '@/services/BookService';
import type { IBook } from '@/types/interfaces/IBook';

export const useBookStore = defineStore('bookStore', {
    state: () => ({
        books: [] as IBook[],
        selectedBook: null,
        loading: false,

        service: new BookService() as BookService
    }),
    getters: {
        getBooks: (state) => state.books,
        getSelectedBook: (state) => state.selectedBook,
        isLoading: (state) => state.loading
    },
    actions: {
        async getAllBooks() {
            try {
                this.loading = true;
                this.books = await this.service.getAll();
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                this.loading = false;
            }
        },
        async getBookById(bookId: string): Promise<IBook> {
          try {
            this.loading = true;
            return await this.service.getBookById(bookId);
          } catch (error) {
            console.error('Error fetching book:', error);
            throw error;
          } finally {
            this.loading = false;
          }
        }
    }

});
