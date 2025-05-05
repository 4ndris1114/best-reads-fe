<!-- Toasts.vue -->
<template>
    <div class="fixed top-4 right-4 space-y-2 z-[9999]">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-3 border-l-4"
        :class="toast.toastType === 'error' ? 'border-red-500' : 'border-green-500'"
      >
        <fa
          :icon="toast.toastType === 'error' ? 'exclamation-circle' : 'check-circle'"
          :class="toast.toastType === 'error' ? 'text-red-500' : 'text-green-500'"
        />
        <p class="text-sm text-gray-600">{{ toast.message }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useToastStore } from '@/stores/toastStore'
  const toastStore = useToastStore()
  </script>
  