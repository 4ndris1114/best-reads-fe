<template>
    <div
      class="fixed drop-shadow-lg inset-0 bg-black/[var(--bg-opacity)] [--bg-opacity:50%] flex justify-center items-center z-50"@click.self="emits('closeModal')"
    >
      <div class="relative bg-white p-6 pt-10 rounded-lg w-[300px] border border-red-600 shadow-lg">
        <!-- Centered Delete Icon -->
        <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-md">
          <fa icon="trash-alt" class="text-red-600 text-2xl" />
        </div>
  
        <h2 class="text-lg font-semibold text-center mb-6">
          Are you sure you want to delete your reading challenge?
        </h2>
  
        <!-- Centered Buttons with equal width -->
        <div class="flex justify-center gap-4">
          <button
            @click="emits('closeModal')"
            class="w-24 px-3 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            @click="emits('deleteChallenge')"
            class="w-24 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup lang="ts">
  const emits = defineEmits(['closeModal', 'deleteChallenge']);
  </script>
  