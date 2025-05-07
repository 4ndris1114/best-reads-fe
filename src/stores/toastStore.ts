import { defineStore } from 'pinia'

let toastId = 0

export const useToastStore = defineStore('toastStore', {
  state: () => ({
    toasts: [] as { id: number; message: string; toastType: 'success' | 'error' }[],
  }),
  actions: {
    triggerToast(message: string, type: 'success' | 'error' = 'success') {
      const id = toastId++
      this.toasts.push({ id, message, toastType: type })

      setTimeout(() => {
        this.toasts = this.toasts.filter(toast => toast.id !== id)
      }, 3000)
    },
  },
})
