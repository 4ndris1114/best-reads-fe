import type { IUser } from '@/types/interfaces/IUser';
import { UserService } from '@/services/UserService';

import router from '@/router'  // Import router to perform navigation
import { defineStore } from 'pinia';
import {jwtDecode} from 'jwt-decode'

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

    assignToken(token: string) {
      this.persistTokenInSessionStorage(token);
      this.token = token;
      this.isAuthenticated = true;
      // this.loggedInUser = jwtDecode(token) as IUser;
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
