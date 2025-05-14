import type { IUser } from '@/types/interfaces/IUser';
import { UserService } from '@/services/UserService';
import type { IReadingProgress } from '@/types/interfaces/IReadingProgress';
import router from '@/router'  // Import router to perform navigation
import { defineStore } from 'pinia';
import {jwtDecode} from 'jwt-decode';
import type { IReadingChallenge } from '@/types/interfaces/IReadingChallenge';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    loggedInUser: null as IUser | null,
    token: sessionStorage.getItem('jwtToken') || null as string | null,
    isAuthenticated: false,
    loading: false,
    readingProgress:[] as Array<IReadingProgress>,

    userService: new UserService() as UserService,
  }),

  actions: {
    async initAuth() {
      if (this.token) {
        try {
          const decoded = jwtDecode<{ userId: string }>(this.token);
          this.loggedInUser = await this.getUserById(decoded.userId);
          sessionStorage.setItem('loggedInUserId', this.loggedInUser.id);
          this.isAuthenticated = true;
        } catch (error) {
          console.error("Failed to restore session:", error);
          this.clearAuthData();
        }
      }
    },

    async login(email: string, password: string) {
      try {
        const token = await this.userService.login(email, password);
        this.assignToken(token);

        router.push('/');
      } catch (e: any) {
          throw e;
      }
    },

    async register(username: string, email: string, password: string) {
      try {
        await this.userService.register(username, email, password);
      } catch (e) {
        throw e;
      }
    },

    async logout() {
      try {
        await this.userService.logout();
      } catch (e) {
        console.warn('Server logout failed. Proceeding with local cleanup.');
      } finally {
        this.clearAuthData();
        router.push('/login');
      }
    },

    async getUserById(userId: string) {
      try {
        const user = await this.userService.getUserById(userId);
        return user;
      } catch (e: any) {
        console.error(e);
        throw e;
      }
    },

    async getUsersByIds(userIds: string[]) {
      try {
        const users = await this.userService.getUsersByIds(userIds);
        return users;
      } catch (e: any) {
        console.error(e);
        throw e;
      }
    },

    async getAllReadingProgress(userId: string) {
      try {
        this.loading = true;
        const readingProgress = await this.userService.getAllReadingProgress(userId);
        if(readingProgress) {
          this.readingProgress = readingProgress;
        }
      } catch (e: any) {
        console.error(e);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async getReadingProgressById(progressId: string, userId: string): Promise<IReadingProgress> {
      try {
        this.loading = true;
        const readingProgress = await this.userService.getReadingProgressById(progressId, userId);
        if (readingProgress) {
          return readingProgress;
        } throw new Error(`Failed to retrieve reading progress ${progressId}`);
      } catch (e: any) {
        console.error(e);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async editReadingProgressById(userId: string, progressId: string, readingProgress: IReadingProgress) {
      try {
        const response = await this.userService.editReadingProgressById(userId, progressId, readingProgress);
        if (response) {
          return response;
        }
        this.getAllReadingProgress(userId);
        throw new Error("Error");
      } catch (e: any) {
        console.error("Error editing reading progress:", e);
        throw e;
      }
    },

    async editUserById(userId:string, IUser: IUser) {
      try {
        const response = await this.userService.editUserById(userId, IUser);
        if (response) {
          this.loggedInUser = response
          return response;
        }
        throw new Error("Error");
      } catch (e: any) {
        console.error("Error editing user:", e);
        throw e;
      }
    },

    async assignToken(token: string) {
      this.persistTokenInSessionStorage(token);
      this.token = token;
      this.isAuthenticated = true;
      try {
        const decoded = jwtDecode<{ userId: string }>(token);
        this.loggedInUser = await this.getUserById(decoded.userId); // Fetch full user details
      } catch (error) {
        console.error("Error decoding token:", error);
        this.clearAuthData();
      }
    },

    persistTokenInSessionStorage(token: string) {
      sessionStorage.setItem('jwtToken', token);
    },

    clearAuthData() {
      sessionStorage.removeItem('jwtToken');
      this.token = null;
      this.isAuthenticated = false;
      this.loggedInUser = null;
    },

    async followUser(userId: string, friendId: string) {
      try {
        const response = await this.userService.followUser(userId, friendId);
        return response;
      } catch (e) {
        throw e;
      }
    },

    async unfollowUser(userId: string, friendId: string) {
      try {
        const response = await this.userService.unfollowUser(userId, friendId);
        return response;
      } catch (e) {
        throw e;
      }
    },

    async searchByUsername(username: string) {
      try {
        const response = await this.userService.searchByUsername(username);
        return response;
      } catch (e) {
        throw e;
      }
    },

    async createReadingChallenge(readingChallenge: IReadingChallenge): Promise<IReadingChallenge> {
      try {
        const response = await this.userService.createReadingChallenge(readingChallenge, this.loggedInUser!.id);
        return response;
      } catch (e) {
        throw e;
      }
    },

    async updateReadingChallenge(readingChallenge: IReadingChallenge): Promise<IReadingChallenge> {
      try {
        const response = await this.userService.updateReadingChallenge(readingChallenge, this.loggedInUser!.id);
        return response;
      } catch (e) {
        throw e;
      }
    },

    async deleteReadingChallenge(readingChallengeId: string): Promise<boolean> {
      try {
        const response = await this.userService.deleteReadingChallenge(readingChallengeId, this.loggedInUser!.id);
        return response;
      } catch (e) {
        throw e;
      }
    },

    async getCloudinarySignature(userId: string): Promise<{ timestamp: string; signature: string }> {
      try {
        const response = await this.userService.getCloudinarySignature(userId);
        return response;
      } catch (e) {
        throw e;
      }
    },
  },
});
