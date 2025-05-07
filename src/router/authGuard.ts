import { jwtDecode } from 'jwt-decode'
import { useUserStore } from '@/stores/userStore'
import { useToastStore } from '@/stores/toastStore'

export async function authGuard(to: any, from: any, next: any) {
  const userStore = useUserStore()
  const toastStore = useToastStore()
  const token = userStore.token
  
  if (!token) {
    return next({ name: 'auth' })
  }

  try {
    const decoded: any = jwtDecode(token)
    const now = Date.now() / 1000

    if (decoded.exp < now) {
      toastStore.triggerToast('Session expired, please log in again', 'error' )
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