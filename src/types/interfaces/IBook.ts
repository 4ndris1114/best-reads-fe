export interface IBook {
  id: string;
  apiId: string;
  title: string;
  author: string;
  isbn: string;
  publishedDate: Date;
  coverImage: string;
  genres: [string];
  ratings: [string]; //needs to be changed
  averageRating: number;
}
