import type { IBookshelfBook } from "./IBookshelfBook";

export interface IBookshelf {
    id: string;
    name: string;
    books: IBookshelfBook[];
    isMutable: boolean
}
