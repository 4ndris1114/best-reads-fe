import { jwtDecode } from 'jwt-decode'
import { useUserStore } from '@/stores/userStore'

export async function authGuard(to: any, from: any, next: any) {
  const userStore = useUserStore()
  const token = userStore.token

  if (!token) {
    return next({ name: 'auth' })
  }

  try {
    const decoded: any = jwtDecode(token)
    const now = Date.now() / 1000

    if (decoded.exp < now) {
      userStore.clearAuthData()
      return next({ name: 'auth' })
    }

    if (!userStore.loggedInUser) {
      await userStore.initAuth()
    }

    next()
  } catch (e) {
    userStore.clearAuthData()
    return next({ name: 'auth' })
  }
}