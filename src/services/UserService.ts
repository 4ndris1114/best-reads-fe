import type { IUser } from '@/types/interfaces/IUser';
import instance from './httpClient'

export class UserService {
    async login(email: String, password: String) {
        try {
            const response = await instance.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }
    
    async register(username: String, email: String, password: String) {
        try {
            const response = await instance.post('/auth/register', { username, email, password });
            return response.data;
        } catch (error) {
            console.error('Error during register:', error);
            throw error;
        }
    }

    async logout() {
        //endpoint for logout or just clear token + loggedInUser info ?
    }

    async getUserById(userId: string) {
      try {
        const response = await instance.get(`/user/${userId}`);
        return this.mapToIUser(response.data);
      } catch (error) {
        console.error('Error fetching user by id:', error);
        throw error;
      }
    }

    mapToIUser(user: any): IUser {
      return {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        bookshelves: user.bookshelves,
        readingProgress: user.readingProgress,
        followers: user.followers,
        following: user.following,
        readingStats: user.readingStats,
        createdAt: user.createdAt,
      };
    }
}
