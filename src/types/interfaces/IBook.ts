import type { IRating } from "./IRating";

export interface IBook {
  id: string;
  apiId: string;
  title: string;
  description: string;
  author: string;
  isbn: string;
  publishedDate: Date;
  coverImage: string;
  genres: [string];
  ratings: [IRating];
  averageRating: number;
}
