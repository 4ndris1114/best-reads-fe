import type { IUser } from '@/types/interfaces/IUser';
import instance from './httpClient'
import { mapToIUser } from '@/utils/mappers';

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

    async getUsersByIds(userIds: string[]) {
      try {
        const response = await instance.get('/user/batch?', {
          params: { ids: userIds.join(',') }
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching users by ids:', error);
        throw error;
      }
    }

    async editUserById(userId:string, user: IUser): Promise<IUser> {
    try {
      console.log(user);
      
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
}
