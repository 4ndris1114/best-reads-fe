import httpClient from "@/services/httpClient";
import type { IComment } from "@/types/IComment";
import type { IActivity } from "@/types/interfaces/IActivity";
import { mapToIActivity, mapToIComment } from "@/utils/mappers";

export class ActivityService {
    async fetchUserFeed(skip = 0, limit = 20): Promise<IActivity[]> {
        try {
            const response = await httpClient.get(`/activity/feed?skip=${skip}&limit=${limit}`);
            return response.data.map((activity: any) => mapToIActivity(activity));
        } catch (error) {
            console.error('Error fetching activities:', error);
            throw error;
        }
    }

    async likeActivity(activityId: string, userId: string) {
        try {
            const response = await httpClient.put(`/activity/${activityId}/like`);
            return response.data;
        } catch (error) {
            console.error('Error liking activity:', error);
            throw error;
        }
    }

    async unlikeActivity(activityId: string, userId: string) {
        try {
            const response = await httpClient.put(`/activity/${activityId}/unlike`);
            return response.data;
        } catch (error) {
            console.error('Error unliking activity:', error);
            throw error;
        }
    }

    async addComment(activityId: string, commentContent: string): Promise<IComment> {
        try {
            const response = await httpClient.put(`/activity/${activityId}/comment`, commentContent, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return mapToIComment(response.data);
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    }
}