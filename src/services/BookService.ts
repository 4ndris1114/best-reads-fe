import httpClient from "@/services/httpClient";
//todo: add missing imports for interfaces, types
import type { IBook } from "@/types/interfaces/IBook";
import type { IBookSearchResult } from "@/types/interfaces/IBookSearchResult";
import type { IReview } from "@/types/interfaces/IReview";
import { mapToIBook, mapToIBookSearchResult, mapToIReview } from "@/utils/mappers";

export class BookService {
    async getAll() {
        let attempts = 0;
        const maxAttempts = 10;
        while (attempts < maxAttempts) {
            try {
                const response = await httpClient.get('/Book');

                return response.data;
            } catch (error: any) {
                if (error.response?.status !== 408 || attempts >= maxAttempts - 1) {
                    console.error('Failed to fetch books (timeout):', error);
                    throw error;
                }
                attempts++;
                console.warn(`Retrying fetch books, attempt: ${attempts + 1}`);
            }
        }
        return []; // Return an empty array if all attempts fail
    }
    async getBookById(bookId: string) {
        try {
            const response = await httpClient.get(`/Book/${bookId}`);
            if (!response.data) {
                throw new Error('Book not found');
            }
            return mapToIBook(response.data);
        } catch (error) {
            console.error('Error fetching book:', error);
            throw error;
        }
    }

    async searchBooks(query: string): Promise<IBookSearchResult[]> {
        try {
        const response = await httpClient.get(`/book/search-internal`, {
            params: { query }
            });
            return response.data.map((bsr: any) => mapToIBookSearchResult(bsr));
        } catch (error) {
            console.error('Error searching books:', error);
            throw error;
        } 
    }

    async searchAndAddFromOpenLibrary(query: string, type: 'title' | 'author'): Promise<IBook[]> {
        try {
            const response = await httpClient.get(`/book/search-external`, {
                params: { query, type }
            });
            
            return response.data.map((bsr: any) => mapToIBook(bsr));
        } catch (error) {
            console.error('Error searching and adding from Open Library:', error);
            throw error;
        }
    }    

    async postReview(bookId: string, review: IReview) {
        try {
            const response = await httpClient.post(`/review/book/${bookId}`, review);
            
            return mapToIReview(response.data);
        } catch (error) {
            console.error('Error posting review:', error);
            throw error;
        }
    }

    async updateReview(bookId: string, review: IReview) {
        try {
            const response = await httpClient.put(`/review/${review.id}/book/${bookId}`, review);
            return mapToIReview(response.data);
        } catch (error) {
            console.error('Error updating review:', error);
            throw error;
        }
    }

    async deleteReview(bookId: string, reviewId: string) {
        try {
            await httpClient.delete(`/review/${reviewId}/book/${bookId}`);
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    }
}
