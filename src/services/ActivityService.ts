import httpClient from "@/services/httpClient";
import type { IActivity } from "@/types/interfaces/IActivity";
import { mapToIActivity } from "@/utils/mappers";

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
}