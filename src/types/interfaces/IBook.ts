import type { IReview } from "./IReview";

export interface IBook {
  id: string;
  apiId: string;
  title: string;
  description: string;
  numberOfPages: number,
  author: string;
  isbn: string;
  publishedDate: Date;
  coverImage: string;
  genres: [string];
  reviews: [IReview];
  averageRating: number;
}
