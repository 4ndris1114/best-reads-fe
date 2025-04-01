<template>
  <div v-if="isShelfVisible"
       class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
       @click.self="closeModal"> <!-- Close modal when clicking outside -->
    <div class="bg-white p-8 rounded-lg w-96 relative"> <!-- Increased modal size -->
      <!-- Close Button Positioned Top Right -->
      <button @click="closeModal" class="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 focus:outline-none">
        Close
      </button>

      <!-- Modal Content -->
      <form @submit.prevent="createBookshelf" class="mt-4">
        <h2 class="text-xl font-bold">Write a New Bookshelf Name</h2>
        <label for="bookshelf-name" class="block text-sm font-medium text-gray-700 mt-2">Bookshelf Name</label>

        <!-- Updated Text Field with more padding and space -->
        <input
        type="text"
        id="bookshelf-name"
        v-model="newBookshelfName"
        autocomplete="on"
        class="mt-1 block w-full py-3 px-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />

        <button type="submit" :disabled="isLoading" class="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {{ isLoading ? 'Creating...' : 'Create' }}
        </button>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useShelfStore } from '@/stores/shelfStore';

const newBookshelfName = ref('');
const userStore = useUserStore();
const shelfStore = useShelfStore();
const isLoading = ref(false);
const props = defineProps({
  isShelfVisible: Boolean,
});
const emit = defineEmits(['closeShelfModal', 'bookshelfCreated']);

const closeModal = () => {
  emit('closeShelfModal'); // Close modal
};

const createBookshelf = async () => {
  console.log("User Store:", userStore.loggedInUser); // Debugging

  if (!newBookshelfName.value.trim()) return;
  if (!userStore.loggedInUser) {
    console.error("No logged-in user found!");
    return;
  }

  isLoading.value = true;
  try {
   shelfStore.createBookshelf(userStore.loggedInUser.id, newBookshelfName.value);

    // emit('bookshelfCreated', response.data);
    newBookshelfName.value = '';
    closeModal();
  } catch (error) {
    console.error('Failed to create bookshelf:', error.message);
  } finally {
    isLoading.value = false;
  }
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
</style>
