<template>
  <div v-if="isShelfVisible" class="modal-overlay">
    <div class="modal-content">
      <button @click="closeModal" class="modal-close">Close</button>
      <form @submit.prevent="createBookshelf">
        <h2 class="text-xl font-bold">Write a New Bookshelf Name</h2>
        <label for="bookshelf-name" class="block text-sm font-medium text-gray-700">Bookshelf Name</label>
        <input
          type="text"
          id="bookshelf-name"
          v-model="newBookshelfName"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <button type="submit" class="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Create
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const newBookshelfName = ref('');
const props = defineProps({
  isShelfVisible: Boolean,
});
const emit = defineEmits(['closeShelfModal', 'bookshelfCreated']);

const closeModal = () => {
  emit('closeShelfModal'); // Correct event name
};

const createBookshelf = () => {
  if (!newBookshelfName.value.trim()) return;

  emit('bookshelfCreated', newBookshelfName.value); // Send only the name, since parent expects a string

  newBookshelfName.value = ''; // Reset input
  closeModal(); // Close modal after creating
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 300px;
}

.modal-close {
  background-color: red;
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  border: none;
}

.modal-close:hover {
  background-color: darkred;
}
</style>
