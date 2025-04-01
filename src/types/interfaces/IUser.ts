import type { IBookshelf } from "./IBookshelf";
import type { IReadingProgress } from "./IReadingProgress";
import type { IReadingStats } from "./IReadingstats";

export interface IUser {
    id: string;
    username: string;
    email: string;
    profilePicture: string;
    bio: string;
    bookshelves: IBookshelf[];
    readingProgress: IReadingProgress[];
    followers: string[];
    following: string[];
    readingStats: IReadingStats;
    createdAt: Date;
}
