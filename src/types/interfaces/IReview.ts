export interface IReview {
    id: string;
    userId: string;
    ratingValue: number;
    reviewText: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}
