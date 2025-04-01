import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '../stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (!userStore.isAuthenticated) {
          next({ name: 'auth' })
        } else {
          next()
        }
      },
    },
    {
      path: '/discover',
      name: 'discover',
      component: () => import('../views/BookListView.vue'),
    },
    {
      path: '/bookshelves',
      name: 'bookshelves',
      component: () => import('../views/BookshelfView.vue')
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
    // Uncomment and add more routes if necessary
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router
