export enum ActivityType {
    ADDED_BOOK_TO_BOOKSHELF = 'Added book to bookshelf',
    ADDED_REVIEW = 'Added review',
}

export function fromNumber(num: number): ActivityType {
    switch (num) {
        case 0:
            return ActivityType.ADDED_BOOK_TO_BOOKSHELF;
        case 1:
            return ActivityType.ADDED_REVIEW;
        default:
            throw new Error(`Unknown activity type: ${num}`);
    }
}