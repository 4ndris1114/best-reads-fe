import { defineStore } from 'pinia'
import { BookService } from '@/services/BookService';
import type { IBook } from '@/types/interfaces/IBook';
import type { IReview } from '@/types/interfaces/IReview';
import type { IBookSearchResult } from '@/types/interfaces/IBookSearchResult';

export const useBookStore = defineStore('bookStore', {
    state: () => ({
        books: [] as IBook[],
        selectedBook: null as IBook | null,
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
            const book = await this.service.getBookById(bookId);
            if (book && !this.books.find(b => b.id === book.id)) {
              this.books.push(book);
              return book;
            } else {
              return book;
            }
          } catch (error) {
            console.error('Error fetching book:', error);
            throw error;
          } finally {
            this.loading = false;
          }
        },

        async searchBooks(query: string): Promise<IBookSearchResult[]> {
          try {
            this.loading = true;
            const books = await this.service.searchBooks(query);
            return books;
          } catch (error) {
            console.error('Error searching books:', error);
            throw error;
          } finally {
            this.loading = false;
          }
        },

        async searchAndAddFromOpenLibraryByTitle(query: string): Promise<IBook | null> {
          try {
            this.loading = true;
            const book = await this.service.searchAndAddFromOpenLibraryByTitle(query);
            return book;
          } catch (error) {
            console.error('Error searching and adding from Open Library:', error);
            throw error;
          } finally {
            this.loading = false;
          }
        },

        async selectBook(bookId: string) {
          const bookToBeSelected = this.books.find(book => book.id === bookId);
          if (!bookToBeSelected) {
            try {
              this.selectedBook = await this.service.getBookById(bookId);
            } catch (error) {
                console.error('Cannot select book, failed to fetch:', error);
            }
          } else {
            this.selectedBook = bookToBeSelected;
          }
        },
        async postReview(bookId: string, review: IReview) {
          try {
            const response = await this.service.postReview(bookId, review);
            this.selectedBook!.reviews.push(response);
            return response;
          } catch (error) {
            console.error('Error posting review:', error);
            throw error;
          }
        },

        async updateReview(bookId: string, review: IReview) {
          try {
            const response = await this.service.updateReview(bookId, review);
            this.selectedBook!.reviews = this.selectedBook!.reviews.map(r => r.id === response.id ? response : r);
            return response;
          } catch (error) {
            console.error('Error updating review:', error);
            throw error;
          }
        },

        async deleteReview(bookId: string, reviewId: string) {
          try {
            await this.service.deleteReview(bookId, reviewId);
            this.selectedBook!.reviews = this.selectedBook!.reviews.filter(r => r.id !== reviewId);
          } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
          }
        }
    }
});
