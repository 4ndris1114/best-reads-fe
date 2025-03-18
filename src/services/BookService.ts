import httpClient from "@/services/httpClient";
//todo: add missing imports for interfaces, types

export class BookService {
    async getAll() {
        let attempts = 0;
        const maxAttempts = 10;
        while (attempts < maxAttempts) {
            try {
                const response = await httpClient.get('/Book');
                console.log(response);
                
                return response.data;
            } catch (error: any) {
                if (error.response?.status !== 408 || attempts >= maxAttempts - 1) {
                    console.error('Failed to fetch books (timeout):', error);
                    throw error;
                }
                attempts++;
                console.warn(`Retrying fetch books, attempt: ${attempts + 1}`);
            }
        }
        return []; // Return an empty array if all attempts fail
    }
}