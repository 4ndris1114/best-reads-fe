import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { BookService } from '@/services/BookService';

export const useBookStore = defineStore('bookStore', {
    state: () => ({
        books: [],
        selectedBook: null,
        loading: false,

        service: new BookService() as BookService
    }),
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
    }
});