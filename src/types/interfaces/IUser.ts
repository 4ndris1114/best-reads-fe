export interface IUser {
    _id?: string;
    username: string;
    email: string;
    password: string;
    profilePicture: string;
    bio: string;
    bookshelves?: IBookshelf[];
    readingProgress?: ReadingProgress[];
    followers: string[];
    following: string[];
    readingStats: ReadingStats;
    createdAt: Date;
}
