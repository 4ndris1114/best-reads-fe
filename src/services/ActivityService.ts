import httpClient from "@/services/httpClient";
import type { IActivity } from "@/types/interfaces/IActivity";
import { mapToIActivity } from "@/utils/mappers";

export class ActivityService {
    async fetchUserFeed(): Promise<IActivity[]> {
        try {
            const response = await httpClient.get(`/activity/feed`);
            
            return response.data.map((activity: any) => mapToIActivity(activity));
        } catch (error) {
            console.error('Error fetching activities:', error);
            throw error;
        }
    }
}