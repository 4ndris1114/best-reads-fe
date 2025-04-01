import { mapToIBookshelf } from '@/utils/mappers';
import instance from './httpClient'
import type { IBookshelf } from '@/types/interfaces/IBookshelf'

export class ShelfService {
  async getBookshelvesForUser(userId: string): Promise<IBookshelf[]> {
    try {
      const response = await instance.get(`/bookshelves/${userId}`);
      const bookshelves = [] as IBookshelf[];
      response.data.forEach((bookshelf: any) => {
        bookshelves.push(mapToIBookshelf(bookshelf));
      })
      return bookshelves;
    } catch (error) {
      console.error('Error fetching bookshelves:', error);
      throw error;
    }
  }
}
