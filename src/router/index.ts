import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '../stores/userStore'
import { authGuard } from '@/router/authGuard';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: authGuard,
    },
    {
      path: '/discover',
      name: 'discover',
      component: () => import('../views/BookListView.vue'),
    },
    {
      path: '/bookshelves',
      name: 'bookshelves',
      component: () => import('../views/BookshelfView.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/bookdetails/:id',
      name: 'bookdetails',
      component: () => import('../views/BookDetailsView.vue')
    },
    {
      path: '/profile/:id',
      name: 'profilepage',
      component: () => import('../views/ProfilePageView.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/login',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isAuthenticated) {
          next({ name: 'home' })
        } else {
          next()
        }
      },
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router

