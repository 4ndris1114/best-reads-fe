import type { IBook } from "@/types/interfaces/IBook";
import type { IBookshelf } from "@/types/interfaces/IBookshelf";
import type { IUser } from "@/types/interfaces/IUser";
import type { IReview } from "@/types/interfaces/IReview";
import type { IActivity } from "@/types/interfaces/IActivity";

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
    numberOfPages: book.numberOfPages,
    author: book.author,
    isbn: book.isbn,
    publishedDate: book.publishedDate,
    coverImage: book.coverImage,
    genres: book.genres,
    reviews: book.reviews.map((review: any) => mapToIReview(review)),
    averageRating: book.averageRating
  } as IBook;
}

export const mapToIReview = (review: any): IReview => {
  return {
    id: review.id,
    userId: review.userId,
    ratingValue: review.ratingValue,
    reviewText: review.reviewText,
    isPublic: review.isPublic,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt
  } as IReview;
}

export const mapToIActivity = (activity: any): IActivity => {
  return {
    id: activity.id,
    userId: activity.userId,
    type: activity.type,
    createdAt: activity.createdAt,
    payload: activity.payload
  } as IActivity;
}