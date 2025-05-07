import type { ActivityType } from "../enums/ActiviyType";

export interface IActivity {
    id: string;
    userId: string;
    type: ActivityType;
    createdAt: string;
    payload: any;
}