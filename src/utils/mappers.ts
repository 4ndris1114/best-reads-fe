import type { IBook } from "@/types/interfaces/IBook";
import type { IBookshelf } from "@/types/interfaces/IBookshelf";
import type { IUser } from "@/types/interfaces/IUser";
import type { IReview } from "@/types/interfaces/IReview";
import type { IReadingProgress } from "@/types/interfaces/IReadingProgress";
import type { IActivity } from "@/types/interfaces/IActivity";
import type { ActivityType } from "@/types/enums/ActiviyType";
import type { IReadingChallenge } from "@/types/interfaces/IReadingChallenge";
import type { IBookshelfBook } from "@/types/interfaces/IBookshelfBook";
import type { IComment } from "@/types/IComment";
import type { IBookSearchResult } from "@/types/interfaces/IBookSearchResult";


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
    readingChallenges: user.readingChallenges,
    createdAt: user.createdAt,
  } as IUser;
}

export const mapToIBookshelf = (bookshelf: any): IBookshelf => {
  return {
    id: bookshelf.id,
    name: bookshelf.name,
    books: bookshelf.books.map((bookshelfBook: any) => mapToIBookshelfBook(bookshelfBook)),
    isMutable: bookshelf.isMutable
  } as IBookshelf;
}

export const mapToIBookshelfBook = (bookshelfBook: any): IBookshelfBook => {
  return {
    id: bookshelfBook.id,
    updatedAt: bookshelfBook.updatedAt
  } as IBookshelfBook;
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

export const mapToIBookSearchResult = (book: any): IBookSearchResult => {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    genres: book.genres,
    coverImage: book.coverImage,
    averageRating: book.averageRating
  } as IBookSearchResult
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

  export const mapToReadingProgress = (readingProgress: any): IReadingProgress => {
    return {
      id: readingProgress.id,
      bookId: readingProgress.bookId,
      currentPage: readingProgress.currentPage,
      totalPages: readingProgress.totalPages,
      updatedAt: readingProgress.updatedAt
    } as IReadingProgress
  }

export const mapToIActivity = (activity: any): IActivity => {
  return {
    id: activity.id,
    userId: activity.userId,
    type: activity.type as ActivityType,
    createdAt: activity.createdAt,
    payload: activity.payload,
    likes: activity.likes,
    comments: activity.comments.map((comment: any) => mapToIComment(comment)),
  } as IActivity;
}

export const mapToIComment = (comment: any): IComment => {
  return {
    id: comment.id,
    userId: comment.userId,
    content: comment.content,
    createdAt: comment.createdAt,
  } as IComment;
}

export const mapToIReadingChallenge = (readingChallenge: any): IReadingChallenge => {
  return {
    id: readingChallenge.id,
    year: readingChallenge.year,
    goal: readingChallenge.goal,
    progress: readingChallenge.progress,
    updatedAt: readingChallenge.updatedAt
  } as IReadingChallenge
}
