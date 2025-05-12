import type { IUser } from '@/types/interfaces/IUser';
import instance from './httpClient'
import { mapToIReadingChallenge, mapToIUser, mapToReadingProgress } from '@/utils/mappers';
import type { IReadingProgress } from '@/types/interfaces/IReadingProgress';
import type { IReadingChallenge } from '@/types/interfaces/IReadingChallenge';

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
      const response = await instance.get(`/stats/${userId}`);
      return response.data.map((r: any) => mapToReadingProgress(r));
    } catch (error) {
      console.error('Error fetching reading progress:', error);
      throw error;
    }
  }

  async getReadingProgressById(progressId: string, userId: string) {
    try {
      const response = await instance.get(`/Stats/${userId}/progress/${progressId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reading progress:', error);
      throw error;
    }
  }

  async editReadingProgressById(userId: string, progressId: string, readingProgress: IReadingProgress) {
    try {
      const response = await instance.put(`/Stats/${userId}/edit/${progressId}`, readingProgress, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status == 200) {
        return mapToReadingProgress(response.data);
      } else {
        throw new Error('Failed to edit reading progress');
      }
    } catch (error) {
      console.error('Error editing reading progress:', error);
      throw error;
    }
  }

  async editUserById(userId: string, user: IUser): Promise<IUser> {
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

  async followUser(userId: string, friendId: string) {
    try {
      const response = await instance.post(`/user/${userId}/follow/${friendId}`);
      return mapToIUser(response.data);
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  }

  async unfollowUser(userId: string, friendId: string) {
    try {
      const response = await instance.delete(`/user/${userId}/unfollow/${friendId}`);
      return mapToIUser(response.data);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  }

  async searchByUsername(username: string) {
    try {
      const response = await instance.get(`/user/search?query=${username}`);
      return response.data;
    } catch (error) {
      console.error('Error searching by username:', error);
      throw error;
    }
  }

  async createReadingChallenge(readingChallenge: IReadingChallenge, userId: string): Promise<IReadingChallenge> {
    try {
      const response = await instance.post(`/ReadingChallenge/${userId}`, readingChallenge, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status == 200) {
        return mapToIReadingChallenge(response.data);
      } else {
        throw new Error('Failed to create reading challenge');
      }
    } catch (error) {
      console.error('Error creating reading challenge:', error);
      throw error;
    }
  }

  async updateReadingChallenge(readingChallenge: IReadingChallenge, userId: string): Promise<IReadingChallenge> {
    try {
      const response = await instance.put(`/ReadingChallenge/${userId}/${readingChallenge.id}`, readingChallenge, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status == 200) {
        return mapToIReadingChallenge(response.data);
      } else {
        throw new Error('Failed to update reading challenge');
      }
    } catch (error) {
      console.error('Error updating reading challenge:', error);
      throw error;
    }
  }

  async deleteReadingChallenge(readingChallengeId: string, userId: string): Promise<boolean> {
    try {
      const response = await instance.delete(`/ReadingChallenge/${userId}/${readingChallengeId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting reading challenge:', error);
      throw error;
    }
  }

  async getCloudinarySignature(userId: string): Promise<{ timestamp: string; signature: string }> {
    try {
      const response = await instance.get(`/cloudinary/${userId}/generate-signature`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cloudinary signature:', error);
      throw error;
    }
  }
}
