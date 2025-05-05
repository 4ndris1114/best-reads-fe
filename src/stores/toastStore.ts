import { defineStore } from 'pinia'

export const useToastStore = defineStore('toastStore', {
  state: () => ({
    show: false,
    message: '',
    toastType: 'success' as 'success' | 'error',
  }),
  actions: {
    triggerToast(message: string, type: 'success' | 'error' = 'success') {
      this.message = message
      this.toastType = type
      this.show = true

      setTimeout(() => {
        this.show = false
      }, 3000)
    },
  },
})