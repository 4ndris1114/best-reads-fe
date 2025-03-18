//TODO: Add missing imports (interfaces, types)
import { UserService } from '@/services/UserService';

import router from '@/router'  // Import router to perform navigation
import { defineStore } from 'pinia';
import {jwtDecode} from 'jwt-decode'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    loggedInUser: null, //todo: as IUser !!
    token: "" || null as string | null,
    isAuthenticated: false, //todo 

    userService: new UserService() as UserService,
  }),

  actions: {
    async login(email: string, password: string) {
    },

    async register() {
    },

    async logout() {
    },

    assignToken(token: string) {
    },

    persistTokenInSessionStorage(token: string) {
    },

    clearAuthData() {
    }
  },
});
