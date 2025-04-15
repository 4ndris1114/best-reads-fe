import type { IBook } from "@/types/interfaces/IBook";
import type { IBookshelf } from "@/types/interfaces/IBookshelf";
import type { IUser } from "@/types/interfaces/IUser";
import type { IRating } from "@/types/interfaces/IRating";

export const mapToIUser = (user: any): IUser => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    bio: user.bio,
    bookshelves: user.bookshelves.map((bookshelf: any) => mapToIBookshelf(bookshelf)),
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
    isMutable: bookshelf.isMutable
  } as IBookshelf;
}

export const mapToIBook = (book: any): IBook => {
  return {
    id: book.id,
    apiId: book.apiId,
    title: book.title,
    description: book.description,
    author: book.author,
    isbn: book.isbn,
    publishedDate: book.publishedDate,
    coverImage: book.coverImage,
    genres: book.genres,
    ratings: book.ratings.map((rating: any) => mapToIRating(rating)),
    averageRating: book.averageRating
  } as IBook;
}

export const mapToIRating = (rating: any): IRating => {
  return {
    userId: rating.userId,
    ratingValue: rating.ratingValue,
    review: rating.review,
    createdAt: rating.createdAt,
    updatedAt: rating.updatedAt
  } as IRating;
}
