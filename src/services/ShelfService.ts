import instance from './httpClient'
import type { IBookshelf } from '@/types/interfaces/IBookShelf'

export class ShelfService {
  async getBookshelvesForUser(userId: string) {
    try {
      const response = await instance.get(`/bookshelves/${userId}`);
      return this.mapToIBookshelf(response.data);
    } catch (error) {
      console.error('Error fetching bookshelves:', error);
      throw error;
    }
  }
mapToIBookshelf(bookshelf: any): IBookshelf {
  return {
    id: bookshelf.id,
    name: bookshelf.name,
    books: bookshelf.books,
  } as IBookshelf;
}
}
