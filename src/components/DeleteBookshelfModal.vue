<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center flex justify-center items-center bg-black">
    <div class="bg-white p-4 rounded-lg w-[300px] z-50">
      <h2 class="text-xl font-bold mb-2">Are you sure you want to delete this bookshelf?</h2>
      <div class="flex justify-end gap-2">
        <button @click="emits('closeModal')" class="bg-gray-400 px-3 py-1 rounded cursor-pointer">Cancel</button>
        <button @click="deleteBookshelf" class="bg-red-600 text-white px-3 py-1 rounded cursor-pointer">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useShelfStore } from '@/stores/shelfStore';
import { useUserStore } from '@/stores/userStore';

const props = defineProps<{
  isVisible: boolean;
  bookshelfId: string;
}>();

const emits = defineEmits(['closeModal']);

const shelfStore = useShelfStore();
const userStore = useUserStore();

const deleteBookshelf = async () => {
  try {
    // Perform the delete operation
    await shelfStore.deleteBookshelf(userStore.loggedInUser!.id, props.bookshelfId);
    emits('closeModal');
  } catch (error) {
    console.error('Error deleting bookshelf:', error);
  }
};
</script>
