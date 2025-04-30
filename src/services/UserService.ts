import type { IUser } from '@/types/interfaces/IUser';
import instance from './httpClient'
import { mapToIUser, mapToReadingProgress } from '@/utils/mappers';

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
      try {
        const response = await instance.post('/auth/logout');
        return response.data;
      } catch (error) {
        console.error('Error during logout:', error);
        throw error;
      }
    }

    async getUserById(userId: string) {
      try {
        const response = await instance.get(`/user/${userId}`);
        return mapToIUser(response.data);
      } catch (error) {
        console.error('Error fetching user by id:', error);
        throw error;
      }
    }

    async getAllReadingProgress(userId: string) {
      try {
        const response = await instance.get(`/Stats/${userId}`);
        return response.data.map((r:any) => mapToReadingProgress(r));
      } catch (error) {
        console.error('Error fetching reading progress:', error);
        throw error;
      }
    }

    async getReadingProgressById(progressId: string) {
      try {
        const response = await instance.get(`/Stats/${progressId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching reading progress:', error);
        throw error;
      }
    }

    async editUserById(userId:string, user: IUser): Promise<IUser> {
    try {
      const response = await instance.put(`/user/${userId}/edit`, user, {
        headers: {
              'Content-Type': 'application/json',
            },
          });
        if (response.status == 200) {
          return mapToIUser(response.data);
        } else {
          throw new Error('Failed to edit user');
        }
      } catch (error) {
        console.error('Error editing user:', error);
        throw error;
      }
    }

    async followUser(userId: string, followingId: string) {
      try {
        const response = await instance.post(`/user/${userId}/follow/${followingId}`);
        return response.data;
      } catch (error) {
        console.error('Error following user:', error);
        throw error;
      }
    }

    async unfollowUser(userId: string, followingId: string) {
      try {
        const response = await instance.delete(`/user/${userId}/unfollow/${followingId}`);
        return response.data;
      } catch (error) {
        console.error('Error unfollowing user:', error);
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
      } as IUser;
    }
}
