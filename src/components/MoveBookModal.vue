<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black/[var(--bg-opacity)] [--bg-opacity:50%] flex items-center justify-center">
      <div class="bg-white border-t-7 border-red-600 relative rounded-2xl p-6 w-full max-w-md shadow-xl">
        <button class="absolute top-0 right-0 text-xl font-bold px-4 py-3 rounded-tr-lg hover:bg-gray-300" @click="emit('close')"><fa icon="times" /></button>
        <h2 class="text-xl font-semibold mb-4">Move Book</h2>
        <p class="mb-4">
          This book is already in your <strong>{{ currentShelf?.name }}</strong> shelf.
          Would you like to move it to a different one?
        </p>
        <div class="space-y-2">
          <button
            v-for="shelf in targetShelves"
            :key="shelf.id"
            @click="handleMove(shelf.id)"
            class="w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
          >
            Move to "{{ shelf.name }}"
          </button>
          <div class="flex mt-2 gap-2 justify-center">
                    <button @click="close" class="w-full px-4 py-2 text-center bg-green-100 hover:bg-gray-200 rounded-lg cursor-pointer"><span>Keep it on</span><br />
  <span class="font-semibold text-green-900">"{{ currentShelf?.name }}"</span></button>
          <button @click="emit('remove', bookId)" class="w-full px-4 py-2 text-center bg-red-100 hover:bg-gray-200 rounded-lg cursor-pointer"><span>Remove it from</span><br />
  <span class="font-semibold text-red-900">"{{ currentShelf?.name }}"</span></button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup lang="ts">
  import type { IBookshelf } from '@/types/interfaces/IBookshelf'

  const props = defineProps<{
    isOpen: boolean
    currentShelf: IBookshelf | null
    targetShelves: IBookshelf[]
    bookId: string
  }>()

  const emit = defineEmits<{
    (e: 'move', targetShelfId: string): void
    (e: 'remove', bookId: string): void
    (e: 'close'): void
  }>()

  const handleMove = (targetShelfId: string) => {
    emit('move', targetShelfId)
  }

  const close = () => {
    emit('close')
  }
  </script>
