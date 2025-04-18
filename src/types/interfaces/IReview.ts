export interface IReview {
    id: string;
    userId: string;
    ratingValue: number;
    reviewText: string;
    createdAt: Date;
    updatedAt: Date;
}
