import { mapToIBookshelf } from '@/utils/mappers';
import instance from './httpClient'
import type { IBookshelf } from '@/types/interfaces/IBookshelf'

export class ShelfService {
  async getBookshelvesForUser(userId: string): Promise<IBookshelf[]> {
    try {
      const response = await instance.get(`/bookshelf/${userId}`);
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

  async createBookshelf(userId: string, newShelf: IBookshelf): Promise<IBookshelf> {
    try {
      const response = await instance.post(`/bookshelf/${userId}`, newShelf);
      if (response.status == 201) {
        return mapToIBookshelf(response.data);
      } else {
        throw new Error('Failed to create bookshelf');
      }
    } catch (error) {
      console.error('Error creating bookshelf:', error);
      throw error;
    }
  }
}
