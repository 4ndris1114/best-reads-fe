import type { IBookshelf } from "@/types/interfaces/IBookshelf";
import type { IBook } from "@/types/interfaces/IBook";

// This method checks the 3 basic shelves: Want to read, Currently reading, and Read.
// If the book is in any of these shelves, it returns the shelf it is already in.
export const isBookInBasicShelf = (book: IBook, shelves: IBookshelf[]): IBookshelf | undefined => {
    return shelves.find(shelf => {
        return shelf.books.some(bookRef => bookRef.id === book.id);
    });
}
