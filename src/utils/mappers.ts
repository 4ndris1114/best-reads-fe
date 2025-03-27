import type { IBook } from "@/types/interfaces/IBook";
import type { IBookshelf } from "@/types/interfaces/IBookshelf";
import type { IUser } from "@/types/interfaces/IUser";

export const mapToIUser = (user: any): IUser => {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      bookshelves: user.bookshelves.map((bookshelf: any) => mapToIBookshelf(bookshelf)) as IBookshelf[],
      readingProgress: user.readingProgress,
      followers: user.followers,
      following: user.following,
      readingStats: user.readingStats,
      createdAt: user.createdAt,
    } as IUser;
  }

  export const mapToIBookshelf = (bookshelf: any): IBookshelf => {
    return {
      id: bookshelf.id,
      name: bookshelf.name,
      books: bookshelf.books,
    } as IBookshelf;
  }

 export const mapToIBook = (book: any): IBook => {
    return {
      id: book._id,
      apiId: book.apiId,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publishedDate: book.publishedDate,
      coverImage: book.coverImage,
      genres: book.genres,
      ratings: book.ratings,
      averageRating: book.averageRating
    } as IBook;
}