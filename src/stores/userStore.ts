import type { IUser } from '@/types/interfaces/IUser';
import { UserService } from '@/services/UserService';

import router from '@/router'  // Import router to perform navigation
import { defineStore } from 'pinia';
import {jwtDecode} from 'jwt-decode';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    loggedInUser: null as IUser | null,
    token: "" || null as string | null,
    isAuthenticated: false, 

    userService: new UserService() as UserService,
  }),

  actions: {
    async login(email: string, password: string) {
      try {
        const token = await this.userService.login(email, password);
        this.assignToken(token);

        router.push('/');
      } catch (e: any) {
          console.error(e);
          throw e;
      }
    },

    async register() {
    },

    async logout() {
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
    }
  },
});
